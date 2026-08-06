import { describe, expect, it } from "vitest";

import { WANTED_RECORD_STATUSES } from "@game/crimes";
import { CONTROL_SCENARIO_TYPES } from "@game/inspections/data";

import { getUnavailableControlScenarioTypes } from "./getUnavailableControlScenarioTypes.js";

const WANTED_NPC_ID = "npc--wanted";
const WANTED_VEHICLE_ID = "vehicle--wanted";

describe("getUnavailableControlScenarioTypes", () => {
    it("allows a wanted scenario when an active database identity is available", () => {
        const unavailableTypes = getUnavailableControlScenarioTypes({
            criminalDatabase: createCriminalDatabase()
        });

        expect(unavailableTypes).toEqual([]);
    });

    it("excludes wanted scenarios when the wanted NPC is already active", () => {
        const unavailableTypes = getUnavailableControlScenarioTypes({
            criminalDatabase: createCriminalDatabase(),
            excludedNpcIds: [WANTED_NPC_ID]
        });

        expect(unavailableTypes).toEqual([CONTROL_SCENARIO_TYPES.WANTED_PERSON]);
    });

    it("excludes wanted scenarios when the registered vehicle is already active", () => {
        const unavailableTypes = getUnavailableControlScenarioTypes({
            criminalDatabase: createCriminalDatabase(),
            excludedVehicleIds: [WANTED_VEHICLE_ID]
        });

        expect(unavailableTypes).toEqual([CONTROL_SCENARIO_TYPES.WANTED_PERSON]);
    });

    it("excludes wanted scenarios when no active wanted record exists", () => {
        const criminalDatabase = createCriminalDatabase();
        criminalDatabase.wantedRecordsById["wanted--one"].status = (
            WANTED_RECORD_STATUSES.RESOLVED
        );

        const unavailableTypes = getUnavailableControlScenarioTypes({
            criminalDatabase
        });

        expect(unavailableTypes).toEqual([CONTROL_SCENARIO_TYPES.WANTED_PERSON]);
    });
});

function createCriminalDatabase() {
    return {
        wantedRecordIds: ["wanted--one"],
        wantedRecordsById: {
            "wanted--one": {
                id: "wanted--one",
                npcId: WANTED_NPC_ID,
                status: WANTED_RECORD_STATUSES.ACTIVE
            }
        },
        npcsById: {
            [WANTED_NPC_ID]: {
                npcId: WANTED_NPC_ID,
                vehicleIds: [WANTED_VEHICLE_ID]
            }
        }
    };
}
