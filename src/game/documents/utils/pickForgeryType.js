import { pickWeightedItem } from "@game/shared";

import { NPC_DOCUMENT_FORGERY_TYPES, VEHICLE_DOCUMENT_FORGERY_TYPES } from "../data";

// ##### NPC Forgery Picker
// -----> Wählt aus, welche Personenangabe auf einem vorgezeigten Dokument manipuliert wird.
// ---> Wird von createDocumentState genutzt, bevor presented aus real erzeugt wird.
export function pickNpcDocumentForgeryType() {
    return pickWeightedItem([
        { value: NPC_DOCUMENT_FORGERY_TYPES.WRONG_ADDRESS, weight: 25 },
        { value: NPC_DOCUMENT_FORGERY_TYPES.WRONG_LICENSE_NUMBER, weight: 20 },
        { value: NPC_DOCUMENT_FORGERY_TYPES.WRONG_BIRTH_DATE, weight: 20 },
        { value: NPC_DOCUMENT_FORGERY_TYPES.WRONG_NAME, weight: 15 },
        { value: NPC_DOCUMENT_FORGERY_TYPES.WRONG_EYE_COLOR, weight: 10 },
        { value: NPC_DOCUMENT_FORGERY_TYPES.WRONG_PHOTO, weight: 10 }
    ]).value;
}

// ##### Vehicle Forgery Picker
// -----> Wählt aus, welche Fahrzeugangabe auf dem Fahrzeugschein manipuliert wird.
// ---> Wird von createDocumentState für Fahrzeugdokumente verwendet.
export function pickVehicleDocumentForgeryType() {
    return pickWeightedItem([
        { value: VEHICLE_DOCUMENT_FORGERY_TYPES.PLATE_MISMATCH, weight: 45 },
        { value: VEHICLE_DOCUMENT_FORGERY_TYPES.WRONG_REGISTRATION_NUMBER, weight: 35 },
        { value: VEHICLE_DOCUMENT_FORGERY_TYPES.WRONG_VEHICLE_MODEL, weight: 20 }
    ]).value;
}
