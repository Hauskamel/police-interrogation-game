import { INSPECTION_DOCUMENT_TYPES } from "./inspectionConstants.js";

// ##### Discrepancy Check Types
// -----> Bestimmt, ob ein Feld allein pruefbar ist oder ein sichtbares Vergleichsfeld benoetigt.
export const DISCREPANCY_CHECK_TYPES = {
    SINGLE: "single",
    PAIR: "pair"
};

// ##### Registry Record Subjects
// -----> Bestimmt, zu welcher kontrollierten Relation ein Laptop-Datensatz gehoeren muss.
export const DISCREPANCY_REGISTRY_SUBJECTS = {
    DRIVER: "driver",
    VEHICLE: "vehicle",
    VEHICLE_OWNER: "vehicleOwner",
    INSURANCE: "insurance"
};

// ##### Discrepancy Field Definitions
// -----> Verbindet sichtbare Dokumentfelder mit Vergleichsgruppen und bestehenden Findings.
// ---> Die UI rendert nur fieldId; alle fachlichen Regeln bleiben in dieser Konfiguration.
export const DISCREPANCY_FIELD_DEFINITIONS = [
    createPairField("driversLicense.firstName", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Vorname", "person.firstName", "driver_name_mismatch"),
    createPairField("driversLicense.lastName", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Nachname", "person.lastName", "driver_name_mismatch"),
    createPairField("driversLicense.address", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Adresse", "person.address", "driver_address_mismatch"),
    createPairField("driversLicense.birthDate", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Geburtsdatum", "person.birthDate", "driver_birth_date_mismatch"),
    createPairField("driversLicense.licenseNumber", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Fuehrerscheinnummer", "license.number", "license_number_mismatch"),
    createPairField("driversLicense.licensedSince", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Fahrerlaubnis seit", "license.licensedSince", "driver_license_dates_mismatch"),
    createPairField("driversLicense.issueDate", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Ausgabedatum", "license.issueDate", "driver_license_dates_mismatch"),
    createSingleField("driversLicense.expiryDate", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Ablaufdatum", "expired_drivers_license", "date.expiry"),

    createPairField("vehicleRegistration.ownerFirstName", INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION, "Halter Vorname", "person.firstName"),
    createPairField("vehicleRegistration.ownerLastName", INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION, "Halter Nachname", "person.lastName"),
    createPairField("vehicleRegistration.ownerAddress", INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION, "Halteradresse", "person.address"),
    createPairField("vehicleRegistration.plateNumber", INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION, "Kennzeichen", "vehicle.plateNumber", "vehicle_plate_mismatch"),
    createPairField("vehicleRegistration.registrationNumber", INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION, "Registriernummer", "vehicle.registrationNumber", "vehicle_registration_number_mismatch"),
    createPairField("vehicleRegistration.brand", INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION, "Hersteller", "vehicle.brand", "vehicle_model_mismatch"),
    createPairField("vehicleRegistration.model", INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION, "Modell", "vehicle.model", "vehicle_model_mismatch"),
    createPairField("vehicleRegistration.issueDate", INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION, "Ausstellungsdatum", "vehicle.issueDate", "vehicle_issue_date_mismatch"),
    createPairField("vehicleRegistration.yearOfConstruction", INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION, "Baujahr", "vehicle.yearOfConstruction", "vehicle_model_mismatch"),
    createPairField("vehicleRegistration.ps", INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION, "Leistung", "vehicle.ps", "vehicle_model_mismatch"),
    createPairField("vehicleRegistration.weight", INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION, "Gewicht", "vehicle.weight", "vehicle_model_mismatch"),

    createPairField("insurance.ownerFirstName", INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE, "Versicherungsnehmer", "person.firstName"),
    createPairField("insurance.ownerLastName", INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE, "Nachname", "person.lastName"),
    createPairField("insurance.policyNumber", INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE, "Policennummer", "insurance.policyNumber", "insurance_policy_number_mismatch"),
    createPairField("insurance.plateNumber", INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE, "Versichertes Kennzeichen", "vehicle.plateNumber", "insurance_vehicle_mismatch"),
    createSingleField("insurance.validUntil", INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE, "Gueltig bis", "expired_insurance", "date.expiry"),

    // Fahreraussagen sind sichtbare Belege. Sie erzeugen erst durch einen bewussten
    // Vergleich mit Dokument- oder Registerangaben eine Feststellung.
    createPairField("statement.address", null, "Genannte Adresse", "person.address", "inconsistent_driver_statement", "statement"),

    createRegistryPairField("registryPerson.firstName", "registry.person", "Vorname", "person.firstName", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryPerson.lastName", "registry.person", "Nachname", "person.lastName", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryPerson.address", "registry.person", "Adresse", "person.address", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryPerson.birthDate", "registry.person", "Geburtsdatum", "person.birthDate", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryLicense.number", "registry.license", "Fuehrerscheinnummer", "license.number", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryLicense.licensedSince", "registry.license", "Fahrerlaubnis seit", "license.licensedSince", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryLicense.issueDate", "registry.license", "Ausgabedatum", "license.issueDate", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),

    createRegistryPairField("registryVehicle.plateNumber", "registry.vehicle", "Kennzeichen", "vehicle.plateNumber", DISCREPANCY_REGISTRY_SUBJECTS.VEHICLE),
    createRegistryPairField("registryVehicle.registrationNumber", "registry.vehicle", "Zulassungsnummer", "vehicle.registrationNumber", DISCREPANCY_REGISTRY_SUBJECTS.VEHICLE),
    createRegistryPairField("registryVehicle.brand", "registry.vehicle", "Hersteller", "vehicle.brand", DISCREPANCY_REGISTRY_SUBJECTS.VEHICLE),
    createRegistryPairField("registryVehicle.model", "registry.vehicle", "Modell", "vehicle.model", DISCREPANCY_REGISTRY_SUBJECTS.VEHICLE),
    createRegistryPairField("registryVehicle.issueDate", "registry.vehicle", "Ausstellungsdatum", "vehicle.issueDate", DISCREPANCY_REGISTRY_SUBJECTS.VEHICLE),
    createRegistryPairField("registryVehicle.yearOfConstruction", "registry.vehicle", "Baujahr", "vehicle.yearOfConstruction", DISCREPANCY_REGISTRY_SUBJECTS.VEHICLE),
    createRegistryPairField("registryVehicle.ps", "registry.vehicle", "Leistung", "vehicle.ps", DISCREPANCY_REGISTRY_SUBJECTS.VEHICLE),
    createRegistryPairField("registryVehicle.weight", "registry.vehicle", "Gewicht", "vehicle.weight", DISCREPANCY_REGISTRY_SUBJECTS.VEHICLE),
    createRegistryPairField("registryOwner.firstName", "registry.owner", "Halter Vorname", "person.firstName", DISCREPANCY_REGISTRY_SUBJECTS.VEHICLE_OWNER),
    createRegistryPairField("registryOwner.lastName", "registry.owner", "Halter Nachname", "person.lastName", DISCREPANCY_REGISTRY_SUBJECTS.VEHICLE_OWNER),
    createRegistryPairField("registryOwner.address", "registry.owner", "Halteradresse", "person.address", DISCREPANCY_REGISTRY_SUBJECTS.VEHICLE_OWNER),

    createRegistryPairField("registryInsurance.policyNumber", "registry.insurance", "Policennummer", "insurance.policyNumber", DISCREPANCY_REGISTRY_SUBJECTS.INSURANCE),
    createRegistryPairField("registryInsurance.plateNumber", "registry.insurance", "Kennzeichen", "vehicle.plateNumber", DISCREPANCY_REGISTRY_SUBJECTS.INSURANCE)
];

export const DISCREPANCY_FIELD_DEFINITIONS_BY_ID = Object.fromEntries(
    DISCREPANCY_FIELD_DEFINITIONS.map((definition) => [definition.id, definition])
);

function createSingleField(id, documentType, label, findingId, valueSource) {
    return {
        id,
        documentType,
        surface: documentType,
        label,
        checkType: DISCREPANCY_CHECK_TYPES.SINGLE,
        comparisonGroup: null,
        findingId,
        valueSource
    };
}

function createPairField(
    id,
    documentType,
    label,
    comparisonGroup,
    findingId = null,
    surface = documentType
) {
    return {
        id,
        documentType,
        surface,
        label,
        checkType: DISCREPANCY_CHECK_TYPES.PAIR,
        comparisonGroup,
        findingId,
        valueSource: null
    };
}

function createRegistryPairField(id, surface, label, comparisonGroup, registrySubject) {
    return {
        id,
        documentType: null,
        surface,
        label,
        checkType: DISCREPANCY_CHECK_TYPES.PAIR,
        comparisonGroup,
        findingId: null,
        valueSource: null,
        registrySubject
    };
}
