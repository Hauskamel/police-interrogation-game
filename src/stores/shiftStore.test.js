import { afterEach, describe, expect, it } from "vitest";

import { useShiftStore } from "./shiftStore.js";

describe("shiftStore", () => {
    afterEach(() => useShiftStore.getState().resetShift());

    it("advances the shift and remembers clues from asked questions", () => {
        const firstEncounter = useShiftStore.getState().getCurrentEncounter();

        useShiftStore.getState().recordCompletedEncounter({
            encounterId: firstEncounter.id,
            score: 90,
            conversationEntries: [{ questionId: "travel_reason" }]
        });

        const state = useShiftStore.getState();
        expect(state.clueIds).toContain("gray_van");
        expect(state.getCurrentEncounter().id).toBe("station-witness");
    });

    it("does not invent a clue when the relevant question was not asked", () => {
        const firstEncounter = useShiftStore.getState().getCurrentEncounter();

        useShiftStore.getState().recordCompletedEncounter({
            encounterId: firstEncounter.id,
            score: 75,
            conversationEntries: []
        });

        expect(useShiftStore.getState().clueIds).not.toContain("gray_van");
    });

    it("completes after five normal inspections", () => {
        for (let index = 0; index < 5; index += 1) {
            const encounter = useShiftStore.getState().getCurrentEncounter();
            useShiftStore.getState().recordCompletedEncounter({
                encounterId: encounter.id,
                score: 80,
                conversationEntries: []
            });
        }

        expect(useShiftStore.getState().status).toBe("completed");
        expect(useShiftStore.getState().getCurrentEncounter()).toBeNull();
    });
});
