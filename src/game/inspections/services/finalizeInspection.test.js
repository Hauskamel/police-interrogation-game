import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
    CONTROL_SCENARIOS_BY_TYPE,
    CONTROL_SCENARIO_TYPES,
    INSPECTION_DECISIONS,
    INSPECTION_DOCUMENT_TYPES,
    INSPECTION_STATUSES
} from "../data";
import {
    useControlScenarioStore,
    useInspectionStore,
    useNpcStore,
    useOfficialRegistryStore,
    useTrafficStore
} from "@stores";
import { finalizeInspection } from "./finalizeInspection.js";

describe("finalizeInspection", () => {
    beforeEach(resetStores);
    afterEach(resetStores);

    it("records progress and applies the traffic consequence before the report closes", () => {
        const trafficEntity = createCleanTrafficEntity();
        useTrafficStore.getState().addTrafficEntity(trafficEntity);
        useTrafficStore.getState().setSelectedVehicleId(trafficEntity.id);
        useOfficialRegistryStore.setState({
            officialRegistry: createOfficialRegistry()
        });

        useInspectionStore.getState().startInspection(trafficEntity.id);
        Object.values(INSPECTION_DOCUMENT_TYPES).forEach((documentType) => {
            useInspectionStore.getState().requestDocument(documentType);
        });
        const inspection = useInspectionStore.getState().activeInspection;

        finalizeInspection({
            inspectionSession: inspection,
            trafficEntity,
            playerDecision: {
                type: INSPECTION_DECISIONS.ALLOW_TO_CONTINUE,
                reasonCodes: []
            }
        });

        const report = useInspectionStore.getState().lastCompletedInspection;
        const storedEntity = useTrafficStore.getState().trafficEntities[0];

        expect(report.status).toBe(INSPECTION_STATUSES.COMPLETED);
        expect(storedEntity.stopped).toBe(false);
        expect(useTrafficStore.getState().selectedVehicleId).toBeNull();
        expect(
            useControlScenarioStore.getState().completedScenarioHistory
        ).toHaveLength(1);
    });
});

function resetStores() {
    useInspectionStore.getState().resetInspectionState();
    useControlScenarioStore.getState().resetCompletedScenarioHistory();
    useOfficialRegistryStore.getState().resetOfficialRegistry();
    useTrafficStore.setState({
        trafficEntities: [],
        selectedVehicleId: null,
        revealedDriverIdentityByTrafficEntityId: {}
    });
    useNpcStore.setState({
        criminalDatabase: {
            wantedRecordsById: {}
        }
    });
}

function createCleanTrafficEntity() {
    return {
        id: "traffic--one",
        npcId: "npc--one",
        vehicleId: "vehicle--one",
        stopped: true,
        spawn: {
            spawnForDevPurposes: false
        },
        controlScenario: CONTROL_SCENARIOS_BY_TYPE[
            CONTROL_SCENARIO_TYPES.CLEAN
        ],
        driverProfile: {
            real: {
                driversLicense: {
                    licenseNumber: "ABC-12345678",
                    expiryDate: "2030-08-03"
                }
            }
        },
        insuranceProfile: {
            real: {
                policyId: "insurance--one",
                validUntil: "2030-08-03"
            }
        },
        documentAvailability: {},
        documentState: {
            npcDocuments: {
                driversLicense: { affectedFields: [] }
            },
            vehicleDocuments: {
                registration: { affectedFields: [] },
                insurance: { affectedFields: [] }
            }
        },
        police: {
            wantedRecordId: null
        }
    };
}

function createOfficialRegistry() {
    return {
        peopleById: {
            "npc--one": { npcId: "npc--one" }
        },
        driverLicensesByNumber: {
            "ABC-12345678": {
                licenseNumber: "ABC-12345678",
                npcId: "npc--one"
            }
        },
        vehiclesById: {
            "vehicle--one": { vehicleId: "vehicle--one" }
        },
        insurancePoliciesById: {
            "insurance--one": { policyId: "insurance--one" }
        }
    };
}
