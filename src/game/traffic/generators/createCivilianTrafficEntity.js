import { generateNpcProfile } from "@game/npcs/generators";

import { POLICE_STATUSES, TRAFFIC_ENTITY_TYPES } from "../data";
import { assembleTrafficEntity } from "./assembleTrafficEntity.js";

// ##### Civilian Inspection Profiles
// -----> Kleine Varianten für normale Kontrollen ohne bekannten Straftatbezug.
// ---> Wird von createCivilianTrafficEntity genutzt, damit Zivilisten nicht komplett identisch wirken.
const civilianInspectionProfiles = [
    {
        complexityLevel: 1,
        deceptionRisk: 0,
        focusAreas: ["routine_documents"]
    },
    {
        complexityLevel: 1,
        deceptionRisk: 0.05,
        focusAreas: ["routine_documents", "expired_dates"]
    },
    {
        complexityLevel: 2,
        deceptionRisk: 0.1,
        focusAreas: ["routine_documents", "address_consistency"]
    }
];

// ##### Civilian Traffic Entity
// -----> Erstellt einen normalen Verkehrsteilnehmer ohne bekannte Straftat.
// ---> Zivilisten können trotzdem kleine Prüfauffälligkeiten haben, z.B. abgelaufene Dokumente.
export function createCivilianTrafficEntity(options = {}) {
    const baseDriverProfile = generateNpcProfile({
        minimumAge: options.forcedLicenseExpired ? 34 : 18,
        forcedLicenseExpired: options.forcedLicenseExpired
    });
    const inspectionProfile = pickCivilianInspectionProfile();

    return assembleTrafficEntity({
        baseDriverProfile,
        trafficType: TRAFFIC_ENTITY_TYPES.CIVILIAN,
        truth: {
            role: "civilian",
            crimeRecordIds: [],
            caseIds: []
        },
        police: {
            status: POLICE_STATUSES.UNKNOWN,
            databaseNpcId: null,
            wantedRecordId: null
        },
        inspectionProfile,
        options
    });
}

// ##### Civilian Inspection Profile Picker
// -----> Variiert die Prüfkomplexität von Zivilisten leicht.
// ---> Täuschungsrisiko bedeutet hier nicht "kriminell", sondern nur mögliche Prüfauffälligkeit.
function pickCivilianInspectionProfile() {
    return civilianInspectionProfiles[Math.floor(Math.random() * civilianInspectionProfiles.length)];
}
