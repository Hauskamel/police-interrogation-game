import { pickWeightedItem } from "@game/shared";

import { TRAFFIC_ENTITY_TYPES } from "../data";

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
    const { forcedType, weights = defaultTrafficTypeWeights } = options;

    if (forcedType) {
        return forcedType;
    }

    return pickWeightedItem(weights).type;
}
