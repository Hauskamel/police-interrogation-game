import { afterEach, describe, expect, it } from "vitest";

import {
    CONTROL_SCENARIOS_BY_TYPE,
    CONTROL_SCENARIO_TYPES
} from "@game/inspections/data";

import { useControlScenarioStore } from "./controlScenarioStore.js";

describe("controlScenarioStore", () => {
    afterEach(() => {
        useControlScenarioStore.getState().resetScenarioHistory();
    });

    it("records only the pacing metadata of a successful scenario", () => {
        const scenario = CONTROL_SCENARIOS_BY_TYPE[CONTROL_SCENARIO_TYPES.CLEAN];

        useControlScenarioStore.getState().recordSpawnedScenario(scenario);

        expect(useControlScenarioStore.getState().scenarioHistory).toEqual([
            {
                type: scenario.type,
                category: scenario.category
            }
        ]);
    });

    it("keeps only the latest twenty scenarios", () => {
        const scenario = CONTROL_SCENARIOS_BY_TYPE[CONTROL_SCENARIO_TYPES.CLEAN];

        for (let index = 0; index < 25; index += 1) {
            useControlScenarioStore.getState().recordSpawnedScenario({
                ...scenario,
                type: `scenario-${index}`
            });
        }

        const history = useControlScenarioStore.getState().scenarioHistory;

        expect(history).toHaveLength(20);
        expect(history[0].type).toBe("scenario-5");
        expect(history[19].type).toBe("scenario-24");
    });

    it("uses its stored history for the next selection and can reset it", () => {
        const store = useControlScenarioStore.getState();
        const cleanScenario = CONTROL_SCENARIOS_BY_TYPE[CONTROL_SCENARIO_TYPES.CLEAN];

        store.recordSpawnedScenario(cleanScenario);
        store.recordSpawnedScenario(cleanScenario);

        const nextScenario = useControlScenarioStore.getState().selectNextScenario({
            random: () => 0
        });

        expect(nextScenario.type).not.toBe(CONTROL_SCENARIO_TYPES.CLEAN);

        useControlScenarioStore.getState().resetScenarioHistory();
        expect(useControlScenarioStore.getState().scenarioHistory).toEqual([]);
    });
});
