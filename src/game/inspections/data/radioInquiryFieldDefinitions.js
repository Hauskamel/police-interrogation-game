// ##### Radio Inquiry Record Types
// -----> Legt fest, in welchem freigegebenen Register die Zentrale einen Feldwert sucht.
export const RADIO_INQUIRY_RECORD_TYPES = {
    PERSON: "person",
    DRIVER_LICENSE: "driverLicense",
    VEHICLE: "vehicle",
    INSURANCE: "insurance"
};

// ##### Radio Inquiry Field Definitions
// -----> Nur hier registrierte Dokumentfelder koennen an die Zentrale gemeldet werden.
// ---> propertyPath bezeichnet ausschliesslich freigegebene amtliche Datensaetze.
export const RADIO_INQUIRY_FIELD_DEFINITIONS = [
    createField("driversLicense.firstName", "Vorname", RADIO_INQUIRY_RECORD_TYPES.PERSON, "firstName"),
    createField("driversLicense.lastName", "Nachname", RADIO_INQUIRY_RECORD_TYPES.PERSON, "lastName"),
    createField("driversLicense.address", "Adresse", RADIO_INQUIRY_RECORD_TYPES.PERSON, "address"),
    createField("driversLicense.birthDate", "Geburtsdatum", RADIO_INQUIRY_RECORD_TYPES.PERSON, "birthDate", { isDate: true }),
    createField("driversLicense.licenseNumber", "Führerscheinnummer", RADIO_INQUIRY_RECORD_TYPES.DRIVER_LICENSE, "licenseNumber", { invalidFindingId: "license_number_mismatch" }),
    createField("driversLicense.licensedSince", "Fahrerlaubnis seit", RADIO_INQUIRY_RECORD_TYPES.DRIVER_LICENSE, "licensedSince", { isDate: true }),
    createField("driversLicense.issueDate", "Ausgabedatum", RADIO_INQUIRY_RECORD_TYPES.DRIVER_LICENSE, "issueDate", { isDate: true }),
    createField("driversLicense.expiryDate", "Ablaufdatum", RADIO_INQUIRY_RECORD_TYPES.DRIVER_LICENSE, "expiryDate", { isDate: true, expiredFindingId: "expired_drivers_license" }),

    createField("vehicleRegistration.ownerFirstName", "Halter-Vorname", RADIO_INQUIRY_RECORD_TYPES.PERSON, "firstName"),
    createField("vehicleRegistration.ownerLastName", "Halter-Nachname", RADIO_INQUIRY_RECORD_TYPES.PERSON, "lastName"),
    createField("vehicleRegistration.ownerAddress", "Halteradresse", RADIO_INQUIRY_RECORD_TYPES.PERSON, "address"),
    createField("vehicleRegistration.plateNumber", "Kennzeichen", RADIO_INQUIRY_RECORD_TYPES.VEHICLE, "carDocumentsData.plateNumber", { invalidFindingId: "vehicle_plate_mismatch" }),
    createField("vehicleRegistration.registrationNumber", "Zulassungsnummer", RADIO_INQUIRY_RECORD_TYPES.VEHICLE, "carDocumentsData.carRegistrationNumber", { invalidFindingId: "vehicle_registration_number_mismatch" }),
    createField("vehicleRegistration.brand", "Hersteller", RADIO_INQUIRY_RECORD_TYPES.VEHICLE, "brand"),
    createField("vehicleRegistration.model", "Modell", RADIO_INQUIRY_RECORD_TYPES.VEHICLE, "model"),
    createField("vehicleRegistration.issueDate", "Ausstellungsdatum", RADIO_INQUIRY_RECORD_TYPES.VEHICLE, "carDocumentsData.formattedIssueDate", { isDate: true }),
    createField("vehicleRegistration.yearOfConstruction", "Baujahr", RADIO_INQUIRY_RECORD_TYPES.VEHICLE, "yearOfConstruction"),
    createField("vehicleRegistration.ps", "Leistung", RADIO_INQUIRY_RECORD_TYPES.VEHICLE, "ps"),
    createField("vehicleRegistration.weight", "Gewicht", RADIO_INQUIRY_RECORD_TYPES.VEHICLE, "weight"),

    createField("insurance.ownerFirstName", "Versicherungsnehmer-Vorname", RADIO_INQUIRY_RECORD_TYPES.PERSON, "firstName"),
    createField("insurance.ownerLastName", "Versicherungsnehmer-Nachname", RADIO_INQUIRY_RECORD_TYPES.PERSON, "lastName"),
    createField("insurance.policyNumber", "Policennummer", RADIO_INQUIRY_RECORD_TYPES.INSURANCE, "policyNumber", { invalidFindingId: "insurance_policy_number_mismatch" }),
    createField("insurance.plateNumber", "versichertes Kennzeichen", RADIO_INQUIRY_RECORD_TYPES.INSURANCE, "insuredPlateNumber", { invalidFindingId: "insurance_vehicle_mismatch" }),
    createField("insurance.validUntil", "Versicherung gültig bis", RADIO_INQUIRY_RECORD_TYPES.INSURANCE, "validUntil", { isDate: true, expiredFindingId: "expired_insurance" })
];

export const RADIO_INQUIRY_FIELD_DEFINITIONS_BY_ID = Object.fromEntries(
    RADIO_INQUIRY_FIELD_DEFINITIONS.map((definition) => [definition.id, definition])
);

function createField(id, label, recordType, propertyPath, options = {}) {
    return {
        id,
        label,
        recordType,
        propertyPath,
        invalidFindingId: options.invalidFindingId ?? null,
        expiredFindingId: options.expiredFindingId ?? null,
        isDate: Boolean(options.isDate)
    };
}
