import { createNpcProfileFromReal } from "@game/npcs/generators";

import { POLICE_STATUSES, TRAFFIC_ENTITY_TYPES } from "../data";
import { getKnownOffenderNpcIds, pickDatabaseNpcId } from "../utils";
import { assembleTrafficEntity } from "./assembleTrafficEntity.js";

// ##### Known Offender Traffic Entity
// -----> Spawnt einen polizeibekannten Straftäter ohne aktive Fahndung.
// ---> Die Identität stammt aus der Criminal Database, wantedRecordId bleibt bewusst null.
export function createKnownOffenderTrafficEntity(options = {}) {
    const { criminalDatabase } = options;
    const candidateNpcIds = getKnownOffenderNpcIds(criminalDatabase);
    const knownNpcId = pickDatabaseNpcId(candidateNpcIds, options.forcedDatabaseNpcId);
    const databaseNpcRecord = criminalDatabase?.npcsById?.[knownNpcId];

    if (!databaseNpcRecord) return null;

    const baseDriverProfile = createNpcProfileFromReal(databaseNpcRecord);
    const crimeRecordIds = databaseNpcRecord.crimeRecordIds ?? [];
    const inspectionProfile = {
        complexityLevel: Math.min(4, Math.max(2, crimeRecordIds.length)),
        deceptionRisk: 0.4,
        focusAreas: ["identity_check", "document_consistency"]
    };
    return assembleTrafficEntity({
        baseDriverProfile,
        trafficType: TRAFFIC_ENTITY_TYPES.KNOWN_OFFENDER,
        truth: {
            role: "criminal",
            crimeRecordIds,
            caseIds: []
        },
        police: {
            status: POLICE_STATUSES.KNOWN,
            databaseNpcId: knownNpcId,
            wantedRecordId: null
        },
        inspectionProfile,
        options
    });
}
