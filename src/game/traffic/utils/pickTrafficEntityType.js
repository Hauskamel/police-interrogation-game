import { TRAFFIC_ENTITY_TYPES } from "../data";
import { pickWeightedItem } from "./pickWeightedItem.js";

// ##### Traffic Type Distribution
// -----> Steuert, welche Art von TrafficEntity im normalen Straßenverkehr auftaucht.
// ---> Die Werte sind bewusst gewichtet, damit normale Zivilisten deutlich häufiger sind.
const defaultTrafficTypeWeights = [
    { type: TRAFFIC_ENTITY_TYPES.CIVILIAN, weight: 70 },
    { type: TRAFFIC_ENTITY_TYPES.UNKNOWN_OFFENDER, weight: 15 },
    { type: TRAFFIC_ENTITY_TYPES.KNOWN_WANTED, weight: 10 }
];

// ##### Traffic Type Picker
// -----> Wählt den Spawn-Fall für eine neue TrafficEntity.
// ---> forcedType ist für Devtools oder gezielte Tests gedacht.
export function pickTrafficEntityType(options = {}) {
    const { forcedType, weights = defaultTrafficTypeWeights } = options;

    if (forcedType) return forcedType;

    return pickWeightedItem(weights).type;
}
