import { create } from "zustand";

import {
    createInspectionFinding,
    createInspectionSession
} from "@game/inspections/generators";
import {
    DOCUMENT_AVAILABILITY_STATUSES,
    INSPECTION_DOCUMENT_LABELS,
    INSPECTION_STATUSES
} from "@game/inspections/data";
import { resolveDocumentRequest } from "@game/inspections/utils";
import { createEntityId, getCurrentGameTimestamp } from "@game/shared";

// ##### Inspection Store
// -----> Hält genau eine aktive Kontrolle und den letzten abgeschlossenen Bericht.
// ---> Eine persistente Kontrollhistorie ist weiterhin bewusst nicht Teil dieses Stores.
export const useInspectionStore = create((set, get) => ({
    activeInspection: null,
    lastCompletedInspection: null,

    // Erstellt nur dann eine Session, wenn keine andere Kontrolle aktiv ist.
    startInspection: (trafficEntityId, options = {}) => {
        if (!trafficEntityId || get().activeInspection) return null;

        const inspectionSession = createInspectionSession(trafficEntityId, options);

        set({
            activeInspection: inspectionSession,
            lastCompletedInspection: null
        });

        return inspectionSession;
    },

    // Verarbeitet eine Dokumentanfrage samt Verfügbarkeit, Dialog und möglicher Feststellung.
    requestDocument: (request) =>
        set((state) => {
            const activeInspection = state.activeInspection;
            const documentType = typeof request === "string"
                ? request
                : request?.documentType;
            const availability = typeof request === "string"
                ? DOCUMENT_AVAILABILITY_STATUSES.PROVIDED
                : request?.availability ?? DOCUMENT_AVAILABILITY_STATUSES.PROVIDED;
            if (!activeInspection || !documentType) return state;

            const openedDocuments = activeInspection.openedDocuments ?? [];
            const visibleDocuments = activeInspection.visibleDocuments ?? [];
            const previousRequestState = activeInspection.documentRequestStates?.[
                documentType
            ];
            const attempts = (previousRequestState?.attempts ?? 0) + 1;
            const requestResult = resolveDocumentRequest({
                documentType,
                availability,
                attempts
            });
            const finding = requestResult.findingId
                ? createInspectionFinding({
                    findingId: requestResult.findingId,
                    discoveredVia: "document_request",
                    evidence: [{
                        fieldId: `documentAvailability.${documentType}`,
                        label: INSPECTION_DOCUMENT_LABELS[documentType],
                        value: availability
                    }]
                })
                : null;

            return {
                activeInspection: {
                    ...activeInspection,
                    openedDocuments: requestResult.opensDocument
                        ? appendOnce(openedDocuments, documentType)
                        : openedDocuments,
                    visibleDocuments: requestResult.opensDocument
                        ? appendOnce(visibleDocuments, documentType)
                        : visibleDocuments,
                    documentRequestStates: {
                        ...(activeInspection.documentRequestStates ?? {}),
                        [documentType]: {
                            attempts,
                            availability,
                            result: requestResult.result
                        }
                    },
                    findings: appendFinding(activeInspection.findings, finding),
                    conversationEntries: [
                        ...(activeInspection.conversationEntries ?? []),
                        requestResult.conversationEntry
                    ]
                }
            };
        }),

    // Speichert eine gestellte Standardfrage als beobachtbaren Teil des Gesprächs.
    // Eine Aussage wird erst durch einen bewussten Feldvergleich zur Feststellung.
    recordInterviewAnswer: ({ questionId, playerText, npcText, fieldId = null, value = null }) =>
        set((state) => {
            const activeInspection = state.activeInspection;
            if (!activeInspection || !questionId || !playerText || !npcText) return state;

            return {
                activeInspection: {
                    ...activeInspection,
                    conversationEntries: [
                        ...(activeInspection.conversationEntries ?? []),
                        {
                            id: createEntityId("conversation"),
                            type: "interview",
                            questionId,
                            playerText,
                            npcText,
                            statementField: fieldId
                                ? { fieldId, value: value ?? npcText }
                                : null
                        }
                    ]
                }
            };
        }),

    // Schließt nur das sichtbare Dokumentfenster, ohne Anfrage oder Prüfverlauf zu löschen.
    closeDocument: (documentType) =>
        set((state) => {
            const activeInspection = state.activeInspection;
            if (!activeInspection) return state;

            const visibleDocuments = activeInspection.visibleDocuments ?? [];

            return {
                activeInspection: {
                    ...activeInspection,
                    visibleDocuments: visibleDocuments.filter(
                        (visibleDocument) => visibleDocument !== documentType
                    )
                }
            };
        }),

    // Aktiviert den fokussierten Feldvergleich und verwirft eine vorherige Teilauswahl.
    startDiscrepancyMode: () =>
        set((state) => {
            const nextState = updateDiscrepancyMode(state, {
                active: true,
                selectedFields: [],
                feedback: "Wählen Sie ein prüfbares Dokumentfeld aus.",
                isResolving: false
            });

            return updateRadioInquiryMode(
                nextState,
                createEmptyRadioInquiryMode()
            );
        }),

    // Beendet nur den Auswahlmodus; bereits erkannte Findings bleiben Teil der Session.
    cancelDiscrepancyMode: () =>
        set((state) => updateDiscrepancyMode(state, createEmptyDiscrepancyMode())),

    // Speichert die sichtbaren Felder und neutrales Bedienfeedback während des Vergleichs.
    setDiscrepancySelection: ({ selectedFields, feedback, isResolving = false }) =>
        set((state) => updateDiscrepancyMode(state, {
            active: true,
            selectedFields,
            feedback,
            isResolving
        })),

    // Schreibt ein belegtes Finding und den daraus entstandenen Dialog atomar in die Kontrolle.
    recordDiscrepancy: ({ findingId, conversationEntry, evidence = [] }) =>
        set((state) => {
            const activeInspection = state.activeInspection;
            if (!activeInspection || !findingId || !conversationEntry) return state;

            const finding = createInspectionFinding({
                findingId,
                discoveredVia: "document_comparison",
                evidence
            });

            return {
                activeInspection: {
                    ...activeInspection,
                    findings: appendFinding(activeInspection.findings, finding),
                    discrepancyMode: createEmptyDiscrepancyMode(),
                    conversationEntries: [
                        ...(activeInspection.conversationEntries ?? []),
                        conversationEntry
                    ]
                }
            };
        }),

    // Startet eine gezielte Registeranfrage an die Zentrale und beendet andere Feldmodi.
    startRadioInquiryMode: () =>
        set((state) => {
            const nextState = updateRadioInquiryMode(state, {
                active: true,
                selectedField: null,
                feedback: "Markieren Sie die Angabe, die an die Zentrale durchgegeben werden soll.",
                isResolving: false
            });

            return updateDiscrepancyMode(
                nextState,
                createEmptyDiscrepancyMode()
            );
        }),

    // Beendet die Funkfeldauswahl, ohne bereits geführte Funksprüche zu löschen.
    cancelRadioInquiryMode: () =>
        set((state) => updateRadioInquiryMode(
            state,
            createEmptyRadioInquiryMode()
        )),

    // Zeigt den ausgewählten Wert während der asynchron vorbereiteten Antwort an.
    setRadioInquirySelection: ({ selectedField, feedback, isResolving = false }) =>
        set((state) => updateRadioInquiryMode(state, {
            active: true,
            selectedField,
            feedback,
            isResolving
        })),

    // Speichert Funkspruch und Zentralenantwort zusammen; ein Finding ist optional.
    recordRadioInquiry: ({ findingId = null, conversationEntry, evidence = [] }) =>
        set((state) => {
            const activeInspection = state.activeInspection;
            if (!activeInspection || !conversationEntry) return state;

            const finding = findingId
                ? createInspectionFinding({
                    findingId,
                    discoveredVia: "radio_inquiry",
                    evidence,
                    sourceRecordId: evidence[0]?.recordId ?? null
                })
                : null;

            return {
                activeInspection: {
                    ...activeInspection,
                    findings: appendFinding(activeInspection.findings, finding),
                    radioInquiryMode: createEmptyRadioInquiryMode(),
                    dispatchConversationEntries: [
                        ...(activeInspection.dispatchConversationEntries ?? []),
                        conversationEntry
                    ]
                }
            };
        }),

    // Schließt die aktive Kontrolle unveränderlich mit Entscheidung und Auswertung ab.
    completeInspection: ({ playerDecision, resolution }) =>
        set((state) => {
            if (!state.activeInspection) return state;

            const completedInspection = {
                ...state.activeInspection,
                status: INSPECTION_STATUSES.COMPLETED,
                completedAt: getCurrentGameTimestamp(),
                playerDecision,
                resolution
            };

            return {
                activeInspection: null,
                lastCompletedInspection: completedInspection
            };
        }),

    // Bricht eine technisch nicht mehr fortsetzbare Kontrolle ohne Auswertung ab.
    cancelActiveInspection: () =>
        set((state) => {
            if (!state.activeInspection) return state;

            return {
                activeInspection: null
            };
        }),

    dismissCompletedInspection: () =>
        set({
            lastCompletedInspection: null
        }),

    resetInspectionState: () =>
        set({
            activeInspection: null,
            lastCompletedInspection: null
        })
}));

// Fügt einen Sessionwert nur einmal hinzu und hält die Reihenfolge der Spieleraktionen stabil.
function appendOnce(values, value) {
    return values.includes(value) ? values : [...values, value];
}

function appendFinding(findings = [], finding) {
    if (!finding || findings.some((entry) => entry.findingId === finding.findingId)) {
        return findings;
    }

    return [...findings, finding];
}

function updateDiscrepancyMode(state, discrepancyMode) {
    if (!state.activeInspection) return state;

    return {
        activeInspection: {
            ...state.activeInspection,
            discrepancyMode
        }
    };
}

function updateRadioInquiryMode(state, radioInquiryMode) {
    if (!state.activeInspection) return state;

    return {
        activeInspection: {
            ...state.activeInspection,
            radioInquiryMode
        }
    };
}

function createEmptyDiscrepancyMode() {
    return {
        active: false,
        selectedFields: [],
        feedback: null,
        isResolving: false
    };
}

function createEmptyRadioInquiryMode() {
    return {
        active: false,
        selectedField: null,
        feedback: null,
        isResolving: false
    };
}
