import { INSPECTION_DOCUMENT_TYPES } from "./inspectionConstants.js";

// ##### Finding Categories
// -----> Trennt Dokumentabweichungen, Gültigkeitsprobleme und Polizeitreffer im Bericht.
export const INSPECTION_FINDING_CATEGORIES = {
    DOCUMENT: "document",
    VALIDITY: "validity",
    POLICE: "police"
};

// ##### Finding Definitions
// -----> Die manuell auswählbaren Einträge sind immer vollständig sichtbar.
// ---> Polizeitreffer entstehen dagegen nur durch bewusst verknüpfte Laptop-Records.
export const INSPECTION_FINDING_DEFINITIONS = [
    {
        id: "driver_name_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Name stimmt nicht überein",
        description: "Vor- oder Nachname weichen von den bekannten Identitätsdaten ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["firstName", "lastName"],
        playerSelectable: true
    },
    {
        id: "driver_address_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Adresse stimmt nicht überein",
        description: "Die vorgelegte Adresse weicht von den bekannten Personendaten ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["address"],
        playerSelectable: true
    },
    {
        id: "driver_birth_date_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Geburtsdatum stimmt nicht überein",
        description: "Das Geburtsdatum passt nicht zum bekannten Personenrecord.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["birthDate", "birthYear", "age"],
        playerSelectable: true
    },
    {
        id: "license_number_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Führerscheinnummer stimmt nicht überein",
        description: "Die vorgelegte Nummer ist im Polizeibestand nicht auflösbar.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["driversLicense.licenseNumber"],
        playerSelectable: true
    },
    {
        id: "vehicle_plate_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Kennzeichen stimmt nicht überein",
        description: "Das Kennzeichen der Fahrzeugpapiere weicht vom registrierten Fahrzeug ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        affectedFields: ["carDocumentsData.plateNumber"],
        playerSelectable: true
    },
    {
        id: "vehicle_registration_number_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Zulassungsnummer stimmt nicht überein",
        description: "Die Zulassungsnummer passt nicht zum registrierten Fahrzeug.",
        documentType: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        affectedFields: ["carDocumentsData.carRegistrationNumber"],
        playerSelectable: true
    },
    {
        id: "vehicle_model_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Fahrzeugdaten stimmen nicht überein",
        description: "Hersteller oder Modell weichen von den Registerdaten ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        affectedFields: ["brand", "model"],
        playerSelectable: true
    },
    {
        id: "expired_drivers_license",
        category: INSPECTION_FINDING_CATEGORIES.VALIDITY,
        label: "Führerschein ist abgelaufen",
        description: "Das Ablaufdatum liegt vor dem Beginn der aktuellen Kontrolle.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: [],
        playerSelectable: true
    },
    {
        id: "active_wanted_record",
        category: INSPECTION_FINDING_CATEGORIES.POLICE,
        label: "Aktive Fahndung bestätigt",
        description: "Der passende aktive Fahndungsrecord wurde der Kontrolle zugeordnet.",
        documentType: null,
        affectedFields: [],
        playerSelectable: false
    }
];

export const PLAYER_SELECTABLE_FINDINGS = INSPECTION_FINDING_DEFINITIONS.filter(
    (definition) => definition.playerSelectable
);

export const INSPECTION_FINDING_DEFINITIONS_BY_ID = Object.fromEntries(
    INSPECTION_FINDING_DEFINITIONS.map((definition) => [
        definition.id,
        definition
    ])
);
