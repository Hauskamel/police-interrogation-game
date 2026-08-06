import {
    DISCREPANCY_CHECK_TYPES,
    DISCREPANCY_FIELD_DEFINITIONS_BY_ID,
    DISCREPANCY_REGISTRY_SUBJECTS
} from "../data";

export const DISCREPANCY_RESULT_STATUSES = {
    WAITING_FOR_SECOND_FIELD: "waiting_for_second_field",
    INCOMPATIBLE_FIELDS: "incompatible_fields",
    NO_DISCREPANCY: "no_discrepancy",
    DISCREPANCY_FOUND: "discrepancy_found"
};

// ##### Discrepancy Selection Resolver
// -----> Wertet die bewusste Feldauswahl des Spielers aus, ohne der UI interne Profile zu geben.
// ---> Einzelfelder nutzen Datum oder Register; Paarfelder vergleichen zwei sichtbare Angaben.
export function resolveDiscrepancySelection({
    selectedFields = [],
    trafficEntity,
    officialRegistry,
    inspectedAt
}) {
    const [firstField, secondField] = selectedFields;
    const firstDefinition = getDefinition(firstField);

    if (!firstDefinition) {
        return createResult(DISCREPANCY_RESULT_STATUSES.NO_DISCREPANCY);
    }

    if (firstDefinition.checkType === DISCREPANCY_CHECK_TYPES.SINGLE) {
        return resolveSingleField({
            field: firstField,
            definition: firstDefinition,
            trafficEntity,
            officialRegistry,
            inspectedAt
        });
    }

    if (!secondField) {
        return createResult(DISCREPANCY_RESULT_STATUSES.WAITING_FOR_SECOND_FIELD);
    }

    const secondDefinition = getDefinition(secondField);
    if (!fieldsCanBeCompared(firstDefinition, secondDefinition)) {
        return createResult(DISCREPANCY_RESULT_STATUSES.INCOMPATIBLE_FIELDS);
    }

    if (!registryRecordBelongsToTrafficEntity({
        selectedFields,
        trafficEntity
    })) {
        return createResult(
            DISCREPANCY_RESULT_STATUSES.NO_DISCREPANCY,
            null,
            "wrong_registry_record"
        );
    }

    if (normalizeValue(firstField.value) === normalizeValue(secondField.value)) {
        return createResult(DISCREPANCY_RESULT_STATUSES.NO_DISCREPANCY);
    }

    const findingId = resolvePairFindingId({
        selectedFields,
        trafficEntity,
        officialRegistry
    });

    return findingId
        ? createResult(DISCREPANCY_RESULT_STATUSES.DISCREPANCY_FOUND, findingId)
        : createResult(DISCREPANCY_RESULT_STATUSES.NO_DISCREPANCY);
}

export function getDiscrepancyFieldDefinition(fieldId) {
    return DISCREPANCY_FIELD_DEFINITIONS_BY_ID[fieldId] ?? null;
}

function resolveSingleField({
    field,
    definition,
    trafficEntity,
    officialRegistry,
    inspectedAt
}) {
    const expectedValue = getExpectedValue({
        definition,
        trafficEntity,
        officialRegistry
    });
    const discrepancyExists = definition.valueSource === "date.expiry"
        ? isExpired(field.value, inspectedAt)
        : expectedValue !== undefined
            && normalizeValue(field.value) !== normalizeValue(expectedValue);

    return discrepancyExists
        ? createResult(DISCREPANCY_RESULT_STATUSES.DISCREPANCY_FOUND, definition.findingId)
        : createResult(DISCREPANCY_RESULT_STATUSES.NO_DISCREPANCY);
}

function resolvePairFindingId({ selectedFields, trafficEntity, officialRegistry }) {
    for (const field of selectedFields) {
        const definition = getDefinition(field);
        if (!definition?.findingId) continue;

        const expectedValue = getExpectedPairValue({
            definition,
            trafficEntity,
            officialRegistry
        });

        if (
            expectedValue !== undefined
            && normalizeValue(field.value) !== normalizeValue(expectedValue)
        ) {
            return definition.findingId;
        }
    }

    return null;
}

function getExpectedValue({ definition, trafficEntity, officialRegistry }) {
    const sourceReaders = {
        "driver.birthDate": () => officialRegistry.peopleById?.[trafficEntity.npcId]?.birthDate,
        "driver.licenseNumber": () => trafficEntity.driverProfile?.real?.driversLicense?.licenseNumber,
        "vehicle.registrationNumber": () => officialRegistry.vehiclesById?.[trafficEntity.vehicleId]?.carDocumentsData?.carRegistrationNumber,
        "vehicle.brand": () => officialRegistry.vehiclesById?.[trafficEntity.vehicleId]?.brand,
        "vehicle.model": () => officialRegistry.vehiclesById?.[trafficEntity.vehicleId]?.model,
        "insurance.policyNumber": () => trafficEntity.insuranceProfile?.real?.policyNumber
    };

    return sourceReaders[definition.valueSource]?.();
}

function getExpectedPairValue({ definition, trafficEntity, officialRegistry }) {
    if (definition.id.startsWith("driversLicense.")) {
        if (definition.comparisonGroup.startsWith("person.")) {
            const person = officialRegistry.peopleById?.[trafficEntity.npcId];
            const property = definition.comparisonGroup.split(".")[1];
            return person?.[property];
        }

        const license = Object.values(
            officialRegistry.driverLicensesByNumber ?? {}
        ).find((record) => record.npcId === trafficEntity.npcId);
        const property = definition.comparisonGroup.split(".")[1];
        return license?.[property];
    }

    if (definition.id.startsWith("vehicleRegistration.")) {
        const vehicle = officialRegistry.vehiclesById?.[trafficEntity.vehicleId];
        const property = definition.comparisonGroup.split(".")[1];

        if (property === "plateNumber") {
            return vehicle?.carDocumentsData?.plateNumber;
        }

        if (property === "registrationNumber") {
            return vehicle?.carDocumentsData?.carRegistrationNumber;
        }

        if (property === "issueDate") {
            return vehicle?.carDocumentsData?.formattedIssueDate;
        }

        return vehicle?.[property];
    }

    if (definition.id.startsWith("insurance.")) {
        const insurance = trafficEntity.insuranceProfile?.real;
        const property = definition.comparisonGroup.split(".")[1];
        return property === "plateNumber"
            ? insurance?.insuredPlateNumber
            : insurance?.[property];
    }

    return undefined;
}

function fieldsCanBeCompared(firstDefinition, secondDefinition) {
    return Boolean(
        secondDefinition
        && firstDefinition.id !== secondDefinition.id
        && firstDefinition.surface !== secondDefinition.surface
        && firstDefinition.comparisonGroup === secondDefinition.comparisonGroup
    );
}

// Ein Laptopvergleich ist nur fachlich gueltig, wenn der geoeffnete Record zur Kontrolle gehoert.
// Dadurch bestaetigt das blinde Oeffnen fremder Akten keine echte Dokumentfaelschung.
function registryRecordBelongsToTrafficEntity({ selectedFields, trafficEntity }) {
    const registryField = selectedFields.find((field) => {
        return Boolean(getDefinition(field)?.registrySubject);
    });
    if (!registryField) return true;

    const definition = getDefinition(registryField);
    const expectedRecordIds = {
        [DISCREPANCY_REGISTRY_SUBJECTS.DRIVER]: trafficEntity.npcId,
        [DISCREPANCY_REGISTRY_SUBJECTS.VEHICLE]: trafficEntity.vehicleId,
        [DISCREPANCY_REGISTRY_SUBJECTS.VEHICLE_OWNER]: trafficEntity.vehicleOwnerProfile?.real?.npcId,
        [DISCREPANCY_REGISTRY_SUBJECTS.INSURANCE]: trafficEntity.insuranceProfile?.real?.policyId
    };

    return Boolean(
        registryField.recordId
        && registryField.recordId === expectedRecordIds[definition.registrySubject]
    );
}

function getDefinition(field) {
    return field
        ? DISCREPANCY_FIELD_DEFINITIONS_BY_ID[field.fieldId]
        : null;
}

function isExpired(value, inspectedAt) {
    if (!value || !inspectedAt) return false;
    return String(value).slice(0, 10) < String(inspectedAt).slice(0, 10);
}

function normalizeValue(value) {
    return String(value ?? "").trim().toLocaleLowerCase("de-DE");
}

function createResult(status, findingId = null, reason = null) {
    return reason
        ? { status, findingId, reason }
        : { status, findingId };
}
