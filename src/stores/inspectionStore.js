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

    // Fordert ein Dokument beim Fahrer an und zeigt es in Phase 1 unmittelbar an.
    // ---> requestedDocuments schafft die spätere Erweiterungsstelle für vergessen oder verweigert.
    requestDocument: (documentType) =>
        set((state) => {
            const activeInspection = state.activeInspection;
            if (!activeInspection || !documentType) return state;

            const requestedDocuments = activeInspection.requestedDocuments ?? [];
            const openedDocuments = activeInspection.openedDocuments ?? [];
            const visibleDocuments = activeInspection.visibleDocuments ?? [];

            return {
                activeInspection: {
                    ...activeInspection,
                    requestedDocuments: appendOnce(
                        requestedDocuments,
                        documentType
                    ),
                    openedDocuments: appendOnce(
                        openedDocuments,
                        documentType
                    ),
                    visibleDocuments: appendOnce(
                        visibleDocuments,
                        documentType
                    )
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

// Fügt einen Sessionwert nur einmal hinzu und hält die Reihenfolge der Spieleraktionen stabil.
function appendOnce(values, value) {
    return values.includes(value) ? values : [...values, value];
}
