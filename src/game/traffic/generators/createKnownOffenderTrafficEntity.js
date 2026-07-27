import { createDocumentState, createPresentedProfiles } from "@game/documents/generators";
import { generateVehicleProfile } from "@game/vehicles/generators";

import { POLICE_STATUSES, TRAFFIC_ENTITY_TYPES } from "../data";
import { getKnownOffenderNpcIds, pickDatabaseNpcId } from "../utils";
import { createTrafficEntity } from "./createTrafficEntity.js";
import { createVehicleOwnership } from "./createVehicleOwnership.js";

// ##### Known Offender Traffic Entity
// -----> Spawnt einen polizeibekannten Straftäter ohne aktive Fahndung.
// ---> Die Identität stammt aus der Criminal Database, wantedRecordId bleibt bewusst null.
export function createKnownOffenderTrafficEntity(options = {}) {
    const { criminalDatabase } = options;
    const candidateNpcIds = getKnownOffenderNpcIds(criminalDatabase);
    const knownNpcId = pickDatabaseNpcId(candidateNpcIds, options.forcedDatabaseNpcId);
    const baseDriverProfile = criminalDatabase?.npcsById?.[knownNpcId];

    if (!baseDriverProfile) return null;

    const { vehicleOwnerProfile, ownership } = createVehicleOwnership(baseDriverProfile, options);
    const baseVehicleProfile = generateVehicleProfile({
        registeredOwnerNpcId: ownership.registeredOwnerNpcId
    });
    const crimeRecordIds = baseDriverProfile.real.crimeRecordIds ?? [];
    const inspectionProfile = {
        complexityLevel: Math.min(4, Math.max(2, crimeRecordIds.length)),
        deceptionRisk: 0.4,
        focusAreas: ["identity_check", "document_consistency"]
    };
    const documentState = createDocumentState({
        trafficType: TRAFFIC_ENTITY_TYPES.KNOWN_OFFENDER,
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
        trafficType: TRAFFIC_ENTITY_TYPES.KNOWN_OFFENDER,
        truth: {
            role: "criminal",
            crimeRecordIds,
            caseIds: []
        },
        police: {
            status: POLICE_STATUSES.KNOWN,
            knownToPolice: true,
            wantedLevel: 0,
            databaseNpcId: knownNpcId,
            wantedRecordId: null
        },
        documentState,
        inspectionProfile
    });
}
