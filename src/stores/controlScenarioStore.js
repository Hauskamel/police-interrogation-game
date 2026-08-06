import { create } from "zustand";

import { selectNextControlScenario } from "@game/inspections/utils";

const MAX_STORED_SCENARIOS = 20;

// ##### Control Scenario Store
// -----> Speichert nur die erfolgreich erzeugten Kontrollfaelle fuer das Spawn-Pacing.
// ---> Die eigentlichen NPC-, Dokument- und Fahrzeugdaten bleiben in ihren Fachstores.
export const useControlScenarioStore = create((set, get) => ({
    scenarioHistory: [],

    selectNextScenario: (options = {}) => {
        return selectNextControlScenario({
            ...options,
            history: get().scenarioHistory
        });
    },

    recordSpawnedScenario: (scenario) => {
        if (!scenario) return;

        set((state) => ({
            scenarioHistory: [
                ...state.scenarioHistory,
                {
                    type: scenario.type,
                    category: scenario.category
                }
            ].slice(-MAX_STORED_SCENARIOS)
        }));
    },

    resetScenarioHistory: () => {
        set({ scenarioHistory: [] });
    }
}));
