import { describe, expect, it, vi } from "vitest";

import { createDiscrepancyDialogueTurn } from "./discrepancyDialogueProvider.js";

describe("createDiscrepancyDialogueTurn", () => {
    it("delegates the NPC response through an asynchronous provider boundary", async () => {
        const provider = {
            respond: vi.fn().mockResolvedValue("Eine externe Antwort.")
        };

        const turn = await createDiscrepancyDialogueTurn({
            findingId: "driver_name_mismatch",
            selectedFields: [
                {
                    fieldId: "driversLicense.lastName",
                    label: "Nachname",
                    value: "Falschername"
                }
            ],
            provider
        });

        expect(provider.respond).toHaveBeenCalledWith(expect.objectContaining({
            intent: "challenge_discrepancy",
            findingId: "driver_name_mismatch"
        }));
        expect(turn.playerText).toContain("Name stimmt nicht überein");
        expect(turn.npcText).toBe("Eine externe Antwort.");
    });
});

describe("appearance discrepancy dialogue", () => {
    it("confronts the driver about photo and appearance data", async () => {
        const turn = await createDiscrepancyDialogueTurn({
            findingId: "driver_appearance_mismatch",
            selectedFields: [
                { fieldId: "driversLicense.photo", label: "Passfoto", value: "driver2.jpg" },
                { fieldId: "registryPerson.photo", label: "Lichtbild", value: "driver11.jpg" }
            ]
        });

        expect(turn.playerText).toContain("Lichtbild");
        expect(turn.npcText).toContain("anderes Foto");
    });
});
