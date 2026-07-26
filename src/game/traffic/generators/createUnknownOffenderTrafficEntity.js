import { generateCrimeRecordsForNpc } from "@game/crimes/generators";
import { generateNpcProfile } from "@game/npcs/generators";
import { generateVehicleProfile } from "@game/vehicles/generators";

import { POLICE_STATUSES, TRAFFIC_ENTITY_TYPES } from "../data";
import { createTrafficEntity } from "./createTrafficEntity.js";

// ##### Unknown Offender Traffic Entity
// -----> Erstellt einen NPC, der intern Straftaten begangen hat, aber der Polizei noch nicht bekannt ist.
// ---> Genau dieser Fall ist für Ermittlungen spannend: Wahrheit und Polizeiwissen unterscheiden sich.
export function createUnknownOffenderTrafficEntity() {
    const driverProfile = generateNpcProfile({ minimumAge: 18 });
    const npcId = driverProfile.real.npcUuid;

    // Die Straftaten sind intern bekannt, aber noch nicht Teil des Polizeiwissens.
    const crimeRecords = generateCrimeRecordsForNpc(npcId);
    const crimeRecordIds = crimeRecords.map((crimeRecord) => crimeRecord.id);

    return createTrafficEntity({
        driverProfile,
        vehicleProfile: generateVehicleProfile(),
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
        inspectionProfile: {
            complexityLevel: 2,
            deceptionRisk: 0.35,
            focusAreas: ["inconsistencies", "vehicle_documents", "behavior"]
        },
        source: "trafficGenerator"
    });
}
