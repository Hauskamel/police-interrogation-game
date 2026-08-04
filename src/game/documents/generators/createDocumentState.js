import {
    DOCUMENT_INTEGRITY_TYPES,
    INSURANCE_DOCUMENT_FORGERY_TYPES
} from "../data";
import { pickNpcDocumentForgeryType, pickVehicleDocumentForgeryType } from "../utils";

// ##### Forgery Chance By Traffic Type
// -----> Definiert, wie wahrscheinlich bewusste Dokumentmanipulationen je Spawn-Fall sind.
// ---> Der Wert bleibt bewusst niedrig bei Zivilisten und steigt bei unbekannten/gesuchten Tätern.
const forgeryChanceByTrafficType = {
    civilian: 0.06,
    unknownOffender: 0.38,
    knownOffender: 0.42,
    wantedOffender: 0.68
};

// ##### Document State Generator
// -----> Erstellt den Wahrheitszustand der Dokumente einer TrafficEntity.
// ---> Hier wird entschieden, ob NPC- oder Fahrzeugdokumente bewusst manipuliert sind.
export function createDocumentState({
    trafficType,
    driverProfile,
    vehicleProfile,
    insuranceProfile,
    forcedHasForgery
} = {}) {
    const baseState = createValidDocumentState();
    const forgeryChance = forgeryChanceByTrafficType[trafficType] ?? 0;

    // Devtools können den Dokumentzustand bewusst erzwingen, ohne die normalen Spawn-Wahrscheinlichkeiten zu ändern.
    if (forcedHasForgery === false) return baseState;
    if (forcedHasForgery === true) {
        return applyForgeryTarget(baseState, {
            canForgeNpcDocument: Boolean(driverProfile?.real?.driversLicense),
            canForgeVehicleDocument: Boolean(vehicleProfile?.real?.carDocumentsData),
            canForgeInsuranceDocument: Boolean(insuranceProfile?.real)
        });
    }

    if (Math.random() > forgeryChance) return baseState;

    return applyForgeryTarget(baseState, {
        canForgeNpcDocument: Boolean(driverProfile?.real?.driversLicense),
        canForgeVehicleDocument: Boolean(vehicleProfile?.real?.carDocumentsData),
        canForgeInsuranceDocument: Boolean(insuranceProfile?.real)
    });
}

// ##### Valid Document State Factory
// -----> Erstellt den Standardfall: alle Dokumente sind unverändert und stimmen zur Wahrheit.
// ---> Dieser Zustand ist auch wichtig, damit UI und Prüflogik immer stabile Keys vorfinden.
function createValidDocumentState() {
    return {
        hasForgery: false,
        npcDocuments: {
            driversLicense: {
                integrity: DOCUMENT_INTEGRITY_TYPES.VALID,
                forgeryType: null,
                affectedFields: [],
                detectableBy: []
            }
        },
        vehicleDocuments: {
            registration: {
                integrity: DOCUMENT_INTEGRITY_TYPES.VALID,
                forgeryType: null,
                affectedFields: [],
                detectableBy: []
            },
            insurance: {
                integrity: DOCUMENT_INTEGRITY_TYPES.VALID,
                forgeryType: null,
                affectedFields: [],
                detectableBy: []
            }
        }
    };
}

// ##### Forgery Target Applier
// -----> Entscheidet, ob die Manipulation Fuehrerschein, Fahrzeugpapiere oder Versicherung betrifft.
// ---> Diese Information steuert danach, welche Felder in presented verändert werden.
function applyForgeryTarget(documentState, {
    canForgeNpcDocument,
    canForgeVehicleDocument,
    canForgeInsuranceDocument
}) {
    const targetPool = [
        canForgeNpcDocument ? "npc" : null,
        canForgeVehicleDocument ? "vehicle" : null,
        canForgeInsuranceDocument ? "insurance" : null
    ].filter(Boolean);

    if (targetPool.length === 0) return documentState;

    const target = targetPool[Math.floor(Math.random() * targetPool.length)];

    return {
        ...documentState,
        hasForgery: true,
        npcDocuments: {
            driversLicense: target === "npc"
                ? createForgedNpcDriversLicenseState()
                : documentState.npcDocuments.driversLicense
        },
        vehicleDocuments: {
            registration: target === "vehicle"
                ? createForgedVehicleRegistrationState()
                : documentState.vehicleDocuments.registration,
            insurance: target === "insurance"
                ? createForgedInsuranceState()
                : documentState.vehicleDocuments.insurance
        }
    };
}

// ##### Forged Insurance State
// -----> Beschreibt Manipulationen, die ueber die Versicherungsnummernsuche pruefbar sind.
function createForgedInsuranceState() {
    const forgeryType = Math.random() < 0.5
        ? INSURANCE_DOCUMENT_FORGERY_TYPES.WRONG_POLICY_NUMBER
        : INSURANCE_DOCUMENT_FORGERY_TYPES.WRONG_INSURED_PLATE;
    const metadataByForgeryType = {
        [INSURANCE_DOCUMENT_FORGERY_TYPES.WRONG_POLICY_NUMBER]: {
            affectedFields: ["insurance.policyNumber"],
            detectableBy: ["insurance_registry_lookup"]
        },
        [INSURANCE_DOCUMENT_FORGERY_TYPES.WRONG_INSURED_PLATE]: {
            affectedFields: ["insurance.insuredPlateNumber"],
            detectableBy: ["insurance_registry_lookup", "compare_plate_with_vehicle"]
        }
    };

    return {
        integrity: DOCUMENT_INTEGRITY_TYPES.FORGED,
        forgeryType,
        ...metadataByForgeryType[forgeryType]
    };
}

// ##### Forged Drivers License State
// -----> Beschreibt eine bewusste Manipulation am Führerschein.
// ---> Die Feldlisten sagen später, welche Prüfvergleiche den Fehler aufdecken können.
function createForgedNpcDriversLicenseState() {
    const forgeryType = pickNpcDocumentForgeryType();

    const metadataByForgeryType = {
        wrong_address: {
            affectedFields: ["address"],
            detectableBy: ["compare_with_database", "ask_address_question"]
        },
        wrong_birth_date: {
            affectedFields: ["birthDate", "birthYear", "age"],
            detectableBy: ["compare_with_database", "age_photo_check"]
        },
        wrong_license_number: {
            affectedFields: ["driversLicense.licenseNumber"],
            detectableBy: ["license_number_lookup"]
        },
        wrong_name: {
            affectedFields: ["firstName", "lastName"],
            detectableBy: ["compare_with_database", "question_identity"]
        }
    };

    return {
        integrity: DOCUMENT_INTEGRITY_TYPES.FORGED,
        forgeryType,
        ...metadataByForgeryType[forgeryType]
    };
}

// ##### Forged Vehicle Registration State
// -----> Beschreibt eine bewusste Manipulation am Fahrzeugschein.
// ---> Fahrzeugfälschungen sind besonders nützlich für Kennzeichen- und Halterprüfungen.
function createForgedVehicleRegistrationState() {
    const forgeryType = pickVehicleDocumentForgeryType();

    const metadataByForgeryType = {
        plate_mismatch: {
            affectedFields: ["carDocumentsData.plateNumber"],
            detectableBy: ["compare_plate_with_vehicle", "vehicle_database_lookup"]
        },
        wrong_registration_number: {
            affectedFields: ["carDocumentsData.carRegistrationNumber"],
            detectableBy: ["registration_number_lookup"]
        },
        wrong_vehicle_model: {
            affectedFields: ["brand", "model"],
            detectableBy: ["compare_document_with_vehicle"]
        }
    };

    return {
        integrity: DOCUMENT_INTEGRITY_TYPES.FORGED,
        forgeryType,
        ...metadataByForgeryType[forgeryType]
    };
}
