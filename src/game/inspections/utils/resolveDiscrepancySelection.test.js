import { describe, expect, it } from "vitest";

import {
    DISCREPANCY_RESULT_STATUSES,
    resolveDiscrepancySelection
} from "./resolveDiscrepancySelection.js";

describe("resolveDiscrepancySelection", () => {
    it("finds an expired date after selecting only that field", () => {
        const result = resolveSelection([
            field("driversLicense.expiryDate", "2026-08-02")
        ]);

        expect(result).toEqual({
            status: DISCREPANCY_RESULT_STATUSES.DISCREPANCY_FOUND,
            findingId: "expired_drivers_license"
        });
    });

    it("waits for a second compatible field when a name is selected", () => {
        const result = resolveSelection([
            field("driversLicense.lastName", "Fischer")
        ]);

        expect(result.status).toBe(
            DISCREPANCY_RESULT_STATUSES.WAITING_FOR_SECOND_FIELD
        );
    });

    it("rejects fields from different comparison groups", () => {
        const result = resolveSelection([
            field("driversLicense.lastName", "Fischer"),
            field("vehicleRegistration.plateNumber", "AC - AB 1234")
        ]);

        expect(result.status).toBe(
            DISCREPANCY_RESULT_STATUSES.INCOMPATIBLE_FIELDS
        );
    });

    it("finds a manipulated driver name by comparing two documents", () => {
        const result = resolveSelection([
            field("driversLicense.lastName", "Falschername"),
            field("vehicleRegistration.ownerLastName", "Fischer")
        ]);

        expect(result).toEqual({
            status: DISCREPANCY_RESULT_STATUSES.DISCREPANCY_FOUND,
            findingId: "driver_name_mismatch"
        });
    });

    it("does not treat a different legitimate vehicle owner as a violation", () => {
        const result = resolveSelection([
            field("driversLicense.lastName", "Fischer"),
            field("vehicleRegistration.ownerLastName", "Schneider")
        ]);

        expect(result.status).toBe(DISCREPANCY_RESULT_STATUSES.NO_DISCREPANCY);
    });

    it("finds a manipulated birth date by comparing it with the matching registry person", () => {
        const result = resolveSelection([
            field("driversLicense.birthDate", "1989-05-04"),
            registryField("registryPerson.birthDate", "1990-05-04", "npc--one")
        ]);

        expect(result.findingId).toBe("driver_birth_date_mismatch");
    });

    it("does not confirm a discrepancy with an unrelated registry person", () => {
        const result = resolveSelection([
            field("driversLicense.birthDate", "1989-05-04"),
            registryField("registryPerson.birthDate", "1990-05-04", "npc--other")
        ]);

        expect(result).toEqual({
            status: DISCREPANCY_RESULT_STATUSES.NO_DISCREPANCY,
            findingId: null,
            reason: "wrong_registry_record"
        });
    });

    it("compares a vehicle issue date with the matching vehicle registry", () => {
        const result = resolveSelection([
            field("vehicleRegistration.issueDate", "2024-01-01"),
            registryField("registryVehicle.issueDate", "2025-02-03", "vehicle--one")
        ]);

        expect(result).toEqual({
            status: DISCREPANCY_RESULT_STATUSES.DISCREPANCY_FOUND,
            findingId: "vehicle_issue_date_mismatch"
        });
    });

    it("finds a contradictory address only after comparing the statement", () => {
        const result = resolveSelection([
            field("statement.address", "Lindenstraße 14"),
            field("driversLicense.address", "Hauptstrasse 1")
        ]);

        expect(result).toEqual({
            status: DISCREPANCY_RESULT_STATUSES.DISCREPANCY_FOUND,
            findingId: "inconsistent_driver_statement"
        });
    });

    it("confirms that the pass photo matches the eye color on the license", () => {
        const result = resolveSelection([
            field("driversLicense.photo", {
                eyeColor: "blue",
                hairColor: "blond",
                distinguishingMarks: ["scar_left_eyebrow"]
            }),
            field("driversLicense.eyeColor", "blue")
        ]);

        expect(result.status).toBe(DISCREPANCY_RESULT_STATUSES.NO_DISCREPANCY);
    });

    it("finds an eye-color mismatch between pass photo and license data", () => {
        const result = resolveSelection([
            field("driversLicense.photo", {
                eyeColor: "blue",
                hairColor: "blond",
                distinguishingMarks: ["scar_left_eyebrow"]
            }),
            field("driversLicense.eyeColor", "brown")
        ]);

        expect(result).toEqual({
            status: DISCREPANCY_RESULT_STATUSES.DISCREPANCY_FOUND,
            findingId: "driver_appearance_mismatch"
        });
    });

    it("compares visible scars with the matching person record", () => {
        const result = resolveSelection([
            field("driversLicense.photo", {
                eyeColor: "blue",
                hairColor: "blond",
                distinguishingMarks: ["scar_left_eyebrow"]
            }),
            registryField(
                "registryPerson.distinguishingMarks",
                ["scar_left_eyebrow"],
                "npc--one"
            )
        ]);

        expect(result.status).toBe(DISCREPANCY_RESULT_STATUSES.NO_DISCREPANCY);
    });

    it("finds a replaced license photo by comparing it with the database photo", () => {
        const result = resolveSelection([
            field("driversLicense.photo", {
                photoIdentity: "driver2.jpg",
                eyeColor: "green",
                hairColor: "brown",
                distinguishingMarks: []
            }),
            registryField("registryPerson.photo", {
                photoIdentity: "driver11.jpg",
                eyeColor: "blue",
                hairColor: "blond",
                distinguishingMarks: ["scar_left_eyebrow"]
            }, "npc--one")
        ]);

        expect(result).toEqual({
            status: DISCREPANCY_RESULT_STATUSES.DISCREPANCY_FOUND,
            findingId: "driver_appearance_mismatch"
        });
    });

    it("finds a manipulated residence-permit number against its registry record", () => {
        const result = resolveSelection([
            field("residencePermit.permitNumber", "AE-FAKE"),
            registryField(
                "registryResidencePermit.number",
                "AE-REAL",
                "residence-permit--one"
            )
        ]);

        expect(result).toEqual({
            status: DISCREPANCY_RESULT_STATUSES.DISCREPANCY_FOUND,
            findingId: "permit_relation_mismatch"
        });
    });

    it("rejects an unrelated work-permit registry record", () => {
        const result = resolveSelection([
            field("workPermit.residencePermitNumber", "AE-REAL"),
            registryField(
                "registryWorkPermit.residencePermitNumber",
                "AE-OTHER",
                "work-permit--other"
            )
        ]);

        expect(result.reason).toBe("wrong_registry_record");
    });
});

function resolveSelection(selectedFields) {
    return resolveDiscrepancySelection({
        selectedFields,
        trafficEntity: {
            npcId: "npc--one",
            vehicleId: "vehicle--one",
            driverProfile: {
                real: {
                    driversLicense: {
                        licenseNumber: "ABC-12345678"
                    },
                    residencePermit: {
                        permitId: "residence-permit--one",
                        permitNumber: "AE-REAL"
                    },
                    workPermit: {
                        permitId: "work-permit--one",
                        residencePermitNumber: "AE-REAL"
                    }
                }
            },
            insuranceProfile: {
                real: {
                    policyNumber: "POL-REAL",
                    insuredPlateNumber: "AC - AB 1234"
                }
            }
        },
        officialRegistry: {
            peopleById: {
                "npc--one": {
                    firstName: "Jan",
                    lastName: "Fischer",
                    address: "Hauptstrasse 1",
                    birthDate: "1990-05-04"
                }
            },
            vehiclesById: {
                "vehicle--one": {
                    brand: "Zubari",
                    model: "Katana",
                    carDocumentsData: {
                        plateNumber: "AC - AB 1234",
                        carRegistrationNumber: "REG-REAL",
                        formattedIssueDate: "2025-02-03"
                    }
                }
            }
        },
        inspectedAt: "2026-08-03T08:00:00.000Z"
    });
}

function field(fieldId, value) {
    return { fieldId, value };
}

function registryField(fieldId, value, recordId) {
    return { fieldId, value, recordId };
}
