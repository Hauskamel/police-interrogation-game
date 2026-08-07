import { describe, expect, it } from "vitest";

import { FIRST_SHIFT_STORY } from "../data";
import { getShiftInterviewQuestions } from "./getShiftInterviewQuestions.js";

describe("getShiftInterviewQuestions", () => {
    it("unlocks a contextual follow-up only from remembered clues", () => {
        const encounter = FIRST_SHIFT_STORY.encounters[1];

        expect(getShiftInterviewQuestions({ encounter, clueIds: [] })).toEqual([]);
        expect(getShiftInterviewQuestions({
            encounter,
            clueIds: ["gray_van"]
        }).map((question) => question.id)).toEqual(["gray_van_follow_up"]);
    });
});
