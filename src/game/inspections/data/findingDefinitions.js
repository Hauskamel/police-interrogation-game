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
// ---> Polizeitreffer entstehen erst durch die bewusste Abschlussentscheidung des Spielers.
export const INSPECTION_FINDING_DEFINITIONS = [
    {
        id: "driver_name_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Name stimmt nicht überein",
        description: "Vor- oder Nachname weichen von den bekannten Identitätsdaten ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["firstName", "lastName"],
        registryType: "driverLicense",
        playerSelectable: true
    },
    {
        id: "driver_address_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Adresse stimmt nicht überein",
        description: "Die vorgelegte Adresse weicht von den bekannten Personendaten ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["address"],
        registryType: "driverLicense",
        playerSelectable: true
    },
    {
        id: "driver_birth_date_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Geburtsdatum stimmt nicht überein",
        description: "Das Geburtsdatum passt nicht zum bekannten Personenrecord.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["birthDate", "birthYear", "age"],
        registryType: "driverLicense",
        playerSelectable: true
    },
    {
        id: "license_number_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Führerscheinnummer stimmt nicht überein",
        description: "Die vorgelegte Nummer ist im amtlichen Führerscheinregister nicht auflösbar.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["driversLicense.licenseNumber"],
        registryType: "driverLicense",
        playerSelectable: true
    },
    {
        id: "vehicle_plate_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Kennzeichen stimmt nicht überein",
        description: "Das Kennzeichen der Fahrzeugpapiere weicht vom registrierten Fahrzeug ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        affectedFields: ["carDocumentsData.plateNumber"],
        registryType: "vehicle",
        playerSelectable: true
    },
    {
        id: "vehicle_registration_number_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Zulassungsnummer stimmt nicht überein",
        description: "Die Zulassungsnummer passt nicht zum registrierten Fahrzeug.",
        documentType: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        affectedFields: ["carDocumentsData.carRegistrationNumber"],
        registryType: "vehicle",
        playerSelectable: true
    },
    {
        id: "vehicle_model_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Fahrzeugdaten stimmen nicht überein",
        description: "Hersteller oder Modell weichen von den Registerdaten ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        affectedFields: ["brand", "model"],
        registryType: "vehicle",
        playerSelectable: true
    },
    {
        id: "expired_drivers_license",
        category: INSPECTION_FINDING_CATEGORIES.VALIDITY,
        label: "Führerschein ist abgelaufen",
        description: "Das Ablaufdatum liegt vor dem Beginn der aktuellen Kontrolle.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: [],
        registryType: null,
        playerSelectable: true
    },
    {
        id: "insurance_policy_number_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Versicherungsnummer stimmt nicht überein",
        description: "Die vorgelegte Policennummer ist im Versicherungsregister nicht auflösbar.",
        documentType: INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE,
        affectedFields: ["insurance.policyNumber"],
        registryType: "insurance",
        playerSelectable: true
    },
    {
        id: "insurance_vehicle_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Versichertes Fahrzeug stimmt nicht überein",
        description: "Das Kennzeichen der Police passt nicht zum amtlich versicherten Fahrzeug.",
        documentType: INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE,
        affectedFields: ["insurance.insuredPlateNumber"],
        registryType: "insurance",
        playerSelectable: true
    },
    {
        id: "expired_insurance",
        category: INSPECTION_FINDING_CATEGORIES.VALIDITY,
        label: "Versicherung ist abgelaufen",
        description: "Das Ende des Versicherungsschutzes liegt vor Kontrollbeginn.",
        documentType: INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE,
        affectedFields: [],
        registryType: null,
        playerSelectable: true
    },
    {
        id: "active_wanted_record",
        category: INSPECTION_FINDING_CATEGORIES.POLICE,
        label: "Aktive Fahndung bestätigt",
        description: "Für die kontrollierte Person besteht eine passende aktive Fahndung.",
        documentType: null,
        affectedFields: [],
        registryType: null,
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
