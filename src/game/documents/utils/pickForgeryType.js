import { NPC_DOCUMENT_FORGERY_TYPES, VEHICLE_DOCUMENT_FORGERY_TYPES } from "../data";

// ##### NPC Forgery Picker
// -----> Wählt aus, welche Personenangabe auf einem vorgezeigten Dokument manipuliert wird.
// ---> Wird von createDocumentState genutzt, bevor presented aus real erzeugt wird.
export function pickNpcDocumentForgeryType() {
    return pickWeightedForgeryType([
        { value: NPC_DOCUMENT_FORGERY_TYPES.WRONG_ADDRESS, weight: 35 },
        { value: NPC_DOCUMENT_FORGERY_TYPES.WRONG_LICENSE_NUMBER, weight: 30 },
        { value: NPC_DOCUMENT_FORGERY_TYPES.WRONG_BIRTH_DATE, weight: 20 },
        { value: NPC_DOCUMENT_FORGERY_TYPES.WRONG_NAME, weight: 15 }
    ]).value;
}

// ##### Vehicle Forgery Picker
// -----> Wählt aus, welche Fahrzeugangabe auf dem Fahrzeugschein manipuliert wird.
// ---> Wird von createDocumentState für Fahrzeugdokumente verwendet.
export function pickVehicleDocumentForgeryType() {
    return pickWeightedForgeryType([
        { value: VEHICLE_DOCUMENT_FORGERY_TYPES.PLATE_MISMATCH, weight: 45 },
        { value: VEHICLE_DOCUMENT_FORGERY_TYPES.WRONG_REGISTRATION_NUMBER, weight: 35 },
        { value: VEHICLE_DOCUMENT_FORGERY_TYPES.WRONG_VEHICLE_MODEL, weight: 20 }
    ]).value;
}

// ##### Weighted Forgery Picker
// -----> Kleiner lokaler Weight-Helper für Dokumentmanipulationen.
// ---> Bleibt absichtlich in der Document-Domain, damit Documents nicht von Traffic-Utils abhängt.
function pickWeightedForgeryType(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of items) {
        random -= item.weight;
        if (random <= 0) return item;
    }

    return items[items.length - 1];
}
