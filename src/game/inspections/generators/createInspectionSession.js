import { createEntityId, getCurrentGameTimestamp } from "@game/shared";

import { INSPECTION_STATUSES } from "../data";

// ##### Inspection Session Factory
// -----> Erstellt den kleinen, kontrollspezifischen Zustand für Phase 1.
// ---> Personen-, Fahrzeug- und Dokumentdaten bleiben über die TrafficEntity referenziert.
export function createInspectionSession(trafficEntityId) {
    return {
        inspectionId: createEntityId("inspection"),
        trafficEntityId,
        status: INSPECTION_STATUSES.ACTIVE,
        startedAt: getCurrentGameTimestamp(),
        completedAt: null,
        requestedDocuments: [],
        openedDocuments: [],
        visibleDocuments: [],
        documentRequestStates: {},
        findings: [],
        markedFindingIds: [],
        discrepancyMode: {
            active: false,
            selectedFields: [],
            feedback: null,
            isResolving: false
        },
        radioInquiryMode: {
            active: false,
            selectedField: null,
            feedback: null,
            isResolving: false
        },
        conversationEntries: [],
        dispatchConversationEntries: [],
        askedQuestionIds: [],
        playerDecision: null,
        resolution: null
    };
}
