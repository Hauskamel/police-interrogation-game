import { create } from "zustand";

import {
    createInspectionFinding,
    createInspectionSession
} from "@game/inspections/generators";
import {
    DOCUMENT_AVAILABILITY_STATUSES,
    INSPECTION_DOCUMENT_LABELS,
    INSPECTION_DOCUMENT_TYPES,
    INSPECTION_STATUSES
} from "@game/inspections/data";
import { createEntityId, getCurrentGameTimestamp } from "@game/shared";

// ##### Inspection Store
// -----> Hält genau eine aktive Kontrolle und den letzten abgeschlossenen Bericht.
// ---> Phase 1 verzichtet bewusst auf eine persistente Kontrollhistorie.
export const useInspectionStore = create((set, get) => ({
    activeInspection: null,
    lastCompletedInspection: null,

    // Erstellt nur dann eine Session, wenn keine andere Kontrolle aktiv ist.
    startInspection: (trafficEntityId) => {
        if (!trafficEntityId || get().activeInspection) return null;

        const inspectionSession = createInspectionSession(trafficEntityId);

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

            const requestedDocuments = activeInspection.requestedDocuments ?? [];
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
                    requestedDocuments: appendOnce(
                        requestedDocuments,
                        documentType
                    ),
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

    // Speichert eine gestellte Standardfrage und die für diesen NPC vorbereitete Antwort.
    recordInterviewAnswer: ({ questionId, playerText, npcText, findingId = null }) =>
        set((state) => {
            const activeInspection = state.activeInspection;
            if (!activeInspection || !questionId || !playerText || !npcText) return state;

            const finding = findingId
                ? createInspectionFinding({
                    findingId,
                    discoveredVia: "driver_statement",
                    evidence: [{
                        fieldId: `statement.${questionId}`,
                        label: "Fahreraussage",
                        value: npcText
                    }]
                })
                : null;

            return {
                activeInspection: {
                    ...activeInspection,
                    askedQuestionIds: appendOnce(
                        activeInspection.askedQuestionIds ?? [],
                        questionId
                    ),
                    findings: appendFinding(activeInspection.findings, finding),
                    conversationEntries: [
                        ...(activeInspection.conversationEntries ?? []),
                        {
                            id: createEntityId("conversation"),
                            type: "interview",
                            questionId,
                            playerText,
                            npcText
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

function resolveDocumentRequest({ documentType, availability, attempts }) {
    const documentLabel = INSPECTION_DOCUMENT_LABELS[documentType];
    const playerText = `Bitte zeigen Sie mir ${getDocumentRequestObject(documentType)}.`;
    const missingFindingId = getMissingDocumentFindingId(documentType);
    const responseByAvailability = {
        [DOCUMENT_AVAILABILITY_STATUSES.FORGOTTEN]: `Den ${documentLabel} habe ich leider vergessen.`,
        [DOCUMENT_AVAILABILITY_STATUSES.LOST]: `Den ${documentLabel} kann ich nicht vorlegen. Ich habe ihn verloren.`,
        [DOCUMENT_AVAILABILITY_STATUSES.DAMAGED]: `Hier ist der ${documentLabel}. Er ist leider beschädigt.`,
        [DOCUMENT_AVAILABILITY_STATUSES.REFUSED]: `Nein. Den ${documentLabel} werde ich nicht vorlegen.`,
        [DOCUMENT_AVAILABILITY_STATUSES.WRONG_DOCUMENT]: `Ich habe nur diesen Nachweis dabei. Er gehört zu einem anderen Fahrzeug.`
    };
    const initiallyRefused = availability
        === DOCUMENT_AVAILABILITY_STATUSES.INITIALLY_REFUSED
        && attempts === 1;
    const opensDocument = availability === DOCUMENT_AVAILABILITY_STATUSES.PROVIDED
        || availability === DOCUMENT_AVAILABILITY_STATUSES.DAMAGED
        || (availability === DOCUMENT_AVAILABILITY_STATUSES.INITIALLY_REFUSED && attempts > 1);
    const npcText = initiallyRefused
        ? `Muss das sein? Den ${documentLabel} möchte ich nicht zeigen.`
        : availability === DOCUMENT_AVAILABILITY_STATUSES.INITIALLY_REFUSED
            ? `In Ordnung. Hier ist der ${documentLabel}.`
            : responseByAvailability[availability]
                ?? `Natürlich. Hier ist der ${documentLabel}.`;
    const findingId = availability === DOCUMENT_AVAILABILITY_STATUSES.DAMAGED
        ? "damaged_document"
        : availability === DOCUMENT_AVAILABILITY_STATUSES.REFUSED
            ? "document_refusal"
            : availability === DOCUMENT_AVAILABILITY_STATUSES.WRONG_DOCUMENT
                ? "wrong_document_presented"
        : availability === DOCUMENT_AVAILABILITY_STATUSES.FORGOTTEN
            || availability === DOCUMENT_AVAILABILITY_STATUSES.LOST
            ? missingFindingId
            : null;

    return {
        opensDocument,
        findingId,
        result: initiallyRefused
            ? "initially_refused"
            : availability === DOCUMENT_AVAILABILITY_STATUSES.REFUSED
                ? "refused"
                : availability === DOCUMENT_AVAILABILITY_STATUSES.WRONG_DOCUMENT
                    ? "wrong_document"
                    : opensDocument
                        ? "provided"
                        : "unavailable",
        conversationEntry: {
            id: createEntityId("conversation"),
            type: "document_request",
            documentType,
            playerText,
            npcText
        }
    };
}

function getMissingDocumentFindingId(documentType) {
    const findingByDocument = {
        [INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE]: "missing_drivers_license",
        [INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION]: "missing_vehicle_registration",
        [INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE]: "missing_insurance"
    };

    return findingByDocument[documentType];
}

function getDocumentRequestObject(documentType) {
    const requestObjectByDocument = {
        [INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE]: "Ihren Führerschein",
        [INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION]: "die Fahrzeugpapiere",
        [INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE]: "den Versicherungsnachweis"
    };

    return requestObjectByDocument[documentType];
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
