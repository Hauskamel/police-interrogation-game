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
});
