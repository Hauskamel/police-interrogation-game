import { createEntityId, getCurrentGameTimestamp } from "@game/shared";

import { INSPECTION_STATUSES } from "../data";

// ##### Inspection Session Factory
// -----> Erstellt den kontrollspezifischen Zustand für den aktuellen Gameplay-Loop.
// ---> Personen-, Fahrzeug- und Dokumentdaten bleiben über die TrafficEntity referenziert.
export function createInspectionSession(trafficEntityId, options = {}) {
    return {
        inspectionId: createEntityId("inspection"),
        trafficEntityId,
        shiftEncounter: options.shiftEncounter ?? null,
        conversationMemory: options.conversationMemory ?? { clueIds: [] },
        status: INSPECTION_STATUSES.ACTIVE,
        startedAt: getCurrentGameTimestamp(),
        completedAt: null,
        openedDocuments: [],
        visibleDocuments: [],
        documentRequestStates: {},
        findings: [],
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
        playerDecision: null,
        resolution: null
    };
}
