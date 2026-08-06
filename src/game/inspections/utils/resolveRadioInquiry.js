import { formatDateForDisplay } from "@game/shared";

import {
    RADIO_INQUIRY_FIELD_DEFINITIONS_BY_ID,
    RADIO_INQUIRY_RECORD_TYPES
} from "../data";

// ##### Radio Inquiry Resolver
// -----> Beantwortet einen markierten Dokumentwert nur aus Polizei- und Registerdaten.
// ---> World Truth und presented-Gegenprofile werden dieser Funktion nicht uebergeben.
export function resolveRadioInquiry({
    field,
    officialRegistry,
    criminalDatabase,
    inspectedAt
}) {
    const definition = RADIO_INQUIRY_FIELD_DEFINITIONS_BY_ID[field?.fieldId];
    if (!definition || !hasValue(field?.value)) {
        return createResponse({
            playerText: "Zentrale, die zu prüfende Angabe ist unvollständig.",
            dispatchText: "Verstanden. Ohne lesbaren Wert ist keine Abfrage möglich."
        });
    }

    const records = getRecords(definition.recordType, officialRegistry);
    const matches = records.filter((record) => {
        return normalizeValue(readPath(record, definition.propertyPath))
            === normalizeValue(field.value);
    });
    const spokenValue = definition.isDate
        ? formatDateForDisplay(field.value)
        : String(field.value);
    const playerText = `Zentrale, bitte ${definition.label} prüfen: ${spokenValue}.`;

    if (matches.length === 0) {
        return createResponse({
            playerText,
            dispatchText: `Negativ. Für ${definition.label} „${spokenValue}“ liegt kein passender amtlicher Datensatz vor.`,
            findingId: definition.invalidFindingId
        });
    }

    const expiredFindingId = definition.expiredFindingId
        && isBeforeInspection(field.value, inspectedAt)
        ? definition.expiredFindingId
        : null;

    return createResponse({
        playerText,
        dispatchText: createPositiveResponse({
            definition,
            matches,
            officialRegistry,
            criminalDatabase
        }),
        findingId: expiredFindingId
    });
}

function getRecords(recordType, officialRegistry) {
    const recordsByType = {
        [RADIO_INQUIRY_RECORD_TYPES.PERSON]: officialRegistry.peopleById,
        [RADIO_INQUIRY_RECORD_TYPES.DRIVER_LICENSE]: officialRegistry.driverLicensesByNumber,
        [RADIO_INQUIRY_RECORD_TYPES.VEHICLE]: officialRegistry.vehiclesById,
        [RADIO_INQUIRY_RECORD_TYPES.INSURANCE]: officialRegistry.insurancePoliciesById
    };

    return Object.values(recordsByType[recordType] ?? {});
}

function createPositiveResponse({
    definition,
    matches,
    officialRegistry,
    criminalDatabase
}) {
    if (matches.length > 1) {
        return `Positiv, aber nicht eindeutig. Die Angabe ergibt ${matches.length} amtliche Treffer. Für eine eindeutige Zuordnung wird eine weitere Kennung benötigt.`;
    }

    const [record] = matches;
    if (definition.recordType === RADIO_INQUIRY_RECORD_TYPES.PERSON) {
        return describePerson(record, criminalDatabase);
    }

    if (definition.recordType === RADIO_INQUIRY_RECORD_TYPES.DRIVER_LICENSE) {
        return describeDriverLicense(record, officialRegistry, criminalDatabase);
    }

    if (definition.recordType === RADIO_INQUIRY_RECORD_TYPES.VEHICLE) {
        return describeVehicle(record, officialRegistry);
    }

    return describeInsurance(record, officialRegistry);
}

function describePerson(person, criminalDatabase) {
    const policeKnown = Boolean(criminalDatabase.npcsById?.[person.npcId]);
    const policeStatus = policeKnown
        ? "Für die Person besteht eine Polizeiakte."
        : "Keine Personenakte im Polizeibestand.";

    return `Positiv. Amtlicher Treffer: ${person.firstName} ${person.lastName}, geboren am ${formatDateForDisplay(person.birthDate)}, Anschrift ${person.address}. ${policeStatus}`;
}

function describeDriverLicense(license, officialRegistry, criminalDatabase) {
    const person = officialRegistry.peopleById?.[license.npcId];
    if (!person) {
        return `Positiv. Führerschein ${license.licenseNumber} ist registriert; die zugehörige Person ist nicht auflösbar.`;
    }

    const policeKnown = Boolean(criminalDatabase.npcsById?.[person.npcId]);
    return `Positiv. Führerschein ${license.licenseNumber} ist registriert auf ${person.firstName} ${person.lastName}, gültig bis ${formatDateForDisplay(license.expiryDate)}. ${policeKnown ? "Person ist polizeibekannt." : "Keine Personenakte im Polizeibestand."}`;
}

function describeVehicle(vehicle, officialRegistry) {
    const owner = officialRegistry.peopleById?.[vehicle.registeredOwnerNpcId];
    const ownerText = owner
        ? `${owner.firstName} ${owner.lastName}`
        : "Halter nicht auflösbar";

    return `Positiv. Fahrzeug ${vehicle.brand} ${vehicle.model}, Kennzeichen ${vehicle.carDocumentsData?.plateNumber}, Zulassungsnummer ${vehicle.carDocumentsData?.carRegistrationNumber}, eingetragen auf ${ownerText}.`;
}

function describeInsurance(policy, officialRegistry) {
    const holder = officialRegistry.peopleById?.[policy.policyHolderNpcId];
    const vehicle = officialRegistry.vehiclesById?.[policy.vehicleId];
    const holderText = holder
        ? `${holder.firstName} ${holder.lastName}`
        : "Versicherungsnehmer nicht auflösbar";
    const vehicleText = vehicle
        ? `${vehicle.brand} ${vehicle.model}`
        : "Fahrzeug nicht auflösbar";

    return `Positiv. Police ${policy.policyNumber} ist registriert auf ${holderText} für ${vehicleText}, Kennzeichen ${policy.insuredPlateNumber}, gültig bis ${formatDateForDisplay(policy.validUntil)}.`;
}

function readPath(record, propertyPath) {
    return propertyPath.split(".").reduce(
        (value, property) => value?.[property],
        record
    );
}

function isBeforeInspection(value, inspectedAt) {
    if (!value || !inspectedAt) return false;
    return String(value).slice(0, 10) < String(inspectedAt).slice(0, 10);
}

function normalizeValue(value) {
    return String(value ?? "")
        .trim()
        .toLocaleLowerCase("de-DE")
        .replaceAll(" ", "");
}

function hasValue(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
}

function createResponse({ playerText, dispatchText, findingId = null }) {
    return { playerText, dispatchText, findingId };
}
