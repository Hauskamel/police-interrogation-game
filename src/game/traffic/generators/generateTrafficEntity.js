import { TRAFFIC_ENTITY_TYPES } from "../data";
import { pickTrafficEntityType } from "../utils";
import { createCivilianTrafficEntity } from "./createCivilianTrafficEntity.js";
import { createKnownWantedTrafficEntity } from "./createKnownWantedTrafficEntity.js";
import { createUnknownOffenderTrafficEntity } from "./createUnknownOffenderTrafficEntity.js";

// ##### Traffic Entity Generator
// -----> Zentraler Einstiegspunkt für alle NPC/Fahrzeug-Spawns im Straßenverkehr.
// ---> Der Generator entscheidet nur den Fall und delegiert die Details an kleinere Factory-Funktionen.
export function generateTrafficEntity(options = {}) {
    // pickTrafficEntityType kapselt die Spawn-Wahrscheinlichkeiten und optionale Dev-Overrides.
    const trafficType = pickTrafficEntityType(options);

    // Bekannte Fahndungs-NPCs werden aus der Criminal Database gezogen.
    // Falls die Datenbank noch leer ist, entsteht stattdessen ein unbekannter Täter.
    if (trafficType === TRAFFIC_ENTITY_TYPES.KNOWN_WANTED) {
        return createKnownWantedTrafficEntity(options)
            ?? createUnknownOffenderTrafficEntity(options);
    }

    if (trafficType === TRAFFIC_ENTITY_TYPES.UNKNOWN_OFFENDER) {
        return createUnknownOffenderTrafficEntity(options);
    }

    return createCivilianTrafficEntity(options);
}
