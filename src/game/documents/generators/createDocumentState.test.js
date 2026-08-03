import { afterEach, describe, expect, it, vi } from "vitest";

import { DOCUMENT_INTEGRITY_TYPES } from "../data";
import { createDocumentState } from "./createDocumentState.js";


describe("createDocumentState", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("keeps every document valid when forgery is explicitly disabled", () => {
        const documentState = createDocumentState({
            trafficType: "wantedOffender",
            forcedHasForgery: false
        });

        expect(documentState.hasForgery).toBe(false);
        expect(documentState.npcDocuments.driversLicense.integrity).toBe(
            DOCUMENT_INTEGRITY_TYPES.VALID
        );
        expect(documentState.vehicleDocuments.registration.integrity).toBe(
            DOCUMENT_INTEGRITY_TYPES.VALID
        );
        expect(documentState.vehicleDocuments.insurance.integrity).toBe(
            DOCUMENT_INTEGRITY_TYPES.VALID
        );
    });

    it("creates one traceable manipulation when forgery is forced", () => {
        vi.spyOn(Math, "random").mockReturnValue(0);

        const documentState = createDocumentState({
            trafficType: "civilian",
            driverProfile: {
                real: {
                    driversLicense: {
                        licenseNumber: "ABC-12345678"
                    }
                }
            },
            vehicleProfile: {
                real: {
                    carDocumentsData: {
                        plateNumber: "AC - AB 1234"
                    }
                }
            },
            insuranceProfile: {
                real: {
                    policyId: "insurance--one"
                }
            },
            forcedHasForgery: true
        });

        expect(documentState.hasForgery).toBe(true);
        expect(documentState.npcDocuments.driversLicense.integrity).toBe(
            DOCUMENT_INTEGRITY_TYPES.FORGED
        );
        expect(documentState.npcDocuments.driversLicense.affectedFields).not.toEqual([]);
        expect(documentState.npcDocuments.driversLicense.detectableBy).not.toEqual([]);
        expect(documentState.vehicleDocuments.registration.integrity).toBe(
            DOCUMENT_INTEGRITY_TYPES.VALID
        );
        expect(documentState.vehicleDocuments.insurance.integrity).toBe(
            DOCUMENT_INTEGRITY_TYPES.VALID
        );
    });
});
