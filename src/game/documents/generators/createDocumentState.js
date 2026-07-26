import { DOCUMENT_INTEGRITY_TYPES } from "../data";
import { pickNpcDocumentForgeryType, pickVehicleDocumentForgeryType } from "../utils";

// ##### Forgery Chance By Traffic Type
// -----> Definiert, wie wahrscheinlich bewusste Dokumentmanipulationen je Spawn-Fall sind.
// ---> Der Wert bleibt bewusst niedrig bei Zivilisten und steigt bei unbekannten/gesuchten Tätern.
const forgeryChanceByTrafficType = {
    civilian: 0.06,
    unknownOffender: 0.38,
    knownWanted: 0.68
};

// ##### Document State Generator
// -----> Erstellt den Wahrheitszustand der Dokumente einer TrafficEntity.
// ---> Hier wird entschieden, ob NPC- oder Fahrzeugdokumente bewusst manipuliert sind.
export function createDocumentState({
    trafficType,
    driverProfile,
    vehicleProfile
} = {}) {
    const baseState = createValidDocumentState();
    const forgeryChance = forgeryChanceByTrafficType[trafficType] ?? 0;

    if (Math.random() > forgeryChance) return baseState;

    return applyForgeryTarget(baseState, {
        canForgeNpcDocument: Boolean(driverProfile?.real?.driversLicense),
        canForgeVehicleDocument: Boolean(vehicleProfile?.real?.carDocumentsData)
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
            }
        }
    };
}

// ##### Forgery Target Applier
// -----> Entscheidet, ob die Manipulation Personenpapiere, Fahrzeugpapiere oder beides betrifft.
// ---> Diese Information steuert danach, welche Felder in presented verändert werden.
function applyForgeryTarget(documentState, {
    canForgeNpcDocument,
    canForgeVehicleDocument
}) {
    const targetPool = [
        canForgeNpcDocument ? "npc" : null,
        canForgeVehicleDocument ? "vehicle" : null,
        canForgeNpcDocument && canForgeVehicleDocument ? "both" : null
    ].filter(Boolean);

    if (targetPool.length === 0) return documentState;

    const target = targetPool[Math.floor(Math.random() * targetPool.length)];

    return {
        ...documentState,
        hasForgery: true,
        npcDocuments: {
            driversLicense: target === "npc" || target === "both"
                ? createForgedNpcDriversLicenseState()
                : documentState.npcDocuments.driversLicense
        },
        vehicleDocuments: {
            registration: target === "vehicle" || target === "both"
                ? createForgedVehicleRegistrationState()
                : documentState.vehicleDocuments.registration
        }
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
