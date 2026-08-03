import { create } from "zustand";

import { createInspectionSession } from "@game/inspections/generators";
import { INSPECTION_STATUSES } from "@game/inspections/data";
import { getCurrentGameTimestamp } from "@game/shared";

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

    // Merkt sich ein geöffnetes Dokument einmalig für die aktive Kontrolle.
    registerOpenedDocument: (documentType) =>
        set((state) => {
            const activeInspection = state.activeInspection;

            if (
                !activeInspection
                || activeInspection.openedDocuments.includes(documentType)
            ) {
                return state;
            }

            return {
                activeInspection: {
                    ...activeInspection,
                    openedDocuments: [
                        ...activeInspection.openedDocuments,
                        documentType
                    ]
                }
            };
        }),

    // Öffnet oder schließt ein Dokumentfenster, ohne den Prüfverlauf zurückzusetzen.
    // `openedDocuments` bleibt deshalb auch nach einem manuellen Schließen unverändert.
    toggleDocumentVisibility: (documentType) =>
        set((state) => {
            const activeInspection = state.activeInspection;
            if (!activeInspection) return state;

            const visibleDocuments = activeInspection.visibleDocuments ?? [];
            const documentIsVisible = visibleDocuments.includes(documentType);

            return {
                activeInspection: {
                    ...activeInspection,
                    visibleDocuments: documentIsVisible
                        ? visibleDocuments.filter(
                            (visibleDocument) => visibleDocument !== documentType
                        )
                        : [
                            ...visibleDocuments,
                            documentType
                        ]
                }
            };
        }),

    // Fügt einen neutralen Prüfpunkt hinzu oder entfernt ihn wieder.
    toggleFinding: (findingId) =>
        set((state) => {
            const activeInspection = state.activeInspection;
            if (!activeInspection) return state;

            const findingIsMarked = activeInspection.markedFindingIds
                .includes(findingId);

            return {
                activeInspection: {
                    ...activeInspection,
                    markedFindingIds: findingIsMarked
                        ? activeInspection.markedFindingIds.filter(
                            (markedId) => markedId !== findingId
                        )
                        : [
                            ...activeInspection.markedFindingIds,
                            findingId
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
