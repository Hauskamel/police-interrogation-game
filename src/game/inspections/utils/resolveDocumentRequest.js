import {
    DOCUMENT_AVAILABILITY_STATUSES,
    INSPECTION_DOCUMENT_LABELS,
    INSPECTION_DOCUMENT_TYPES
} from "../data";
import { createEntityId } from "@game/shared";

// ##### Document Request Resolver
// -----> Bestimmt die fachliche Folge einer Dokumentanfrage ohne den Store zu verändern.
// ---> Dialog, Verfügbarkeit und Finding lassen sich dadurch isoliert testen oder ersetzen.
export function resolveDocumentRequest({ documentType, availability, attempts }) {
    const documentLabel = INSPECTION_DOCUMENT_LABELS[documentType];
    const playerText = `Bitte zeigen Sie mir ${getDocumentRequestObject(documentType)}.`;
    const missingFindingId = getMissingDocumentFindingId(documentType);
    const responseByAvailability = {
        [DOCUMENT_AVAILABILITY_STATUSES.FORGOTTEN]: `Den ${documentLabel} habe ich leider vergessen.`,
        [DOCUMENT_AVAILABILITY_STATUSES.LOST]: `Den ${documentLabel} kann ich nicht vorlegen. Ich habe ihn verloren.`,
        [DOCUMENT_AVAILABILITY_STATUSES.DAMAGED]: `Hier ist der ${documentLabel}. Er ist leider beschädigt.`,
        [DOCUMENT_AVAILABILITY_STATUSES.REFUSED]: `Nein. Den ${documentLabel} werde ich nicht vorlegen.`,
        [DOCUMENT_AVAILABILITY_STATUSES.WRONG_DOCUMENT]: "Ich habe nur diesen Nachweis dabei. Er gehört zu einem anderen Fahrzeug."
    };
    const initiallyRefused = availability
        === DOCUMENT_AVAILABILITY_STATUSES.INITIALLY_REFUSED
        && attempts === 1;
    const opensDocument = availability === DOCUMENT_AVAILABILITY_STATUSES.PROVIDED
        || availability === DOCUMENT_AVAILABILITY_STATUSES.DAMAGED
        || (
            availability === DOCUMENT_AVAILABILITY_STATUSES.INITIALLY_REFUSED
            && attempts > 1
        );
    const npcText = getNpcResponse({
        availability,
        documentLabel,
        initiallyRefused,
        responseByAvailability
    });
    const findingId = getDocumentRequestFindingId({
        availability,
        missingFindingId
    });

    return {
        opensDocument,
        findingId,
        result: getDocumentRequestResult({
            availability,
            initiallyRefused,
            opensDocument
        }),
        conversationEntry: {
            id: createEntityId("conversation"),
            type: "document_request",
            documentType,
            playerText,
            npcText
        }
    };
}

function getNpcResponse({
    availability,
    documentLabel,
    initiallyRefused,
    responseByAvailability
}) {
    if (initiallyRefused) {
        return `Muss das sein? Den ${documentLabel} möchte ich nicht zeigen.`;
    }

    if (availability === DOCUMENT_AVAILABILITY_STATUSES.INITIALLY_REFUSED) {
        return `In Ordnung. Hier ist der ${documentLabel}.`;
    }

    return responseByAvailability[availability]
        ?? `Natürlich. Hier ist der ${documentLabel}.`;
}

function getDocumentRequestFindingId({ availability, missingFindingId }) {
    const findingByAvailability = {
        [DOCUMENT_AVAILABILITY_STATUSES.DAMAGED]: "damaged_document",
        [DOCUMENT_AVAILABILITY_STATUSES.REFUSED]: "document_refusal",
        [DOCUMENT_AVAILABILITY_STATUSES.WRONG_DOCUMENT]: "wrong_document_presented",
        [DOCUMENT_AVAILABILITY_STATUSES.FORGOTTEN]: missingFindingId,
        [DOCUMENT_AVAILABILITY_STATUSES.LOST]: missingFindingId
    };

    return findingByAvailability[availability] ?? null;
}

function getDocumentRequestResult({ availability, initiallyRefused, opensDocument }) {
    if (initiallyRefused) return "initially_refused";
    if (availability === DOCUMENT_AVAILABILITY_STATUSES.REFUSED) return "refused";
    if (availability === DOCUMENT_AVAILABILITY_STATUSES.WRONG_DOCUMENT) {
        return "wrong_document";
    }

    return opensDocument ? "provided" : "unavailable";
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
