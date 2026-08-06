import { describe, expect, it } from "vitest";

import {
    CONTROL_SCENARIO_CATEGORIES,
    CONTROL_SCENARIOS_BY_TYPE,
    CONTROL_SCENARIO_TYPES
} from "../data";
import { selectNextControlScenario } from "./selectNextControlScenario.js";


describe("selectNextControlScenario", () => {
    it("prevents more than two clean cases in a row", () => {
        const scenario = selectNextControlScenario({
            history: [
                historyEntry(CONTROL_SCENARIO_TYPES.CLEAN),
                historyEntry(CONTROL_SCENARIO_TYPES.CLEAN)
            ],
            random: () => 0
        });

        expect(scenario.type).not.toBe(CONTROL_SCENARIO_TYPES.CLEAN);
    });

    it("guarantees a forgery after four cases without one", () => {
        const scenario = selectNextControlScenario({
            history: [
                historyEntry(CONTROL_SCENARIO_TYPES.CLEAN),
                historyEntry(CONTROL_SCENARIO_TYPES.EXPIRED_LICENSE),
                historyEntry(CONTROL_SCENARIO_TYPES.WANTED_PERSON),
                historyEntry(CONTROL_SCENARIO_TYPES.CLEAN)
            ],
            random: () => 0
        });

        expect(scenario.category).toBe(
            CONTROL_SCENARIO_CATEGORIES.FORGED_DOCUMENT
        );
    });

    it("does not repeat the same concrete case more than twice", () => {
        const scenario = selectNextControlScenario({
            history: [
                historyEntry(CONTROL_SCENARIO_TYPES.FORGED_IDENTITY),
                historyEntry(CONTROL_SCENARIO_TYPES.FORGED_IDENTITY)
            ],
            random: () => 0.5
        });

        expect(scenario.type).not.toBe(CONTROL_SCENARIO_TYPES.FORGED_IDENTITY);
    });

    it("respects unavailable scenario types", () => {
        const scenario = selectNextControlScenario({
            excludedTypes: [CONTROL_SCENARIO_TYPES.WANTED_PERSON],
            random: () => 0.999
        });

        expect(scenario.type).not.toBe(CONTROL_SCENARIO_TYPES.WANTED_PERSON);
    });

    it("keeps the long-run mix varied and forgery-focused", () => {
        const history = [];
        const countsByCategory = {};
        const random = createDeterministicRandom(20260804);

        for (let index = 0; index < 1000; index += 1) {
            const scenario = selectNextControlScenario({ history, random });
            history.push({ type: scenario.type, category: scenario.category });
            countsByCategory[scenario.category] = (
                countsByCategory[scenario.category] ?? 0
            ) + 1;
        }

        expect(countsByCategory[CONTROL_SCENARIO_CATEGORIES.CLEAN]).toBeGreaterThan(150);
        expect(countsByCategory[CONTROL_SCENARIO_CATEGORIES.CLEAN]).toBeLessThan(300);
        expect(
            countsByCategory[CONTROL_SCENARIO_CATEGORIES.FORGED_DOCUMENT]
        ).toBeGreaterThan(300);
        expect(
            countsByCategory[CONTROL_SCENARIO_CATEGORIES.FORGED_DOCUMENT]
        ).toBeLessThan(500);
        expect(
            countsByCategory[CONTROL_SCENARIO_CATEGORIES.WANTED_PERSON]
        ).toBeGreaterThan(40);
    });

    it("unlocks complexity in stages", () => {
        const earlyScenario = selectNextControlScenario({
            scenarios: [CONTROL_SCENARIOS_BY_TYPE[CONTROL_SCENARIO_TYPES.MULTI_ISSUE]],
            random: () => 0
        });
        const advancedHistory = Array.from({ length: 10 }, () => (
            historyEntry(CONTROL_SCENARIO_TYPES.CLEAN)
        ));
        const advancedScenario = selectNextControlScenario({
            history: advancedHistory,
            scenarios: [CONTROL_SCENARIOS_BY_TYPE[CONTROL_SCENARIO_TYPES.MULTI_ISSUE]],
            random: () => 0
        });

        expect(earlyScenario).toBeNull();
        expect(advancedScenario.type).toBe(CONTROL_SCENARIO_TYPES.MULTI_ISSUE);
    });

    it("keeps advanced cases locked when recent completed controls are weak", () => {
        const weakHistory = Array.from({ length: 10 }, () => ({
            ...historyEntry(CONTROL_SCENARIO_TYPES.CLEAN),
            score: 40
        }));
        const scenario = selectNextControlScenario({
            history: weakHistory,
            scenarios: [CONTROL_SCENARIOS_BY_TYPE[CONTROL_SCENARIO_TYPES.MULTI_ISSUE]],
            random: () => 0
        });

        expect(scenario).toBeNull();
    });
});

function historyEntry(type, score = 100) {
    const scenario = CONTROL_SCENARIOS_BY_TYPE[type];

    return {
        type: scenario.type,
        category: scenario.category,
        score
    };
}

function createDeterministicRandom(seed) {
    let state = seed >>> 0;

    return () => {
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 4294967296;
    };
}
