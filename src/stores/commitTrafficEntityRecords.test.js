import { beforeEach, describe, expect, it } from "vitest";

import { commitTrafficEntityRecords } from "./commitTrafficEntityRecords.js";
import { useOfficialRegistryStore } from "./officialRegistryStore.js";
import { useTrafficStore } from "./trafficStore.js";
import { useWorldTruthStore } from "./worldTruthStore.js";


describe("commitTrafficEntityRecords", () => {
    beforeEach(() => {
        useTrafficStore.setState({
            playerPoliceVehicle: undefined,
            trafficEntities: [],
            selectedVehicleId: null,
            revealedDriverIdentityByTrafficEntityId: {}
        });
        useOfficialRegistryStore.getState().resetOfficialRegistry();
        useWorldTruthStore.getState().resetWorldTruthDatabase();
    });

    it("registers world truth and only canonical real profiles", () => {
        const trafficEntity = createTrafficEntity();
        const normalizedEntity = commitTrafficEntityRecords(trafficEntity);

        expect(normalizedEntity).not.toHaveProperty("worldTruthRecords");
        expect(
            useWorldTruthStore.getState().worldTruthDatabase.crimeRecordsById
        ).toHaveProperty("crime--one");

        const registry = useOfficialRegistryStore.getState().officialRegistry;
        expect(registry.peopleById[trafficEntity.npcId].firstName).toBe("Jonas");
        expect(registry.peopleById[trafficEntity.npcId].firstName).not.toBe("Thomas");
        expect(registry.peopleById[trafficEntity.npcId].countryOfOrigin).toBe("Auren");
        expect(registry.residencePermitsByNumber["AE-ONE"].holderNpcId).toBe(
            trafficEntity.npcId
        );
        expect(registry.workPermitsByNumber["AR-ONE"].residencePermitId).toBe(
            "residence-permit--one"
        );
        expect(registry.vehiclesById[trafficEntity.vehicleId].brand).toBe("Volkswagen");
        expect(registry.insurancePoliciesById["insurance--one"].policyNumber).toBe(
            "POL-REAL"
        );
    });

    it("leaves no ghost records when an identity conflict rejects the spawn", () => {
        const firstEntity = createTrafficEntity();
        const normalizedFirstEntity = commitTrafficEntityRecords(firstEntity);
        useTrafficStore.getState().addTrafficEntity(normalizedFirstEntity);

        const conflictingEntity = createTrafficEntity({
            id: "traffic--two",
            vehicleId: "vehicle--two",
            worldTruthRecords: {
                npcsById: {
                    "npc--ghost": {
                        npcId: "npc--ghost"
                    }
                },
                crimeRecordsById: {
                    "crime--ghost": {
                        id: "crime--ghost",
                        offenderNpcId: "npc--ghost"
                    }
                }
            }
        });

        const rejectedEntity = commitTrafficEntityRecords(conflictingEntity);
        const worldTruth = useWorldTruthStore.getState().worldTruthDatabase;
        const registry = useOfficialRegistryStore.getState().officialRegistry;

        expect(rejectedEntity).toBeNull();
        expect(worldTruth.npcsById).not.toHaveProperty("npc--ghost");
        expect(worldTruth.crimeRecordsById).not.toHaveProperty("crime--ghost");
        expect(registry.vehiclesById).not.toHaveProperty("vehicle--two");
    });
});

function createTrafficEntity(overrides = {}) {
    const npcId = "npc--one";
    const vehicleId = overrides.vehicleId ?? "vehicle--one";
    const realDriver = {
        npcId,
        sex: "male",
        firstName: "Jonas",
        lastName: "Keller",
        address: "Hauptstrasse 10",
        age: 38,
        birthYear: "1988",
        birthDate: "1988-05-20",
        height: 182,
        hairColor: "brown",
        eyeColor: "blue",
        npcImage: "jonas.png",
        countryOfOrigin: "Auren",
        migrationProfile: {
            requiresResidencePermit: true,
            requiresWorkPermit: true
        },
        driversLicense: {
            licenseNumber: "ABC-12345678",
            licensedSince: "2006-05-20",
            issueDate: "2020-05-20",
            expiryDate: "2035-05-20",
            issuingCountry: "Auren"
        },
        residencePermit: {
            permitId: "residence-permit--one",
            permitNumber: "AE-ONE",
            holderNpcId: npcId,
            countryOfOrigin: "Auren"
        },
        workPermit: {
            permitId: "work-permit--one",
            permitNumber: "AR-ONE",
            holderNpcId: npcId,
            residencePermitId: "residence-permit--one",
            residencePermitNumber: "AE-ONE"
        }
    };
    const realVehicle = {
        vehicleId,
        registeredOwnerNpcId: npcId,
        brand: "Volkswagen",
        model: "Golf",
        carDocumentsData: {
            plateNumber: "AC - AB 1234",
            carRegistrationNumber: "REG-REAL"
        }
    };
    const realInsurance = {
        policyId: "insurance--one",
        policyNumber: "POL-REAL",
        policyHolderNpcId: npcId,
        vehicleId,
        insuredPlateNumber: "AC - AB 1234",
        validFrom: "2026-01-01",
        validUntil: "2027-01-01",
        status: "active"
    };

    return {
        id: "traffic--one",
        npcId,
        vehicleId,
        stopped: false,
        driverProfile: {
            real: realDriver,
            presented: {
                ...realDriver,
                firstName: "Thomas"
            }
        },
        vehicleOwnerProfile: {
            real: realDriver,
            presented: realDriver
        },
        vehicleProfile: {
            real: realVehicle,
            presented: {
                ...realVehicle,
                brand: "BMW"
            }
        },
        insuranceProfile: {
            real: realInsurance,
            presented: {
                ...realInsurance,
                policyNumber: "POL-FAKE"
            }
        },
        worldTruthRecords: {
            npcsById: {
                [npcId]: {
                    ...realDriver,
                    crimeRecordIds: ["crime--one"]
                }
            },
            crimeRecordsById: {
                "crime--one": {
                    id: "crime--one",
                    offenderNpcId: npcId
                }
            }
        },
        ...overrides
    };
}
