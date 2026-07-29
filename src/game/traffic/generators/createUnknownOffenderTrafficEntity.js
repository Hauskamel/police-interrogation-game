import { generateCrimeRecordsForNpc } from "@game/crimes/generators";
import { generateNpcProfile } from "@game/npcs/generators";

import { POLICE_STATUSES, TRAFFIC_ENTITY_TYPES } from "../data";
import { assembleTrafficEntity } from "./assembleTrafficEntity.js";

// ##### Unknown Offender Traffic Entity
// -----> Erstellt einen NPC, der intern Straftaten begangen hat, aber der Polizei noch nicht bekannt ist.
// ---> Genau dieser Fall ist für Ermittlungen spannend: Wahrheit und Polizeiwissen unterscheiden sich.
export function createUnknownOffenderTrafficEntity(options = {}) {
    const baseDriverProfile = generateNpcProfile({ minimumAge: 18 });
    const npcId = baseDriverProfile.real.npcId;

    // Die Straftaten sind intern bekannt, aber noch nicht Teil des Polizeiwissens.
    const crimeRecords = generateCrimeRecordsForNpc(npcId, {
        // Die Tat existiert in der Weltwahrheit, wurde von der Polizei aber noch nicht entdeckt.
        status: "undiscovered"
    });
    const crimeRecordIds = crimeRecords.map((crimeRecord) => crimeRecord.id);
    const inspectionProfile = {
        complexityLevel: 2,
        deceptionRisk: 0.35,
        focusAreas: ["inconsistencies", "vehicle_documents", "behavior"]
    };
    const worldTruthRecords = {
        npcsById: {
            [npcId]: {
                ...baseDriverProfile.real,
                crimeRecordIds
            }
        },
        crimeRecordsById: Object.fromEntries(
            crimeRecords.map((crimeRecord) => [crimeRecord.id, crimeRecord])
        )
    };

    return assembleTrafficEntity({
        baseDriverProfile,
        trafficType: TRAFFIC_ENTITY_TYPES.UNKNOWN_OFFENDER,
        truth: {
            role: "criminal",
            crimeRecordIds,
            caseIds: []
        },
        police: {
            status: POLICE_STATUSES.UNKNOWN,
            databaseNpcId: null,
            wantedRecordId: null
        },
        inspectionProfile,
        options,
        worldTruthRecords
    });
}
