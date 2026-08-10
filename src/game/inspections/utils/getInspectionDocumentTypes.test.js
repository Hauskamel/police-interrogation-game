import { describe, expect, it } from "vitest";

import { INSPECTION_DOCUMENT_TYPES } from "../data";
import {
    getRequestableInspectionDocumentTypes,
    getRequiredInspectionDocumentTypes
} from "./getInspectionDocumentTypes.js";

describe("inspection document types", () => {
    it("adds only permits required by the real migration profile", () => {
        const requiredDocuments = getRequiredInspectionDocumentTypes({
            driverProfile: {
                real: {
                    migrationProfile: {
                        requiresResidencePermit: true,
                        requiresWorkPermit: false
                    }
                }
            }
        });

        expect(requiredDocuments).toContain(
            INSPECTION_DOCUMENT_TYPES.RESIDENCE_PERMIT
        );
        expect(requiredDocuments).not.toContain(
            INSPECTION_DOCUMENT_TYPES.WORK_PERMIT
        );
    });

    it("reveals carried permit requests only after discussing the foreign stay", () => {
        const trafficEntity = {
            driverProfile: {
                presented: {
                    residencePermit: { permitNumber: "AE-ONE" },
                    workPermit: { permitNumber: "AR-ONE" }
                }
            }
        };

        const beforeQuestion = getRequestableInspectionDocumentTypes({
            trafficEntity
        });
        const afterQuestion = getRequestableInspectionDocumentTypes({
            trafficEntity,
            askedQuestionIds: ["foreign_stay"]
        });

        expect(beforeQuestion).not.toContain(
            INSPECTION_DOCUMENT_TYPES.RESIDENCE_PERMIT
        );
        expect(afterQuestion).toContain(
            INSPECTION_DOCUMENT_TYPES.RESIDENCE_PERMIT
        );
        expect(afterQuestion).toContain(
            INSPECTION_DOCUMENT_TYPES.WORK_PERMIT
        );
    });
});
