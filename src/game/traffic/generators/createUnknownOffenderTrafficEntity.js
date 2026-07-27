import { generateCrimeRecordsForNpc } from "@game/crimes/generators";
import { createDocumentState, createPresentedProfiles } from "@game/documents/generators";
import { generateNpcProfile } from "@game/npcs/generators";
import { generateVehicleProfile } from "@game/vehicles/generators";

import { POLICE_STATUSES, TRAFFIC_ENTITY_TYPES } from "../data";
import { createTrafficEntity } from "./createTrafficEntity.js";
import { createVehicleOwnership } from "./createVehicleOwnership.js";

// ##### Unknown Offender Traffic Entity
// -----> Erstellt einen NPC, der intern Straftaten begangen hat, aber der Polizei noch nicht bekannt ist.
// ---> Genau dieser Fall ist für Ermittlungen spannend: Wahrheit und Polizeiwissen unterscheiden sich.
export function createUnknownOffenderTrafficEntity(options = {}) {
    const baseDriverProfile = generateNpcProfile({ minimumAge: 18 });
    const { vehicleOwnerProfile, ownership } = createVehicleOwnership(baseDriverProfile, options);
    const baseVehicleProfile = generateVehicleProfile({
        registeredOwnerNpcId: ownership.registeredOwnerNpcId
    });
    const npcId = baseDriverProfile.real.npcId;

    // Die Straftaten sind intern bekannt, aber noch nicht Teil des Polizeiwissens.
    const crimeRecords = generateCrimeRecordsForNpc(npcId);
    const crimeRecordIds = crimeRecords.map((crimeRecord) => crimeRecord.id);
    const inspectionProfile = {
        complexityLevel: 2,
        deceptionRisk: 0.35,
        focusAreas: ["inconsistencies", "vehicle_documents", "behavior"]
    };
    const documentState = createDocumentState({
        trafficType: TRAFFIC_ENTITY_TYPES.UNKNOWN_OFFENDER,
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
        trafficType: TRAFFIC_ENTITY_TYPES.UNKNOWN_OFFENDER,
        truth: {
            role: "criminal",
            crimeRecordIds,
            caseIds: [],
            hiddenCrimeRecords: crimeRecords
        },
        police: {
            status: POLICE_STATUSES.UNKNOWN,
            knownToPolice: false,
            wantedLevel: 0,
            databaseNpcId: null,
            wantedRecordId: null
        },
        documentState,
        inspectionProfile
    });
}
