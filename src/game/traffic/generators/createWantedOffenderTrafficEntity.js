import { createNpcProfileFromReal } from "@game/npcs/generators";
import { createVehicleProfileFromReal } from "@game/vehicles/generators";

import { POLICE_STATUSES, TRAFFIC_ENTITY_TYPES } from "../data";
import {
    filterUnavailableDatabaseNpcIds,
    getActiveWantedRecords,
    getRegisteredVehicleRecord,
    pickDatabaseNpcId
} from "../utils";
import { assembleTrafficEntity } from "./assembleTrafficEntity.js";

// ##### Wanted Offender Traffic Entity
// -----> Spawnt einen NPC, der der Polizei bereits bekannt und aktiv gesucht ist.
// ---> NPC und Fahndungs-ID werden aus getrennten Tabellen der Criminal Database aufgelöst.
export function createWantedOffenderTrafficEntity(options = {}) {
    const { criminalDatabase } = options;
    const activeWantedRecords = getActiveWantedRecords(criminalDatabase);
    const candidateNpcIds = filterUnavailableDatabaseNpcIds(
        criminalDatabase,
        activeWantedRecords.map(({ npcId }) => npcId),
        options
    );
    const wantedNpcId = pickDatabaseNpcId(candidateNpcIds, options.forcedDatabaseNpcId);
    const wantedRecord = activeWantedRecords.find(({ npcId }) => npcId === wantedNpcId);

    // Gesuchte Spawns verwenden eine existierende NPC-Identität und deren aktive Fahndung.
    const databaseNpcRecord = criminalDatabase?.npcsById?.[wantedNpcId];

    // Wenn NPC oder Fahndung fehlen, übernimmt generateTrafficEntity den sicheren Fallback.
    if (!databaseNpcRecord || !wantedRecord) return null;

    const baseDriverProfile = createNpcProfileFromReal(databaseNpcRecord);
    const databaseVehicleRecord = getRegisteredVehicleRecord(
        criminalDatabase,
        databaseNpcRecord
    );
    const baseVehicleProfile = databaseVehicleRecord
        ? createVehicleProfileFromReal(databaseVehicleRecord)
        : undefined;
    const crimeRecordIds = databaseNpcRecord.crimeRecordIds ?? [];
    const inspectionProfile = {
        complexityLevel: Math.min(4, Math.max(2, crimeRecordIds.length + 1)),
        deceptionRisk: 0.65,
        focusAreas: ["identity_check", "wanted_database", "document_consistency"]
    };
    return assembleTrafficEntity({
        baseDriverProfile,
        trafficType: TRAFFIC_ENTITY_TYPES.WANTED_OFFENDER,
        truth: {
            role: "criminal",
            crimeRecordIds,
            caseIds: []
        },
        police: {
            status: POLICE_STATUSES.WANTED,
            databaseNpcId: wantedNpcId,
            wantedRecordId: wantedRecord.id
        },
        inspectionProfile,
        options: {
            ...options,
            forcedDriverIsRegisteredOwner: true
        },
        baseVehicleProfile
    });
}
