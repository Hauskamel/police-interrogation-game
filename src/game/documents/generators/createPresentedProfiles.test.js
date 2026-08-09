import { describe, expect, it } from "vitest";

import {
    DOCUMENT_INTEGRITY_TYPES,
    NPC_DOCUMENT_FORGERY_TYPES
} from "../data";
import { createPresentedProfiles } from "./createPresentedProfiles.js";


describe("createPresentedProfiles", () => {
    it("clones valid profiles without changing their visible values", () => {
        const profiles = createProfiles(createValidDocumentState());

        expect(profiles.driverProfile.presented).toEqual(profiles.driverProfile.real);
        expect(profiles.vehicleProfile.presented).toEqual(profiles.vehicleProfile.real);
        expect(profiles.insuranceProfile.presented).toEqual(profiles.insuranceProfile.real);
        expect(profiles.driverProfile.presented).not.toBe(profiles.driverProfile.real);
    });

    it("changes only presented when the driver's birth date is forged", () => {
        const documentState = createValidDocumentState();
        documentState.npcDocuments.driversLicense = {
            integrity: DOCUMENT_INTEGRITY_TYPES.FORGED,
            forgeryType: NPC_DOCUMENT_FORGERY_TYPES.WRONG_BIRTH_DATE,
            affectedFields: ["birthDate", "birthYear", "age"],
            detectableBy: ["compare_with_database"]
        };

        const profiles = createProfiles(documentState);

        expect(profiles.driverProfile.real.birthDate).toBe("1988-05-20");
        expect(profiles.driverProfile.presented.birthDate).toBe("1987-05-20");
        expect(profiles.driverProfile.presented.birthYear).toBe("1987");
        expect(profiles.driverProfile.presented.age).toBe(39);
        expect(profiles.vehicleProfile.presented).toEqual(profiles.vehicleProfile.real);
        expect(profiles.insuranceProfile.presented).toEqual(profiles.insuranceProfile.real);
    });

    it("can forge the printed eye color without changing the real photo traits", () => {
        const documentState = createValidDocumentState();
        documentState.npcDocuments.driversLicense = {
            integrity: DOCUMENT_INTEGRITY_TYPES.FORGED,
            forgeryType: NPC_DOCUMENT_FORGERY_TYPES.WRONG_EYE_COLOR,
            affectedFields: ["eyeColor"],
            detectableBy: ["compare_photo_with_document"]
        };

        const profiles = createProfiles(documentState);

        expect(profiles.driverProfile.real.eyeColor).toBe("blue");
        expect(profiles.driverProfile.presented.eyeColor).not.toBe("blue");
        expect(profiles.driverProfile.presented.npcImage).toBe("driver11.jpg");
        expect(profiles.driverProfile.presented.distinguishingMarks).toEqual([
            "scar_left_eyebrow"
        ]);
    });

    it("can replace only the visible license photo", () => {
        const documentState = createValidDocumentState();
        documentState.npcDocuments.driversLicense = {
            integrity: DOCUMENT_INTEGRITY_TYPES.FORGED,
            forgeryType: NPC_DOCUMENT_FORGERY_TYPES.WRONG_PHOTO,
            affectedFields: ["npcImage"],
            detectableBy: ["compare_with_database_photo"]
        };

        const profiles = createProfiles(documentState);

        expect(profiles.driverProfile.real.npcImage).toBe("driver11.jpg");
        expect(profiles.driverProfile.presented.npcImage).not.toBe("driver11.jpg");
        expect(profiles.driverProfile.presented.eyeColor).toBe("blue");
        expect(profiles.driverProfile.presented.hairColor).toBe("blond");
    });
});

function createProfiles(documentState) {
    return createPresentedProfiles({
        driverProfile: {
            real: {
                npcId: "npc--driver",
                firstName: "Jonas",
                lastName: "Keller",
                address: "Hauptstrasse 10",
                birthDate: "1988-05-20",
                birthYear: "1988",
                age: 38,
                hairColor: "blond",
                eyeColor: "blue",
                distinguishingMarks: ["scar_left_eyebrow"],
                npcImage: "driver11.jpg",
                crimeRecordIds: [],
                driversLicense: {
                    licenseNumber: "ABC-12345678",
                    licensedSince: "2006-05-20",
                    issueDate: "2020-05-20",
                    expiryDate: "2035-05-20"
                }
            }
        },
        vehicleProfile: {
            real: {
                vehicleId: "vehicle--one",
                brand: "Volkswagen",
                model: "Golf",
                carDocumentsData: {
                    plateNumber: "AC - AB 1234",
                    carRegistrationNumber: "REG-123"
                }
            }
        },
        insuranceProfile: {
            real: {
                policyId: "insurance--one",
                policyNumber: "POL-123",
                vehicleId: "vehicle--one",
                insuredPlateNumber: "AC - AB 1234"
            }
        },
        documentState
    });
}

function createValidDocumentState() {
    const validState = {
        integrity: DOCUMENT_INTEGRITY_TYPES.VALID,
        forgeryType: null,
        affectedFields: [],
        detectableBy: []
    };

    return {
        hasForgery: false,
        npcDocuments: {
            driversLicense: { ...validState }
        },
        vehicleDocuments: {
            registration: { ...validState },
            insurance: { ...validState }
        }
    };
}
