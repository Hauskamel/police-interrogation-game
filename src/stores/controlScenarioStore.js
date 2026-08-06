import { create } from "zustand";

import { selectNextControlScenario } from "@game/inspections/utils";
import { INSPECTION_BALANCING } from "@game/inspections/data";

// ##### Control Scenario Store
// -----> Speichert nur abgeschlossene Kontrollfälle für Fortschritt und Pacing.
// ---> Die eigentlichen NPC-, Dokument- und Fahrzeugdaten bleiben in ihren Fachstores.
export const useControlScenarioStore = create((set, get) => ({
    completedScenarioHistory: [],

    selectNextScenario: (options = {}) => {
        return selectNextControlScenario({
            ...options,
            history: get().completedScenarioHistory
        });
    },

    recordCompletedScenario: ({ scenario, score, outcome }) => {
        if (!scenario) return;

        set((state) => ({
            completedScenarioHistory: [
                ...state.completedScenarioHistory,
                {
                    type: scenario.type,
                    category: scenario.category,
                    score,
                    outcome
                }
            ].slice(-INSPECTION_BALANCING.historyLimit)
        }));
    },

    resetCompletedScenarioHistory: () => {
        set({ completedScenarioHistory: [] });
    }
}));
