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

    it("records a missing document without opening it", () => {
        const documentType = INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE;
        const store = useInspectionStore.getState();
        store.startInspection("traffic--one");
        store.requestDocument({
            documentType,
            availability: "forgotten"
        });

        const activeInspection = useInspectionStore.getState().activeInspection;

        expect(activeInspection.openedDocuments).toEqual([]);
        expect(activeInspection.documentRequestStates[documentType].result).toBe(
            "unavailable"
        );
        expect(activeInspection.findings[0]).toMatchObject({
            findingId: "missing_drivers_license",
            discoveredVia: "document_request"
        });
    });

    it("opens an initially refused document after the second request", () => {
        const documentType = INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION;
        const store = useInspectionStore.getState();
        store.startInspection("traffic--one");
        store.requestDocument({
            documentType,
            availability: "initially_refused"
        });
        store.requestDocument({
            documentType,
            availability: "initially_refused"
        });

        const activeInspection = useInspectionStore.getState().activeInspection;

        expect(activeInspection.documentRequestStates[documentType].attempts).toBe(2);
        expect(activeInspection.visibleDocuments).toEqual([documentType]);
        expect(activeInspection.conversationEntries).toHaveLength(2);
    });

    it("stores interview contradictions as structured findings", () => {
        const store = useInspectionStore.getState();
        store.startInspection("traffic--one");
        store.recordInterviewAnswer({
            questionId: "address",
            playerText: "Wie lautet Ihre Anschrift?",
            npcText: "Lindenstraße 14",
            findingId: "inconsistent_driver_statement"
        });

        const activeInspection = useInspectionStore.getState().activeInspection;

        expect(activeInspection.askedQuestionIds).toEqual(["address"]);
        expect(activeInspection.findings[0]).toMatchObject({
            findingId: "inconsistent_driver_statement",
            discoveredVia: "driver_statement"
        });
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

    it("stores discrepancy selection separately from confirmed findings", () => {
        const store = useInspectionStore.getState();
        store.startInspection("traffic--one");
        store.startDiscrepancyMode();
        store.setDiscrepancySelection({
            selectedFields: [{ fieldId: "driversLicense.lastName", value: "Test" }],
            feedback: "Zweites Feld wählen"
        });

        const activeInspection = useInspectionStore.getState().activeInspection;

        expect(activeInspection.discrepancyMode.active).toBe(true);
        expect(activeInspection.discrepancyMode.selectedFields).toHaveLength(1);
        expect(activeInspection.markedFindingIds).toEqual([]);
    });

    it("records a confirmed discrepancy and its dialogue atomically", () => {
        const store = useInspectionStore.getState();
        const conversationEntry = {
            id: "dialogue--one",
            playerText: "Das Dokument ist abgelaufen.",
            npcText: "Das habe ich übersehen."
        };
        store.startInspection("traffic--one");
        store.startDiscrepancyMode();
        store.recordDiscrepancy({
            findingId: "expired_drivers_license",
            conversationEntry
        });

        const activeInspection = useInspectionStore.getState().activeInspection;

        expect(activeInspection.markedFindingIds).toEqual([
            "expired_drivers_license"
        ]);
        expect(activeInspection.conversationEntries).toEqual([conversationEntry]);
        expect(activeInspection.discrepancyMode.active).toBe(false);
    });

    it("keeps radio inquiries separate from the driver conversation", () => {
        const store = useInspectionStore.getState();
        const conversationEntry = {
            id: "radio-message--one",
            playerText: "Zentrale, bitte Zulassungsnummer prüfen: REG-FAKE.",
            dispatchText: "Negativ. Kein Datensatz vorhanden."
        };
        store.startInspection("traffic--one");
        store.startRadioInquiryMode();
        store.setRadioInquirySelection({
            selectedField: {
                fieldId: "vehicleRegistration.registrationNumber",
                value: "REG-FAKE"
            },
            feedback: "Zentrale prüft ...",
            isResolving: true
        });
        store.recordRadioInquiry({
            findingId: "vehicle_registration_number_mismatch",
            conversationEntry
        });

        const activeInspection = useInspectionStore.getState().activeInspection;

        expect(activeInspection.radioInquiryMode.active).toBe(false);
        expect(activeInspection.dispatchConversationEntries).toEqual([
            conversationEntry
        ]);
        expect(activeInspection.conversationEntries).toEqual([]);
        expect(activeInspection.markedFindingIds).toEqual([
            "vehicle_registration_number_mismatch"
        ]);
    });

    it("allows only one field selection mode at a time", () => {
        const store = useInspectionStore.getState();
        store.startInspection("traffic--one");
        store.startDiscrepancyMode();
        store.startRadioInquiryMode();

        let activeInspection = useInspectionStore.getState().activeInspection;
        expect(activeInspection.discrepancyMode.active).toBe(false);
        expect(activeInspection.radioInquiryMode.active).toBe(true);

        store.startDiscrepancyMode();
        activeInspection = useInspectionStore.getState().activeInspection;
        expect(activeInspection.discrepancyMode.active).toBe(true);
        expect(activeInspection.radioInquiryMode.active).toBe(false);
    });
});
