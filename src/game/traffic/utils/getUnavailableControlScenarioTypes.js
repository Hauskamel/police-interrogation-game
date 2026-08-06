import { CONTROL_SCENARIO_TYPES } from "@game/inspections/data";

import {
    filterUnavailableDatabaseNpcIds,
    getActiveWantedRecords
} from "./getDatabaseNpcCandidates.js";

// ##### Unavailable Control Scenario Resolver
// -----> Verhindert geplante Fahndungsfaelle, wenn kein passender Datenbank-NPC spawnbar ist.
export function getUnavailableControlScenarioTypes({
    criminalDatabase,
    excludedNpcIds = [],
    excludedVehicleIds = []
} = {}) {
    const wantedNpcIds = getActiveWantedRecords(criminalDatabase)
        .map((record) => record.npcId);
    const availableWantedNpcIds = filterUnavailableDatabaseNpcIds(
        criminalDatabase,
        wantedNpcIds,
        {
            excludedNpcIds,
            excludedVehicleIds
        }
    );

    return availableWantedNpcIds.length === 0
        ? [CONTROL_SCENARIO_TYPES.WANTED_PERSON]
        : [];
}
