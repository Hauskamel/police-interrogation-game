import { faker } from "@faker-js/faker";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { DOCUMENT_INTEGRITY_TYPES } from "@game/documents/data";
import {
    CONTROL_SCENARIOS_BY_TYPE,
    CONTROL_SCENARIO_TYPES
} from "@game/inspections/data";
import { resetGameClock } from "@game/shared";
import { HOME_COUNTRY } from "@game/npcs/data";

import { TRAFFIC_ENTITY_TYPES } from "../data";
import { generateTrafficEntity } from "./generateTrafficEntity.js";

const GAME_DATE = "2026-08-03";

describe("generateTrafficEntity control scenarios", () => {
    beforeEach(() => {
        faker.seed(20260803);
        resetGameClock();
    });

    afterEach(() => {
        resetGameClock();
    });

    it("creates a genuinely clean control when the clean scenario is selected", () => {
        const entity = createCivilianScenarioEntity(CONTROL_SCENARIO_TYPES.CLEAN);

        expect(entity.documentState.hasForgery).toBe(false);
        expect(entity.driverProfile.real.driversLicense.expiryDate >= GAME_DATE).toBe(true);
        expect(entity.insuranceProfile.real.status).toBe("active");
        expect(entity.controlScenario).toEqual({
            type: CONTROL_SCENARIO_TYPES.CLEAN,
            category: "clean",
            complexityLevel: 1,
            deceptionRisk: 0,
            focusAreas: ["routine_documents"]
        });
        expect(
            Object.values(entity.documentAvailability).every(
                (availability) => availability === "provided"
            )
        ).toBe(true);
    });

    it("creates an old-enough driver with an expired license", () => {
        const entity = createCivilianScenarioEntity(
            CONTROL_SCENARIO_TYPES.EXPIRED_LICENSE
        );

        expect(entity.driverProfile.real.age).toBeGreaterThanOrEqual(34);
        expect(entity.driverProfile.real.driversLicense.expiryDate < GAME_DATE).toBe(true);
        expect(entity.insuranceProfile.real.status).toBe("active");
        expect(entity.documentState.hasForgery).toBe(false);
    });

    it.each([
        [CONTROL_SCENARIO_TYPES.FORGED_IDENTITY, "npcDocuments", "driversLicense"],
        [CONTROL_SCENARIO_TYPES.FORGED_VEHICLE, "vehicleDocuments", "registration"],
        [CONTROL_SCENARIO_TYPES.FORGED_INSURANCE, "vehicleDocuments", "insurance"]
    ])("creates only the document forgery requested by %s", (
        scenarioType,
        documentGroup,
        documentName
    ) => {
        const entity = createCivilianScenarioEntity(scenarioType);
        const forgedDocument = entity.documentState[documentGroup][documentName];
        const integrityValues = [
            entity.documentState.npcDocuments.driversLicense.integrity,
            entity.documentState.vehicleDocuments.registration.integrity,
            entity.documentState.vehicleDocuments.insurance.integrity
        ];

        expect(entity.documentState.hasForgery).toBe(true);
        expect(forgedDocument.integrity).toBe(DOCUMENT_INTEGRITY_TYPES.FORGED);
        expect(
            integrityValues.filter(
                (integrity) => integrity === DOCUMENT_INTEGRITY_TYPES.FORGED
            )
        ).toHaveLength(1);
    });

    it("creates scenario-specific document availability", () => {
        const entity = createCivilianScenarioEntity(
            CONTROL_SCENARIO_TYPES.MISSING_LICENSE
        );

        expect(entity.documentAvailability.driversLicense).toBe("forgotten");
        expect(entity.documentAvailability.carDocuments).toBe("provided");
    });

    it.each([
        [CONTROL_SCENARIO_TYPES.FINAL_REFUSAL, "carDocuments", "refused"],
        [CONTROL_SCENARIO_TYPES.WRONG_DOCUMENT, "proofOfInsurance", "wrong_document"]
    ])("creates terminal document behavior for %s", (
        scenarioType,
        documentType,
        expectedAvailability
    ) => {
        const entity = createCivilianScenarioEntity(scenarioType);

        expect(entity.documentAvailability[documentType]).toBe(
            expectedAvailability
        );
    });

    it("creates a stable contradictory statement for an interview case", () => {
        const entity = createCivilianScenarioEntity(
            CONTROL_SCENARIO_TYPES.CONTRADICTORY_STATEMENT
        );

        expect(entity.statementProfile.responses.address.fieldId).toBe(
            "statement.address"
        );
        expect(entity.statementProfile.responses.address.findingId).toBeUndefined();
        expect(entity.statementProfile.responses.address.text).not.toBe(
            entity.driverProfile.real.address
        );
    });

    it("creates both related permits when the Dev GUI requires a work permit", () => {
        const entity = generateTrafficEntity({
            forcedType: TRAFFIC_ENTITY_TYPES.CIVILIAN,
            forcedRequiresResidencePermit: true,
            forcedRequiresWorkPermit: true
        });

        expect(entity.driverProfile.real.countryOfOrigin).not.toBe(HOME_COUNTRY);
        expect(entity.driverProfile.real.residencePermit).toBeTruthy();
        expect(entity.driverProfile.real.workPermit.residencePermitId).toBe(
            entity.driverProfile.real.residencePermit.permitId
        );
    });
});

// Erzwingt nur den NPC-Typ. Das kontrollrelevante Dokumentproblem kommt weiterhin aus dem Szenario.
function createCivilianScenarioEntity(scenarioType) {
    return generateTrafficEntity({
        forcedType: TRAFFIC_ENTITY_TYPES.CIVILIAN,
        controlScenario: CONTROL_SCENARIOS_BY_TYPE[scenarioType]
    });
}
