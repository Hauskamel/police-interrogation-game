import { TRAFFIC_ENTITY_TYPES } from "../data";
import {
    getControlScenarioGenerationOptions,
    pickTrafficEntityType
} from "../utils";
import { createCivilianTrafficEntity } from "./createCivilianTrafficEntity.js";
import { createKnownOffenderTrafficEntity } from "./createKnownOffenderTrafficEntity.js";
import { createUnknownOffenderTrafficEntity } from "./createUnknownOffenderTrafficEntity.js";
import { createWantedOffenderTrafficEntity } from "./createWantedOffenderTrafficEntity.js";

// ##### Traffic Entity Generator
// -----> Zentraler Einstiegspunkt für alle NPC/Fahrzeug-Spawns im Straßenverkehr.
// ---> Der Generator entscheidet nur den Fall und delegiert die Details an kleinere Factory-Funktionen.
export function generateTrafficEntity(options = {}) {
    const generationOptions = {
        ...options,
        ...getControlScenarioGenerationOptions(options.controlScenario)
    };

    // pickTrafficEntityType kapselt die Spawn-Wahrscheinlichkeiten und optionale Dev-Overrides.
    const trafficType = pickTrafficEntityType(generationOptions);

    // Aktiv gesuchte NPCs werden mit einem eigenen Fahndungsrecord aus der Datenbank gezogen.
    // Falls die Datenbank noch leer ist, entsteht stattdessen ein unbekannter Täter.
    if (trafficType === TRAFFIC_ENTITY_TYPES.WANTED_OFFENDER) {
        const wantedEntity = createWantedOffenderTrafficEntity(generationOptions);

        // Ein vom Pacing geplanter Fahndungsfall darf nicht als unauffaelliger Fallback erscheinen.
        if (generationOptions.controlScenario && !wantedEntity) return null;

        return wantedEntity ?? createUnknownOffenderTrafficEntity(generationOptions);
    }

    // Polizeibekannte Täter kommen aus der Datenbank, besitzen aber keine aktive Fahndung.
    if (trafficType === TRAFFIC_ENTITY_TYPES.KNOWN_OFFENDER) {
        return createKnownOffenderTrafficEntity(generationOptions)
            ?? createUnknownOffenderTrafficEntity(generationOptions);
    }

    if (trafficType === TRAFFIC_ENTITY_TYPES.UNKNOWN_OFFENDER) {
        return createUnknownOffenderTrafficEntity(generationOptions);
    }

    return createCivilianTrafficEntity(generationOptions);
}
