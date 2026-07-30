import { createEntityId } from "@game/shared";

import { INSPECTION_STATUSES } from "../data";

// ##### Inspection Session Factory
// -----> Erstellt den kleinen, kontrollspezifischen Zustand für Phase 1.
// ---> Personen-, Fahrzeug- und Dokumentdaten bleiben über die TrafficEntity referenziert.
export function createInspectionSession(trafficEntityId) {
    return {
        inspectionId: createEntityId("inspection"),
        trafficEntityId,
        status: INSPECTION_STATUSES.ACTIVE,
        startedAt: new Date().toISOString(),
        completedAt: null,
        openedDocuments: [],
        markedDiscrepancies: [],
        playerDecision: null,
        resolution: null
    };
}
