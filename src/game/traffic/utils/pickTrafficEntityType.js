import { pickWeightedItem } from "@game/shared";
import { CONTROL_SCENARIO_TYPES } from "@game/inspections/data";

import { TRAFFIC_ENTITY_TYPES } from "../data";
import { getTrafficTypeWeightsForControlScenario } from "./getControlScenarioGenerationOptions.js";

// ##### Traffic Type Distribution
// -----> Steuert, welche Art von TrafficEntity im normalen Straßenverkehr auftaucht.
// ---> Die Werte sind bewusst gewichtet, damit normale Zivilisten deutlich häufiger sind.
const defaultTrafficTypeWeights = [
    { type: TRAFFIC_ENTITY_TYPES.CIVILIAN, weight: 70 },
    { type: TRAFFIC_ENTITY_TYPES.UNKNOWN_OFFENDER, weight: 15 },
    { type: TRAFFIC_ENTITY_TYPES.KNOWN_OFFENDER, weight: 10 },
    { type: TRAFFIC_ENTITY_TYPES.WANTED_OFFENDER, weight: 5 }
];

// ##### Traffic Type Picker
// -----> Wählt den Spawn-Fall für eine neue TrafficEntity.
// ---> forcedType ist für Devtools oder gezielte Tests gedacht.
export function pickTrafficEntityType(options = {}) {
    const { forcedType, controlScenario } = options;

    if (forcedType) {
        return forcedType;
    }

    if (controlScenario?.type === CONTROL_SCENARIO_TYPES.WANTED_PERSON) {
        return TRAFFIC_ENTITY_TYPES.WANTED_OFFENDER;
    }

    const weights = options.weights
        ?? (controlScenario
            ? getTrafficTypeWeightsForControlScenario(controlScenario)
            : defaultTrafficTypeWeights);

    return pickWeightedItem(weights).type;
}
