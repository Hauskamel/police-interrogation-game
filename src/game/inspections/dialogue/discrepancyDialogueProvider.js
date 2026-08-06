import { createEntityId, getCurrentGameTimestamp } from "@game/shared";

import { INSPECTION_FINDING_DEFINITIONS_BY_ID } from "../data";

// ##### Scripted NPC Dialogue Provider
// -----> Liefert vorerst kurze, neutrale Antworten auf belegte Dokumentabweichungen.
// ---> Spaeter kann ein anderer Provider dieselbe respond(context)-Schnittstelle verwenden.
export const scriptedNpcDialogueProvider = {
    async respond({ findingId }) {
        const responsesByFindingId = {
            driver_name_mismatch: "Das muss ein Fehler in den Unterlagen sein.",
            driver_address_mismatch: "Ich bin vor Kurzem umgezogen. Vielleicht wurde das noch nicht aktualisiert.",
            driver_birth_date_mismatch: "Das Geburtsdatum sollte eigentlich stimmen.",
            license_number_mismatch: "Mehr kann ich Ihnen zu der Nummer nicht sagen.",
            vehicle_plate_mismatch: "Ich habe die Fahrzeugpapiere so erhalten.",
            vehicle_registration_number_mismatch: "Von einer falschen Registriernummer wusste ich nichts.",
            vehicle_model_mismatch: "Das ist das Dokument, das zu dem Fahrzeug gehören soll.",
            expired_drivers_license: "Das Ablaufdatum habe ich offenbar übersehen.",
            insurance_policy_number_mismatch: "Das ist der Nachweis, den mir die Versicherung geschickt hat.",
            insurance_vehicle_mismatch: "Ich dachte, die Police wäre für dieses Fahrzeug gültig.",
            expired_insurance: "Ich bin davon ausgegangen, dass der Schutz noch besteht."
        };

        return responsesByFindingId[findingId]
            ?? "Dazu kann ich Ihnen im Moment nichts Weiteres sagen.";
    }
};

// ##### Discrepancy Dialogue Turn Factory
// -----> Formuliert die Aussage des Polizisten und delegiert nur die NPC-Antwort.
// ---> Promise-basierte Provider erlauben spaeter regelbasierte oder KI-generierte Antworten.
export async function createDiscrepancyDialogueTurn({
    findingId,
    selectedFields,
    provider = scriptedNpcDialogueProvider
}) {
    const finding = INSPECTION_FINDING_DEFINITIONS_BY_ID[findingId];
    const context = {
        intent: "challenge_discrepancy",
        findingId,
        findingLabel: finding?.label ?? "Dokumentabweichung",
        selectedFields: selectedFields.map(({ fieldId, label, value }) => ({
            fieldId,
            label,
            value
        }))
    };
    const npcText = await provider.respond(context);

    return {
        id: createEntityId("dialogue"),
        intent: context.intent,
        findingId,
        selectedFieldIds: selectedFields.map(({ fieldId }) => fieldId),
        playerText: createOfficerStatement(findingId, finding?.label),
        npcText,
        createdAt: getCurrentGameTimestamp()
    };
}

function createOfficerStatement(findingId, findingLabel) {
    if (findingId === "expired_drivers_license") {
        return "Ihr Führerschein ist abgelaufen. Wie erklären Sie das?";
    }

    if (findingId === "expired_insurance") {
        return "Der Versicherungsschutz ist abgelaufen. Wie erklären Sie das?";
    }

    return `Ich habe eine Diskrepanz festgestellt: ${findingLabel}. Wie erklären Sie das?`;
}
