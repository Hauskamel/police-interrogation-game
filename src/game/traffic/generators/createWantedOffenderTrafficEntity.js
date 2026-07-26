import { generateVehicleProfile } from "@game/vehicles/generators";
import { createDocumentState, createPresentedProfiles } from "@game/documents/generators";

import { POLICE_STATUSES, TRAFFIC_ENTITY_TYPES } from "../data";
import { getActiveWantedRecords, pickDatabaseNpcId } from "../utils";
import { createTrafficEntity } from "./createTrafficEntity.js";
import { createVehicleOwnership } from "./createVehicleOwnership.js";

// ##### Wanted Offender Traffic Entity
// -----> Spawnt einen NPC, der der Polizei bereits bekannt und aktiv gesucht ist.
// ---> NPC und Fahndungs-ID werden aus getrennten Tabellen der Criminal Database aufgelöst.
export function createWantedOffenderTrafficEntity(options = {}) {
    const { criminalDatabase } = options;
    const activeWantedRecords = getActiveWantedRecords(criminalDatabase);
    const candidateNpcIds = activeWantedRecords.map(({ npcId }) => npcId);
    const wantedNpcId = pickDatabaseNpcId(candidateNpcIds, options.forcedDatabaseNpcId);
    const wantedRecord = activeWantedRecords.find(({ npcId }) => npcId === wantedNpcId);

    // Gesuchte Spawns verwenden eine existierende NPC-Identität und deren aktive Fahndung.
    const baseDriverProfile = criminalDatabase?.npcsById?.[wantedNpcId];

    // Wenn NPC oder Fahndung fehlen, übernimmt generateTrafficEntity den sicheren Fallback.
    if (!baseDriverProfile || !wantedRecord) return null;

    const { vehicleOwnerProfile, ownership } = createVehicleOwnership(baseDriverProfile, options);
    const baseVehicleProfile = generateVehicleProfile({
        registeredOwnerNpcId: ownership.registeredOwnerNpcId
    });
    const crimeRecordIds = baseDriverProfile.real.crimeRecordIds ?? [];
    const inspectionProfile = {
        complexityLevel: Math.min(4, Math.max(2, crimeRecordIds.length + 1)),
        deceptionRisk: 0.65,
        focusAreas: ["identity_check", "wanted_database", "document_consistency"]
    };
    const documentState = createDocumentState({
        trafficType: TRAFFIC_ENTITY_TYPES.WANTED_OFFENDER,
        driverProfile: baseDriverProfile,
        vehicleProfile: baseVehicleProfile,
        forcedHasForgery: options.forcedHasForgery
    });
    const { driverProfile, vehicleProfile } = createPresentedProfiles({
        driverProfile: baseDriverProfile,
        vehicleProfile: baseVehicleProfile,
        documentState
    });

    return createTrafficEntity({
        driverProfile,
        vehicleOwnerProfile,
        vehicleProfile,
        ownership,
        trafficType: TRAFFIC_ENTITY_TYPES.WANTED_OFFENDER,
        truth: {
            role: "criminal",
            crimeRecordIds,
            caseIds: []
        },
        police: {
            status: POLICE_STATUSES.WANTED,
            knownToPolice: true,
            wantedLevel: Math.min(3, Math.max(1, crimeRecordIds.length)),
            databaseNpcId: wantedNpcId,
            wantedRecordId: wantedRecord.id
        },
        documentState,
        inspectionProfile
    });
}
