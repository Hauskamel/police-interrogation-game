import { INSPECTION_DOCUMENT_TYPES } from "./inspectionConstants.js";

// ##### Finding Categories
// -----> Trennt Dokumentabweichungen, Gültigkeitsprobleme und Polizeitreffer im Bericht.
export const INSPECTION_FINDING_CATEGORIES = {
    DOCUMENT: "document",
    VALIDITY: "validity",
    COOPERATION: "cooperation",
    POLICE: "police"
};

// ##### Finding Definitions
// -----> Die manuell auswählbaren Einträge sind immer vollständig sichtbar.
// ---> Polizeitreffer entstehen erst durch die bewusste Abschlussentscheidung des Spielers.
export const INSPECTION_FINDING_DEFINITIONS = [
    {
        id: "driver_appearance_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Passfoto und Personenmerkmale stimmen nicht überein",
        description: "Augenfarbe, Haarfarbe oder besondere Kennzeichen passen nicht zum Lichtbild.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["eyeColor", "hairColor", "distinguishingMarks", "npcImage"],
        registryType: "driverLicense"
    },
    {
        id: "driver_name_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Name stimmt nicht überein",
        description: "Vor- oder Nachname weichen von den bekannten Identitätsdaten ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["firstName", "lastName"],
        registryType: "driverLicense"
    },
    {
        id: "driver_address_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Adresse stimmt nicht überein",
        description: "Die vorgelegte Adresse weicht von den bekannten Personendaten ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["address"],
        registryType: "driverLicense"
    },
    {
        id: "driver_birth_date_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Geburtsdatum stimmt nicht überein",
        description: "Das Geburtsdatum passt nicht zum bekannten Personenrecord.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["birthDate", "birthYear", "age"],
        registryType: "driverLicense"
    },
    {
        id: "license_number_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Führerscheinnummer stimmt nicht überein",
        description: "Die vorgelegte Nummer ist im amtlichen Führerscheinregister nicht auflösbar.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["driversLicense.licenseNumber"],
        registryType: "driverLicense"
    },
    {
        id: "driver_license_dates_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Führerscheindaten stimmen nicht überein",
        description: "Ausgabe- oder Erteilungsdatum weichen vom amtlichen Führerscheinregister ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: ["driversLicense.licensedSince", "driversLicense.issueDate"],
        registryType: "driverLicense"
    },
    {
        id: "vehicle_plate_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Kennzeichen stimmt nicht überein",
        description: "Das Kennzeichen der Fahrzeugpapiere weicht vom registrierten Fahrzeug ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        affectedFields: ["carDocumentsData.plateNumber"],
        registryType: "vehicle"
    },
    {
        id: "vehicle_registration_number_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Zulassungsnummer stimmt nicht überein",
        description: "Die Zulassungsnummer passt nicht zum registrierten Fahrzeug.",
        documentType: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        affectedFields: ["carDocumentsData.carRegistrationNumber"],
        registryType: "vehicle"
    },
    {
        id: "vehicle_model_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Fahrzeugdaten stimmen nicht überein",
        description: "Hersteller oder Modell weichen von den Registerdaten ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        affectedFields: ["brand", "model"],
        registryType: "vehicle"
    },
    {
        id: "vehicle_issue_date_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Ausstellungsdatum stimmt nicht überein",
        description: "Das Ausstellungsdatum des Fahrzeugscheins weicht vom Zulassungsregister ab.",
        documentType: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        affectedFields: ["carDocumentsData.formattedIssueDate"],
        registryType: "vehicle"
    },
    {
        id: "expired_drivers_license",
        category: INSPECTION_FINDING_CATEGORIES.VALIDITY,
        label: "Führerschein ist abgelaufen",
        description: "Das Ablaufdatum liegt vor dem Beginn der aktuellen Kontrolle.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: [],
        registryType: null
    },
    {
        id: "insurance_policy_number_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Versicherungsnummer stimmt nicht überein",
        description: "Die vorgelegte Policennummer ist im Versicherungsregister nicht auflösbar.",
        documentType: INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE,
        affectedFields: ["insurance.policyNumber"],
        registryType: "insurance"
    },
    {
        id: "insurance_vehicle_mismatch",
        category: INSPECTION_FINDING_CATEGORIES.DOCUMENT,
        label: "Versichertes Fahrzeug stimmt nicht überein",
        description: "Das Kennzeichen der Police passt nicht zum amtlich versicherten Fahrzeug.",
        documentType: INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE,
        affectedFields: ["insurance.insuredPlateNumber"],
        registryType: "insurance"
    },
    {
        id: "expired_insurance",
        category: INSPECTION_FINDING_CATEGORIES.VALIDITY,
        label: "Versicherung ist abgelaufen",
        description: "Das Ende des Versicherungsschutzes liegt vor Kontrollbeginn.",
        documentType: INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE,
        affectedFields: [],
        registryType: null
    },
    {
        id: "missing_drivers_license",
        category: INSPECTION_FINDING_CATEGORIES.COOPERATION,
        label: "Führerschein nicht vorgelegt",
        description: "Der Fahrer kann den erforderlichen Führerschein nicht vorlegen.",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        affectedFields: [],
        registryType: null
    },
    {
        id: "missing_vehicle_registration",
        category: INSPECTION_FINDING_CATEGORIES.COOPERATION,
        label: "Fahrzeugpapiere nicht vorgelegt",
        description: "Die erforderlichen Fahrzeugpapiere können nicht vorgelegt werden.",
        documentType: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        affectedFields: [],
        registryType: null
    },
    {
        id: "missing_insurance",
        category: INSPECTION_FINDING_CATEGORIES.COOPERATION,
        label: "Versicherungsnachweis nicht vorgelegt",
        description: "Ein Versicherungsnachweis kann nicht vorgelegt werden.",
        documentType: INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE,
        affectedFields: [],
        registryType: null
    },
    {
        id: "damaged_document",
        category: INSPECTION_FINDING_CATEGORIES.COOPERATION,
        label: "Dokument erheblich beschädigt",
        description: "Ein vorgelegtes Dokument ist nur eingeschränkt prüfbar.",
        documentType: null,
        affectedFields: [],
        registryType: null
    },
    {
        id: "document_refusal",
        category: INSPECTION_FINDING_CATEGORIES.COOPERATION,
        label: "Pflichtdokument endgültig verweigert",
        description: "Der Fahrer verweigert die Vorlage eines erforderlichen Dokuments endgültig.",
        documentType: null,
        affectedFields: [],
        registryType: null
    },
    {
        id: "wrong_document_presented",
        category: INSPECTION_FINDING_CATEGORIES.COOPERATION,
        label: "Unpassendes Dokument vorgelegt",
        description: "Das vorgelegte Dokument gehört nicht zum kontrollierten Fahrer oder Fahrzeug.",
        documentType: null,
        affectedFields: [],
        registryType: null
    },
    {
        id: "inconsistent_driver_statement",
        category: INSPECTION_FINDING_CATEGORIES.COOPERATION,
        label: "Widersprüchliche Fahreraussage",
        description: "Eine Aussage des Fahrers widerspricht den vorgelegten oder amtlichen Angaben.",
        documentType: null,
        affectedFields: [],
        registryType: null
    },
    {
        id: "active_wanted_record",
        category: INSPECTION_FINDING_CATEGORIES.POLICE,
        label: "Aktive Fahndung bestätigt",
        description: "Für die kontrollierte Person besteht eine passende aktive Fahndung.",
        documentType: null,
        affectedFields: [],
        registryType: null
    }
];

export const INSPECTION_FINDING_DEFINITIONS_BY_ID = Object.fromEntries(
    INSPECTION_FINDING_DEFINITIONS.map((definition) => [
        definition.id,
        definition
    ])
);
