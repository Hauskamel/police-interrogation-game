import { describe, expect, it } from "vitest";

import { DOCUMENT_FORGERY_TARGETS } from "@game/documents/data";
import {
    CONTROL_SCENARIOS_BY_TYPE,
    CONTROL_SCENARIO_TYPES
} from "@game/inspections/data";

import { TRAFFIC_ENTITY_TYPES } from "../data";
import {
    getControlScenarioGenerationOptions,
    getTrafficTypeWeightsForControlScenario
} from "./getControlScenarioGenerationOptions.js";

describe("getControlScenarioGenerationOptions", () => {
    it("keeps a clean scenario free from random document problems", () => {
        const options = getControlScenarioGenerationOptions(
            CONTROL_SCENARIOS_BY_TYPE[CONTROL_SCENARIO_TYPES.CLEAN]
        );

        expect(options).toEqual({
            forcedHasForgery: false,
            forcedLicenseExpired: false,
            forcedInsuranceExpired: false
        });
    });

    it.each([
        [CONTROL_SCENARIO_TYPES.FORGED_IDENTITY, DOCUMENT_FORGERY_TARGETS.DRIVER],
        [CONTROL_SCENARIO_TYPES.FORGED_VEHICLE, DOCUMENT_FORGERY_TARGETS.VEHICLE],
        [CONTROL_SCENARIO_TYPES.FORGED_INSURANCE, DOCUMENT_FORGERY_TARGETS.INSURANCE]
    ])("maps %s to its exact forgery target", (scenarioType, expectedTarget) => {
        const options = getControlScenarioGenerationOptions(
            CONTROL_SCENARIOS_BY_TYPE[scenarioType]
        );

        expect(options.forcedHasForgery).toBe(true);
        expect(options.forcedForgeryTarget).toBe(expectedTarget);

        if (scenarioType === CONTROL_SCENARIO_TYPES.FORGED_IDENTITY) {
            expect(options.forcedDriverIsRegisteredOwner).toBe(true);
        }
    });

    it("uses generated identities when a license date must be controlled", () => {
        const weights = getTrafficTypeWeightsForControlScenario(
            CONTROL_SCENARIOS_BY_TYPE[CONTROL_SCENARIO_TYPES.EXPIRED_LICENSE]
        );

        expect(weights).toEqual([
            { type: TRAFFIC_ENTITY_TYPES.CIVILIAN, weight: 70 },
            { type: TRAFFIC_ENTITY_TYPES.UNKNOWN_OFFENDER, weight: 30 }
        ]);
    });
});
