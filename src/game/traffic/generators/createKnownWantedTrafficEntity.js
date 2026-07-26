import { generateVehicleProfile } from "@game/vehicles/generators";
import { createDocumentState, createPresentedProfiles } from "@game/documents/generators";

import { POLICE_STATUSES, TRAFFIC_ENTITY_TYPES } from "../data";
import { createTrafficEntity } from "./createTrafficEntity.js";

// ##### Wanted NPC Picker
// -----> Zieht einen bekannten gesuchten NPC aus der Criminal Database.
// ---> Gibt null zurück, wenn die Datenbank noch keine Wanted List enthält.
function pickWantedNpcId(criminalDatabase) {
    const wantedList = criminalDatabase?.wantedList ?? [];
    if (wantedList.length === 0) return null;

    return wantedList[Math.floor(Math.random() * wantedList.length)];
}

// ##### Known Wanted Traffic Entity
// -----> Spawnt einen NPC, der der Polizei bereits bekannt und aktiv gesucht ist.
// ---> Die Person kommt aus der Criminal Database, das Fahrzeug wird aktuell noch frisch generiert.
export function createKnownWantedTrafficEntity({ criminalDatabase } = {}) {
    const wantedNpcId = pickWantedNpcId(criminalDatabase);

    // Known-Wanted-Spawns verwenden existierende NPC-Daten aus der Criminal Database.
    const baseDriverProfile = criminalDatabase?.npcsById?.[wantedNpcId];

    // Wenn die Wanted List leer ist, übernimmt generateTrafficEntity den Fallback auf einen unbekannten Täter.
    if (!baseDriverProfile) return null;

    const baseVehicleProfile = generateVehicleProfile();
    const crimeRecordIds = baseDriverProfile.real.crimeRecordIds ?? [];
    const inspectionProfile = {
        complexityLevel: Math.min(4, Math.max(2, crimeRecordIds.length + 1)),
        deceptionRisk: 0.65,
        focusAreas: ["identity_check", "wanted_database", "document_consistency"]
    };
    const documentState = createDocumentState({
        trafficType: TRAFFIC_ENTITY_TYPES.KNOWN_WANTED,
        driverProfile: baseDriverProfile,
        vehicleProfile: baseVehicleProfile
    });
    const { driverProfile, vehicleProfile } = createPresentedProfiles({
        driverProfile: baseDriverProfile,
        vehicleProfile: baseVehicleProfile,
        documentState
    });

    return createTrafficEntity({
        driverProfile,
        vehicleProfile,
        trafficType: TRAFFIC_ENTITY_TYPES.KNOWN_WANTED,
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
            wantedRecordId: wantedNpcId
        },
        documentState,
        inspectionProfile,
        source: "criminalDatabase"
    });
}
