import { describe, expect, it } from "vitest";

import { resolveRadioInquiry } from "./resolveRadioInquiry.js";

describe("resolveRadioInquiry", () => {
    it("returns the registered vehicle and owner for a valid registration number", () => {
        const result = resolveInquiry(
            "vehicleRegistration.registrationNumber",
            "REG-123"
        );

        expect(result.findingId).toBeNull();
        expect(result.dispatchText).toContain("Zubari Katana");
        expect(result.dispatchText).toContain("Jan Fischer");
    });

    it("marks an unknown registration number as a document finding", () => {
        const result = resolveInquiry(
            "vehicleRegistration.registrationNumber",
            "REG-FAKE"
        );

        expect(result.findingId).toBe("vehicle_registration_number_mismatch");
        expect(result.dispatchText).toContain("kein passender amtlicher Datensatz");
    });

    it("does not accuse a person when a name produces several official matches", () => {
        const result = resolveInquiry("driversLicense.firstName", "Jan", {
            peopleById: {
                "npc--two": {
                    npcId: "npc--two",
                    firstName: "Jan",
                    lastName: "Schmidt",
                    birthDate: "1985-01-01",
                    address: "Nebenstrasse 2"
                }
            }
        });

        expect(result.findingId).toBeNull();
        expect(result.dispatchText).toContain("2 amtliche Treffer");
    });

    it("reports a registered but expired driver license", () => {
        const result = resolveInquiry(
            "driversLicense.expiryDate",
            "2025-06-01"
        );

        expect(result.findingId).toBe("expired_drivers_license");
        expect(result.dispatchText).toContain("Führerschein LIC-123");
    });
});

function resolveInquiry(fieldId, value, registryOverrides = {}) {
    return resolveRadioInquiry({
        field: { fieldId, value },
        officialRegistry: createOfficialRegistry(registryOverrides),
        criminalDatabase: {
            npcsById: {
                "npc--one": { npcId: "npc--one" }
            }
        },
        inspectedAt: "2026-08-03T08:00:00.000Z"
    });
}

function createOfficialRegistry(overrides) {
    return {
        peopleById: {
            "npc--one": {
                npcId: "npc--one",
                firstName: "Jan",
                lastName: "Fischer",
                birthDate: "1990-05-04",
                address: "Hauptstrasse 1"
            },
            ...(overrides.peopleById ?? {})
        },
        driverLicensesByNumber: {
            "LIC-123": {
                npcId: "npc--one",
                licenseNumber: "LIC-123",
                licensedSince: "2010-01-01",
                issueDate: "2020-06-01",
                expiryDate: "2025-06-01"
            },
            ...(overrides.driverLicensesByNumber ?? {})
        },
        vehiclesById: {
            "vehicle--one": {
                vehicleId: "vehicle--one",
                registeredOwnerNpcId: "npc--one",
                brand: "Zubari",
                model: "Katana",
                carDocumentsData: {
                    plateNumber: "AC - AB 1234",
                    carRegistrationNumber: "REG-123"
                }
            },
            ...(overrides.vehiclesById ?? {})
        },
        insurancePoliciesById: {
            ...(overrides.insurancePoliciesById ?? {})
        }
    };
}
