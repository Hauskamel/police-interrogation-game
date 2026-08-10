import { describe, expect, it } from "vitest";

import { generateImmigrationDocuments } from "./generateImmigrationDocuments.js";

describe("generateImmigrationDocuments", () => {
    it("creates no permits when none are required", () => {
        const documents = generateImmigrationDocuments({
            npcId: "npc--one",
            migrationProfile: {
                requiresResidencePermit: false
            }
        });

        expect(documents).toEqual({
            residencePermit: null,
            workPermit: null
        });
    });

    it("relates a work permit to its residence permit and holder", () => {
        const documents = generateImmigrationDocuments({
            npcId: "npc--one",
            migrationProfile: {
                countryOfOrigin: "Auren",
                requiresResidencePermit: true,
                requiresWorkPermit: true,
                localAddress: "Marktweg 8",
                arrivalDate: "2026-08-01",
                departureDate: "2027-08-01",
                employment: {
                    occupation: "Monteur",
                    employer: "Nordwerk Anlagenbau"
                }
            }
        });

        expect(documents.residencePermit.holderNpcId).toBe("npc--one");
        expect(documents.workPermit.holderNpcId).toBe("npc--one");
        expect(documents.workPermit.residencePermitId).toBe(
            documents.residencePermit.permitId
        );
        expect(documents.workPermit.residencePermitNumber).toBe(
            documents.residencePermit.permitNumber
        );
    });
});
