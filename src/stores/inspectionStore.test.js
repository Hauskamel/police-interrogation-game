import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
    INSPECTION_DOCUMENT_TYPES,
    INSPECTION_STATUSES
} from "@game/inspections/data";
import { resetGameClock } from "@game/shared";

import { useInspectionStore } from "./inspectionStore.js";


describe("inspectionStore", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-08-03T08:00:00.000Z"));
        resetGameClock();
        useInspectionStore.getState().resetInspectionState();
    });

    afterEach(() => {
        vi.useRealTimers();
        resetGameClock();
        useInspectionStore.getState().resetInspectionState();
    });

    it("allows only one active inspection", () => {
        const firstInspection = useInspectionStore
            .getState()
            .startInspection("traffic--one");
        const secondInspection = useInspectionStore
            .getState()
            .startInspection("traffic--two");

        expect(firstInspection.trafficEntityId).toBe("traffic--one");
        expect(firstInspection.startedAt).toBe("2026-08-03T08:00:00.000Z");
        expect(secondInspection).toBeNull();
        expect(useInspectionStore.getState().activeInspection).toBe(firstInspection);
    });

    it("separates requested and reviewed documents from visible windows", () => {
        const documentType = INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE;
        const store = useInspectionStore.getState();
        store.startInspection("traffic--one");
        store.requestDocument(documentType);
        store.requestDocument(documentType);
        store.closeDocument(documentType);

        const activeInspection = useInspectionStore.getState().activeInspection;

        expect(activeInspection.requestedDocuments).toEqual([documentType]);
        expect(activeInspection.openedDocuments).toEqual([documentType]);
        expect(activeInspection.visibleDocuments).toEqual([]);
    });

    it("shows a previously requested document again without duplicating history", () => {
        const documentType = INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION;
        const store = useInspectionStore.getState();
        store.startInspection("traffic--one");
        store.requestDocument(documentType);
        store.closeDocument(documentType);
        store.requestDocument(documentType);

        const activeInspection = useInspectionStore.getState().activeInspection;

        expect(activeInspection.requestedDocuments).toEqual([documentType]);
        expect(activeInspection.openedDocuments).toEqual([documentType]);
        expect(activeInspection.visibleDocuments).toEqual([documentType]);
    });

    it("moves a completed inspection into the last report", () => {
        useInspectionStore.getState().startInspection("traffic--one");
        vi.advanceTimersByTime(90_000);

        useInspectionStore.getState().completeInspection({
            playerDecision: {
                type: "allow_to_continue"
            },
            resolution: {
                outcome: "correct"
            }
        });

        const state = useInspectionStore.getState();

        expect(state.activeInspection).toBeNull();
        expect(state.lastCompletedInspection.status).toBe(
            INSPECTION_STATUSES.COMPLETED
        );
        expect(state.lastCompletedInspection.completedAt).toBe(
            "2026-08-03T08:01:30.000Z"
        );
    });
});
