import { describe, expect, it } from "vitest";

import {
    INSPECTION_DECISIONS,
    INSPECTION_DOCUMENT_TYPES,
    INSPECTION_OUTCOMES,
    INSPECTION_RESOLUTION_ACTIONS
} from "../data";
import { evaluateInspection } from "./evaluateInspection.js";


describe("evaluateInspection", () => {
    it("allows an unremarkable vehicle to continue", () => {
        const result = evaluateCase({
            playerDecisionType: INSPECTION_DECISIONS.ALLOW_TO_CONTINUE
        });

        expect(result.actualFindingIds).toEqual([]);
        expect(result.expectedDecision).toBe(
            INSPECTION_DECISIONS.ALLOW_TO_CONTINUE
        );
        expect(result.outcome).toBe(INSPECTION_OUTCOMES.CORRECT);
        expect(result.resolutionAction).toBe(
            INSPECTION_RESOLUTION_ACTIONS.RELEASED
        );
    });

    it("requires continuation to be denied for an expired license", () => {
        const trafficEntity = createTrafficEntity();
        trafficEntity.driverProfile.real.driversLicense.expiryDate = "2026-08-02";

        const result = evaluateCase({
            trafficEntity,
            reasonCodes: ["expired_drivers_license"],
            playerDecisionType: INSPECTION_DECISIONS.DENY_CONTINUATION
        });

        expect(result.actualFindingIds).toContain("expired_drivers_license");
        expect(result.expectedDecision).toBe(
            INSPECTION_DECISIONS.DENY_CONTINUATION
        );
        expect(result.outcome).toBe(INSPECTION_OUTCOMES.CORRECT);
    });

    it("requires forged documents to be seized", () => {
        const trafficEntity = createTrafficEntity();
        trafficEntity.documentState.npcDocuments.driversLicense.affectedFields = [
            "address"
        ];

        const result = evaluateCase({
            trafficEntity,
            reasonCodes: ["driver_address_mismatch"],
            playerDecisionType: INSPECTION_DECISIONS.SEIZE_DOCUMENTS
        });

        expect(result.actualFindingIds).toEqual(["driver_address_mismatch"]);
        expect(result.expectedDecision).toBe(INSPECTION_DECISIONS.SEIZE_DOCUMENTS);
        expect(result.outcome).toBe(INSPECTION_OUTCOMES.CORRECT);
    });

    it("does not expose a forgery without its canonical registry record", () => {
        const trafficEntity = createTrafficEntity();
        trafficEntity.documentState.npcDocuments.driversLicense.affectedFields = [
            "address"
        ];
        const officialRegistry = createOfficialRegistry();
        officialRegistry.driverLicensesByNumber = {};

        const result = evaluateCase({
            trafficEntity,
            officialRegistry,
            playerDecisionType: INSPECTION_DECISIONS.ALLOW_TO_CONTINUE
        });

        expect(result.actualFindingIds).toEqual([]);
        expect(result.expectedDecision).toBe(
            INSPECTION_DECISIONS.ALLOW_TO_CONTINUE
        );
    });

    it("prioritizes an active wanted record over all ordinary decisions", () => {
        const trafficEntity = createTrafficEntity();
        trafficEntity.police = {
            status: "wanted",
            wantedRecordId: "wanted--one"
        };
        const criminalDatabase = {
            wantedRecordsById: {
                "wanted--one": {
                    id: "wanted--one",
                    npcId: trafficEntity.npcId,
                    status: "active"
                }
            }
        };

        const result = evaluateCase({
            trafficEntity,
            criminalDatabase,
            playerDecisionType: INSPECTION_DECISIONS.REPORT_WANTED_HIT
        });

        expect(result.actualFindingIds).toEqual(["active_wanted_record"]);
        expect(result.expectedDecision).toBe(
            INSPECTION_DECISIONS.REPORT_WANTED_HIT
        );
        expect(result.outcome).toBe(INSPECTION_OUTCOMES.CORRECT);
        expect(result.resolutionAction).toBe(
            INSPECTION_RESOLUTION_ACTIONS.TRANSFERRED
        );
    });

    it("does not punish hidden crimes or police knowledge without a wanted record", () => {
        const trafficEntity = createTrafficEntity();
        trafficEntity.truth = {
            role: "criminal",
            crimeRecordIds: ["crime--hidden"]
        };
        trafficEntity.police = {
            status: "known",
            wantedRecordId: null
        };

        const result = evaluateCase({
            trafficEntity,
            criminalDatabase: {
                wantedRecordsById: {}
            },
            playerDecisionType: INSPECTION_DECISIONS.ALLOW_TO_CONTINUE
        });

        expect(result.actualFindingIds).toEqual([]);
        expect(result.expectedDecision).toBe(
            INSPECTION_DECISIONS.ALLOW_TO_CONTINUE
        );
        expect(result.outcome).toBe(INSPECTION_OUTCOMES.CORRECT);
    });

    it.each([
        ["refused", "document_refusal"],
        ["wrong_document", "wrong_document_presented"]
    ])("denies continuation for terminal document state %s", (
        availability,
        findingId
    ) => {
        const trafficEntity = createTrafficEntity();
        trafficEntity.documentAvailability = {
            proofOfInsurance: availability
        };

        const result = evaluateCase({
            trafficEntity,
            reasonCodes: [findingId],
            playerDecisionType: INSPECTION_DECISIONS.DENY_CONTINUATION
        });

        expect(result.actualFindingIds).toContain(findingId);
        expect(result.expectedDecision).toBe(
            INSPECTION_DECISIONS.DENY_CONTINUATION
        );
    });

    it("does not expect a contradictory statement before the question was asked", () => {
        const trafficEntity = createTrafficEntity();
        trafficEntity.statementProfile = {
            responses: {
                address: {
                    value: "Lindenstraße 14"
                }
            }
        };
        const officialRegistry = createOfficialRegistry();
        officialRegistry.peopleById[trafficEntity.npcId].address = "Hauptstrasse 1";

        const unaskedResult = evaluateCase({
            trafficEntity,
            officialRegistry,
            playerDecisionType: INSPECTION_DECISIONS.ALLOW_TO_CONTINUE
        });
        const askedResult = evaluateCase({
            trafficEntity,
            officialRegistry,
            conversationEntries: [{
                type: "interview",
                questionId: "address"
            }],
            reasonCodes: ["inconsistent_driver_statement"],
            playerDecisionType: INSPECTION_DECISIONS.HOLD_FOR_CLARIFICATION
        });

        expect(unaskedResult.actualFindingIds).toEqual([]);
        expect(askedResult.actualFindingIds).toContain(
            "inconsistent_driver_statement"
        );
    });
});

function evaluateCase({
    trafficEntity = createTrafficEntity(),
    officialRegistry = createOfficialRegistry(),
    criminalDatabase = { wantedRecordsById: {} },
    conversationEntries = [],
    reasonCodes = [],
    playerDecisionType
}) {
    return evaluateInspection({
        inspectionSession: {
            startedAt: "2026-08-03T08:00:00.000Z",
            openedDocuments: Object.values(INSPECTION_DOCUMENT_TYPES),
            conversationEntries,
            findings: reasonCodes.map((findingId) => ({ findingId }))
        },
        trafficEntity,
        criminalDatabase,
        officialRegistry,
        playerDecision: {
            type: playerDecisionType,
            reasonCodes
        }
    });
}

function createTrafficEntity() {
    return {
        id: "traffic--one",
        npcId: "npc--one",
        vehicleId: "vehicle--one",
        driverProfile: {
            real: {
                driversLicense: {
                    licenseNumber: "ABC-12345678",
                    expiryDate: "2030-08-03"
                }
            }
        },
        vehicleProfile: {
            real: {
                vehicleId: "vehicle--one"
            }
        },
        insuranceProfile: {
            real: {
                policyId: "insurance--one",
                validUntil: "2030-08-03"
            }
        },
        documentState: {
            npcDocuments: {
                driversLicense: {
                    affectedFields: []
                }
            },
            vehicleDocuments: {
                registration: {
                    affectedFields: []
                },
                insurance: {
                    affectedFields: []
                }
            }
        },
        truth: {
            role: "civilian",
            crimeRecordIds: []
        },
        police: {
            status: "unknown",
            wantedRecordId: null
        }
    };
}

function createOfficialRegistry() {
    return {
        peopleById: {
            "npc--one": {
                npcId: "npc--one"
            }
        },
        driverLicensesByNumber: {
            "ABC-12345678": {
                licenseNumber: "ABC-12345678",
                npcId: "npc--one"
            }
        },
        vehiclesById: {
            "vehicle--one": {
                vehicleId: "vehicle--one"
            }
        },
        insurancePoliciesById: {
            "insurance--one": {
                policyId: "insurance--one"
            }
        }
    };
}
