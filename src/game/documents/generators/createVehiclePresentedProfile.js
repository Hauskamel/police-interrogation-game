import { faker } from "@faker-js/faker";

import { DOCUMENT_INTEGRITY_TYPES, VEHICLE_DOCUMENT_FORGERY_TYPES } from "../data";

// ##### Vehicle Presented Profile Generator
// -----> Erstellt die vorgezeigten Fahrzeugdaten aus den echten Fahrzeugdaten.
// ---> Fahrzeugfälschungen verändern nur die Dokumentansicht, nicht das echte Fahrzeug.
export function createVehiclePresentedProfile(real, documentState) {
    const presentedProfile = cloneVehicleProfile(real);
    const registrationState = documentState?.vehicleDocuments?.registration;

    if (registrationState?.integrity !== DOCUMENT_INTEGRITY_TYPES.FORGED) {
        return presentedProfile;
    }

    return applyVehicleDocumentForgery(presentedProfile, registrationState.forgeryType);
}

// ##### Vehicle Profile Clone
// -----> Kopiert die verschachtelten Fahrzeugdokumentdaten für presented.
// ---> So kann der Fahrzeugschein abweichen, während vehicleProfile.real stabil bleibt.
function cloneVehicleProfile(real) {
    return {
        ...real,
        carDocumentsData: { ...real.carDocumentsData }
    };
}

// ##### Vehicle Forgery Applier
// -----> Verändert gezielt ein sichtbares Feld auf dem Fahrzeugschein.
// ---> Diese Manipulationen sind später durch Sichtprüfung oder Datenbankabgleich auffindbar.
function applyVehicleDocumentForgery(presentedProfile, forgeryType) {
    if (forgeryType === VEHICLE_DOCUMENT_FORGERY_TYPES.PLATE_MISMATCH) {
        return {
            ...presentedProfile,
            carDocumentsData: {
                ...presentedProfile.carDocumentsData,
                plateNumber: createForgedPlateNumber()
            }
        };
    }

    if (forgeryType === VEHICLE_DOCUMENT_FORGERY_TYPES.WRONG_REGISTRATION_NUMBER) {
        return {
            ...presentedProfile,
            carDocumentsData: {
                ...presentedProfile.carDocumentsData,
                carRegistrationNumber: faker.vehicle.vrm()
            }
        };
    }

    if (forgeryType === VEHICLE_DOCUMENT_FORGERY_TYPES.WRONG_VEHICLE_MODEL) {
        return {
            ...presentedProfile,
            brand: faker.vehicle.manufacturer(),
            model: faker.vehicle.model()
        };
    }

    return presentedProfile;
}

// ##### Forged Plate Factory
// -----> Erzeugt ein plausibles Kennzeichenformat, das nicht aus dem echten Fahrzeug stammt.
// ---> Der Fehler soll über Kennzeichenabgleich auffallen, nicht durch komplett absurdes Format.
function createForgedPlateNumber() {
    return `AC - ${faker.string.alpha({ length: 2, casing: "upper" })} ${faker.number.int({ min: 1000, max: 9999 })}`;
}
