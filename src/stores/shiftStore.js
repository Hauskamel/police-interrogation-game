import { create } from "zustand";

import { FIRST_SHIFT_STORY } from "@game/shifts/data";

function createInitialShift() {
    return {
        shiftId: FIRST_SHIFT_STORY.id,
        status: "active",
        completedEncounters: [],
        clueIds: []
    };
}

export const useShiftStore = create((set, get) => ({
    ...createInitialShift(),

    getCurrentEncounter: () => {
        const state = get();
        if (state.status !== "active") return null;

        return FIRST_SHIFT_STORY.encounters[state.completedEncounters.length] ?? null;
    },

    getConversationMemory: () => ({ clueIds: [...get().clueIds] }),

    recordCompletedEncounter: ({ encounterId, conversationEntries = [], score }) => {
        const state = get();
        const expectedEncounter = FIRST_SHIFT_STORY.encounters[
            state.completedEncounters.length
        ];
        if (!expectedEncounter || expectedEncounter.id !== encounterId) return;

        const askedQuestionIds = new Set(
            conversationEntries.map((entry) => entry.questionId).filter(Boolean)
        );
        const discoveredClueIds = Object.entries(expectedEncounter.responses)
            .filter(([questionId]) => askedQuestionIds.has(questionId))
            .map(([, response]) => response.clueId)
            .filter(Boolean);
        const clueIds = [...new Set([...state.clueIds, ...discoveredClueIds])];
        const completedEncounters = [
            ...state.completedEncounters,
            { encounterId, score, discoveredClueIds }
        ];

        set({
            completedEncounters,
            clueIds,
            status: completedEncounters.length >= FIRST_SHIFT_STORY.targetInspectionCount
                ? "completed"
                : "active"
        });
    },

    resetShift: () => set(createInitialShift())
}));
