import {
    DOCUMENT_AVAILABILITY_STATUSES,
    INSPECTION_DOCUMENT_TYPES
} from "../data";
import { createEntityId } from "@game/shared";

// ##### Document Request Resolver
// -----> Bestimmt die fachliche Folge einer Dokumentanfrage ohne den Store zu verändern.
// ---> Dialog, Verfügbarkeit und Finding lassen sich dadurch isoliert testen oder ersetzen.
export function resolveDocumentRequest({ documentType, availability, attempts }) {
    const playerText = `Bitte zeigen Sie mir ${getDocumentRequestObject(documentType)}.`;
    const responseObject = getDocumentResponseObject(documentType);
    const missingFindingId = getMissingDocumentFindingId(documentType);
    const responseByAvailability = {
        [DOCUMENT_AVAILABILITY_STATUSES.FORGOTTEN]: `${responseObject} habe ich leider vergessen.`,
        [DOCUMENT_AVAILABILITY_STATUSES.LOST]: `${responseObject} kann ich nicht vorlegen. Das Dokument ist verloren gegangen.`,
        [DOCUMENT_AVAILABILITY_STATUSES.DAMAGED]: `Hier ist ${responseObject}. Das Dokument ist leider beschädigt.`,
        [DOCUMENT_AVAILABILITY_STATUSES.REFUSED]: `Nein. ${responseObject} werde ich nicht vorlegen.`,
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
        responseObject,
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
    responseObject,
    initiallyRefused,
    responseByAvailability
}) {
    if (initiallyRefused) {
        return `Muss das sein? ${responseObject} möchte ich nicht zeigen.`;
    }

    if (availability === DOCUMENT_AVAILABILITY_STATUSES.INITIALLY_REFUSED) {
        return `In Ordnung. Hier ist ${responseObject}.`;
    }

    return responseByAvailability[availability]
        ?? `Natürlich. Hier ist ${responseObject}.`;
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
        [INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE]: "missing_insurance",
        [INSPECTION_DOCUMENT_TYPES.RESIDENCE_PERMIT]: "missing_residence_permit",
        [INSPECTION_DOCUMENT_TYPES.WORK_PERMIT]: "missing_work_permit"
    };

    return findingByDocument[documentType];
}

function getDocumentRequestObject(documentType) {
    const requestObjectByDocument = {
        [INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE]: "Ihren Führerschein",
        [INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION]: "die Fahrzeugpapiere",
        [INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE]: "den Versicherungsnachweis",
        [INSPECTION_DOCUMENT_TYPES.RESIDENCE_PERMIT]: "Ihre Aufenthaltserlaubnis",
        [INSPECTION_DOCUMENT_TYPES.WORK_PERMIT]: "Ihre Arbeitserlaubnis"
    };

    return requestObjectByDocument[documentType];
}

// Liefert den Dokumentnamen mit passendem bestimmten Artikel fuer Fahrerantworten.
function getDocumentResponseObject(documentType) {
    const responseObjectByDocument = {
        [INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE]: "der Führerschein",
        [INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION]: "die Fahrzeugpapiere",
        [INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE]: "der Versicherungsnachweis",
        [INSPECTION_DOCUMENT_TYPES.RESIDENCE_PERMIT]: "die Aufenthaltserlaubnis",
        [INSPECTION_DOCUMENT_TYPES.WORK_PERMIT]: "die Arbeitserlaubnis"
    };

    return responseObjectByDocument[documentType];
}
