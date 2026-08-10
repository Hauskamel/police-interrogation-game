import { describe, expect, it } from "vitest";

import { INSPECTION_DOCUMENT_TYPES } from "../data";
import { getAvailableInterviewQuestions } from "./getAvailableInterviewQuestions.js";

describe("getAvailableInterviewQuestions", () => {
    it("starts with neutral questions that do not reveal hidden scenario data", () => {
        const questions = getAvailableInterviewQuestions();

        expect(questions.map((question) => question.id)).toEqual([
            "full_name",
            "travel_reason"
        ]);
    });

    it("unlocks document-related questions after the matching document was opened", () => {
        const questions = getAvailableInterviewQuestions({
            openedDocuments: [
                INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
                INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION
            ]
        });

        expect(questions.map((question) => question.id)).toContain("address");
        expect(questions.map((question) => question.id)).toContain("vehicle_owner");
    });

    it("unlocks a follow-up only after the contradiction was discovered", () => {
        const questions = getAvailableInterviewQuestions({
            findings: [{ findingId: "inconsistent_driver_statement" }]
        });

        expect(questions.map((question) => question.id)).toContain(
            "address_follow_up"
        );
    });

    it("offers the foreign-stay question after a foreign license was opened", () => {
        const questions = getAvailableInterviewQuestions({
            openedDocuments: [INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE],
            driverProfile: createForeignDriverProfile()
        });

        expect(questions.map((question) => question.id)).toContain("foreign_stay");
        expect(questions.map((question) => question.id)).not.toContain(
            "employment_details"
        );
    });

    it("offers permit follow-ups after the foreign stay was discussed", () => {
        const questions = getAvailableInterviewQuestions({
            openedDocuments: [INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE],
            driverProfile: createForeignDriverProfile(),
            askedQuestionIds: ["foreign_stay"]
        });

        expect(questions.map((question) => question.id)).toContain(
            "residence_details"
        );
        expect(questions.map((question) => question.id)).toContain(
            "employment_details"
        );
    });
});

function createForeignDriverProfile() {
    return {
        real: {
            migrationProfile: {
                requiresResidencePermit: true,
                requiresWorkPermit: true
            }
        },
        presented: {
            driversLicense: {
                issuingCountry: "Auren"
            }
        }
    };
}
