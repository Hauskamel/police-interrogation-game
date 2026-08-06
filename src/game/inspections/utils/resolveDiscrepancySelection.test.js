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
