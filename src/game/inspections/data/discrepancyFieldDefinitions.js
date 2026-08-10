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
    RESIDENCE_PERMIT: "residencePermit",
    WORK_PERMIT: "workPermit",
    VEHICLE: "vehicle",
    VEHICLE_OWNER: "vehicleOwner",
    INSURANCE: "insurance"
};

// ##### Discrepancy Field Definitions
// -----> Verbindet sichtbare Dokumentfelder mit Vergleichsgruppen und bestehenden Findings.
// ---> Die UI rendert nur fieldId; alle fachlichen Regeln bleiben in dieser Konfiguration.
export const DISCREPANCY_FIELD_DEFINITIONS = [
    createAppearancePhotoField(),
    createPairField("driversLicense.firstName", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Vorname", "person.firstName", "driver_name_mismatch"),
    createPairField("driversLicense.lastName", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Nachname", "person.lastName", "driver_name_mismatch"),
    createPairField("driversLicense.address", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Adresse", "person.address", "driver_address_mismatch"),
    createPairField("driversLicense.birthDate", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Geburtsdatum", "person.birthDate", "driver_birth_date_mismatch"),
    createPairField("driversLicense.licenseNumber", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Fuehrerscheinnummer", "license.number", "license_number_mismatch"),
    createPairField("driversLicense.licensedSince", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Fahrerlaubnis seit", "license.licensedSince", "driver_license_dates_mismatch"),
    createPairField("driversLicense.issueDate", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Ausgabedatum", "license.issueDate", "driver_license_dates_mismatch"),
    createPairField("driversLicense.issuingCountry", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Ausstellungsstaat", "person.countryOfOrigin", "immigration_identity_mismatch"),
    createSingleField("driversLicense.expiryDate", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Ablaufdatum", "expired_drivers_license", "date.expiry"),
    createPairField("driversLicense.eyeColor", INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE, "Augenfarbe", "appearance.eyeColor", "driver_appearance_mismatch"),

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

    createPairField("residencePermit.firstName", INSPECTION_DOCUMENT_TYPES.RESIDENCE_PERMIT, "Vorname", "person.firstName", "immigration_identity_mismatch"),
    createPairField("residencePermit.lastName", INSPECTION_DOCUMENT_TYPES.RESIDENCE_PERMIT, "Nachname", "person.lastName", "immigration_identity_mismatch"),
    createPairField("residencePermit.countryOfOrigin", INSPECTION_DOCUMENT_TYPES.RESIDENCE_PERMIT, "Herkunftsland", "person.countryOfOrigin", "immigration_identity_mismatch"),
    createPairField("residencePermit.permitNumber", INSPECTION_DOCUMENT_TYPES.RESIDENCE_PERMIT, "Aufenthaltstitel", "permit.residencePermitNumber", "permit_relation_mismatch"),
    createSingleField("residencePermit.validUntil", INSPECTION_DOCUMENT_TYPES.RESIDENCE_PERMIT, "Gueltig bis", "expired_residence_permit", "date.expiry"),

    createPairField("workPermit.firstName", INSPECTION_DOCUMENT_TYPES.WORK_PERMIT, "Vorname", "person.firstName", "immigration_identity_mismatch"),
    createPairField("workPermit.lastName", INSPECTION_DOCUMENT_TYPES.WORK_PERMIT, "Nachname", "person.lastName", "immigration_identity_mismatch"),
    createPairField("workPermit.residencePermitNumber", INSPECTION_DOCUMENT_TYPES.WORK_PERMIT, "Aufenthaltstitel", "permit.residencePermitNumber", "permit_relation_mismatch"),
    createSingleField("workPermit.validUntil", INSPECTION_DOCUMENT_TYPES.WORK_PERMIT, "Gueltig bis", "expired_work_permit", "date.expiry"),

    // Fahreraussagen sind sichtbare Belege. Sie erzeugen erst durch einen bewussten
    // Vergleich mit Dokument- oder Registerangaben eine Feststellung.
    createPairField("statement.address", null, "Genannte Adresse", "person.address", "inconsistent_driver_statement", "statement"),

    createRegistryPairField("registryPerson.firstName", "registry.person", "Vorname", "person.firstName", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryPerson.lastName", "registry.person", "Nachname", "person.lastName", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryPerson.address", "registry.person", "Adresse", "person.address", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryPerson.birthDate", "registry.person", "Geburtsdatum", "person.birthDate", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryPerson.hairColor", "registry.person", "Haarfarbe", "appearance.hairColor", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryPerson.eyeColor", "registry.person", "Augenfarbe", "appearance.eyeColor", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryPerson.distinguishingMarks", "registry.person", "Besondere Kennzeichen", "appearance.distinguishingMarks", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPhotoField(),
    createRegistryPairField("registryLicense.number", "registry.license", "Fuehrerscheinnummer", "license.number", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryLicense.licensedSince", "registry.license", "Fahrerlaubnis seit", "license.licensedSince", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryLicense.issueDate", "registry.license", "Ausgabedatum", "license.issueDate", DISCREPANCY_REGISTRY_SUBJECTS.DRIVER),
    createRegistryPairField("registryResidencePermit.number", "registry.residencePermit", "Aufenthaltstitel", "permit.residencePermitNumber", DISCREPANCY_REGISTRY_SUBJECTS.RESIDENCE_PERMIT),
    createRegistryPairField("registryResidencePermit.countryOfOrigin", "registry.residencePermit", "Herkunftsland", "person.countryOfOrigin", DISCREPANCY_REGISTRY_SUBJECTS.RESIDENCE_PERMIT),
    createRegistryPairField("registryWorkPermit.residencePermitNumber", "registry.workPermit", "Aufenthaltstitel", "permit.residencePermitNumber", DISCREPANCY_REGISTRY_SUBJECTS.WORK_PERMIT),

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

function createAppearancePhotoField() {
    return {
        id: "driversLicense.photo",
        documentType: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        surface: "driversLicense.photo",
        label: "Passfoto",
        checkType: DISCREPANCY_CHECK_TYPES.PAIR,
        comparisonGroup: null,
        comparisonGroups: [
            "appearance.photoIdentity",
            "appearance.eyeColor",
            "appearance.hairColor",
            "appearance.distinguishingMarks"
        ],
        findingId: "driver_appearance_mismatch",
        valueSource: null
    };
}

function createRegistryPhotoField() {
    return {
        id: "registryPerson.photo",
        documentType: null,
        surface: "registry.person.photo",
        label: "Lichtbild der Personenakte",
        checkType: DISCREPANCY_CHECK_TYPES.PAIR,
        comparisonGroup: null,
        comparisonGroups: [
            "appearance.photoIdentity",
            "appearance.eyeColor",
            "appearance.hairColor",
            "appearance.distinguishingMarks"
        ],
        findingId: null,
        valueSource: null,
        registrySubject: DISCREPANCY_REGISTRY_SUBJECTS.DRIVER
    };
}

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
