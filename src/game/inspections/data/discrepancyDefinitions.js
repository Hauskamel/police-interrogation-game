import { INSPECTION_DOCUMENT_TYPES } from "./inspectionConstants.js";

// ##### Discrepancy Definitions
// -----> Stellt dem Spieler neutrale Prüfpunkte zur Auswahl bereit.
// ---> Die Liste enthält immer alle Möglichkeiten und verrät deshalb keine echte Fälschung.
export const DISCREPANCY_DEFINITIONS = [
    {
        id: "driver_name_mismatch",
        label: "Name stimmt nicht überein",
        description: "Vor- oder Nachname weichen von den bekannten Identitätsdaten ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["firstName", "lastName"]
    },
    {
        id: "driver_address_mismatch",
        label: "Adresse stimmt nicht überein",
        description: "Die vorgelegte Adresse weicht von den bekannten Personendaten ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["address"]
    },
    {
        id: "driver_birth_date_mismatch",
        label: "Geburtsdatum stimmt nicht überein",
        description: "Das Geburtsdatum passt nicht zum bekannten Personenrecord.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["birthDate", "birthYear", "age"]
    },
    {
        id: "license_number_mismatch",
        label: "Führerscheinnummer stimmt nicht überein",
        description: "Die vorgelegte Nummer ist im Polizeibestand nicht auflösbar.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["driversLicense.licenseNumber"]
    },
    {
        id: "vehicle_plate_mismatch",
        label: "Kennzeichen stimmt nicht überein",
        description: "Das Kennzeichen der Fahrzeugpapiere weicht vom registrierten Fahrzeug ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        affectedFields: ["carDocumentsData.plateNumber"]
    },
    {
        id: "vehicle_registration_number_mismatch",
        label: "Zulassungsnummer stimmt nicht überein",
        description: "Die Zulassungsnummer passt nicht zum registrierten Fahrzeug.",
        documentType: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        affectedFields: ["carDocumentsData.carRegistrationNumber"]
    },
    {
        id: "vehicle_model_mismatch",
        label: "Fahrzeugdaten stimmen nicht überein",
        description: "Hersteller oder Modell weichen von den Registerdaten ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        affectedFields: ["brand", "model"]
    }
];

export const DISCREPANCY_DEFINITIONS_BY_ID = Object.fromEntries(
    DISCREPANCY_DEFINITIONS.map((definition) => [definition.id, definition])
);
