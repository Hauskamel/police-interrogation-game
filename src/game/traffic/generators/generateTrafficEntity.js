import { TRAFFIC_ENTITY_TYPES } from "../data";
import { pickTrafficEntityType } from "../utils";
import { createCivilianTrafficEntity } from "./createCivilianTrafficEntity.js";
import { createKnownOffenderTrafficEntity } from "./createKnownOffenderTrafficEntity.js";
import { createUnknownOffenderTrafficEntity } from "./createUnknownOffenderTrafficEntity.js";
import { createWantedOffenderTrafficEntity } from "./createWantedOffenderTrafficEntity.js";

// ##### Traffic Entity Generator
// -----> Zentraler Einstiegspunkt für alle NPC/Fahrzeug-Spawns im Straßenverkehr.
// ---> Der Generator entscheidet nur den Fall und delegiert die Details an kleinere Factory-Funktionen.
export function generateTrafficEntity(options = {}) {
    // pickTrafficEntityType kapselt die Spawn-Wahrscheinlichkeiten und optionale Dev-Overrides.
    const trafficType = pickTrafficEntityType(options);

    // Aktiv gesuchte NPCs werden mit einem eigenen Fahndungsrecord aus der Datenbank gezogen.
    // Falls die Datenbank noch leer ist, entsteht stattdessen ein unbekannter Täter.
    if (trafficType === TRAFFIC_ENTITY_TYPES.WANTED_OFFENDER) {
        return createWantedOffenderTrafficEntity(options)
            ?? createUnknownOffenderTrafficEntity(options);
    }

    // Polizeibekannte Täter kommen aus der Datenbank, besitzen aber keine aktive Fahndung.
    if (trafficType === TRAFFIC_ENTITY_TYPES.KNOWN_OFFENDER) {
        return createKnownOffenderTrafficEntity(options)
            ?? createUnknownOffenderTrafficEntity(options);
    }

    if (trafficType === TRAFFIC_ENTITY_TYPES.UNKNOWN_OFFENDER) {
        return createUnknownOffenderTrafficEntity(options);
    }

    return createCivilianTrafficEntity(options);
}
