import { afterEach, describe, expect, it } from "vitest";

import {
    CONTROL_SCENARIOS_BY_TYPE,
    CONTROL_SCENARIO_TYPES
} from "@game/inspections/data";

import { useControlScenarioStore } from "./controlScenarioStore.js";

describe("controlScenarioStore", () => {
    afterEach(() => {
        useControlScenarioStore.getState().resetCompletedScenarioHistory();
    });

    it("records completed scenarios with their result", () => {
        const scenario = CONTROL_SCENARIOS_BY_TYPE[CONTROL_SCENARIO_TYPES.CLEAN];

        useControlScenarioStore.getState().recordCompletedScenario({
            scenario,
            score: 85,
            outcome: "correct"
        });

        expect(useControlScenarioStore.getState().completedScenarioHistory).toEqual([
            {
                type: scenario.type,
                category: scenario.category,
                score: 85,
                outcome: "correct"
            }
        ]);
    });

    it("keeps only the latest twenty scenarios", () => {
        const scenario = CONTROL_SCENARIOS_BY_TYPE[CONTROL_SCENARIO_TYPES.CLEAN];

        for (let index = 0; index < 25; index += 1) {
            useControlScenarioStore.getState().recordCompletedScenario({
                scenario: {
                    ...scenario,
                    type: `scenario-${index}`
                },
                score: 70,
                outcome: "partially_correct"
            });
        }

        const history = useControlScenarioStore.getState().completedScenarioHistory;

        expect(history).toHaveLength(20);
        expect(history[0].type).toBe("scenario-5");
        expect(history[19].type).toBe("scenario-24");
    });

    it("uses its stored history for the next selection and can reset it", () => {
        const store = useControlScenarioStore.getState();
        const cleanScenario = CONTROL_SCENARIOS_BY_TYPE[CONTROL_SCENARIO_TYPES.CLEAN];

        store.recordCompletedScenario({
            scenario: cleanScenario,
            score: 100,
            outcome: "correct"
        });
        store.recordCompletedScenario({
            scenario: cleanScenario,
            score: 100,
            outcome: "correct"
        });

        const nextScenario = useControlScenarioStore.getState().selectNextScenario({
            random: () => 0
        });

        expect(nextScenario.type).not.toBe(CONTROL_SCENARIO_TYPES.CLEAN);

        useControlScenarioStore.getState().resetCompletedScenarioHistory();
        expect(
            useControlScenarioStore.getState().completedScenarioHistory
        ).toEqual([]);
    });
});
