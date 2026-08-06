import {
    CONTROL_SCENARIO_TYPES,
    DOCUMENT_AVAILABILITY_STATUSES,
    INSPECTION_DOCUMENT_TYPES
} from "../data";

// ##### Control Interaction Profile
// -----> Erzeugt die kontrollspezifische Dokumentverfügbarkeit und vorbereitete Fahreraussagen.
// ---> Das Profil beschreibt nur diesen Kontrollfall und verändert keine World-Truth-Daten.
export function createControlInteractionProfile({
    controlScenario,
    driverProfile,
    vehicleOwnerProfile
}) {
    const documentAvailability = createDocumentAvailability(controlScenario);
    const statementProfile = createStatementProfile({
        controlScenario,
        driverProfile,
        vehicleOwnerProfile
    });

    return {
        documentAvailability,
        statementProfile
    };
}

// Standardmäßig werden alle Dokumente unmittelbar vorgelegt. Szenarien überschreiben nur
// die eine fachlich relevante Ausnahme, damit keine zufälligen Nebenfehler entstehen.
function createDocumentAvailability(controlScenario) {
    const availability = Object.fromEntries(
        Object.values(INSPECTION_DOCUMENT_TYPES).map((documentType) => [
            documentType,
            DOCUMENT_AVAILABILITY_STATUSES.PROVIDED
        ])
    );

    const scenarioOverride = getDocumentAvailabilityOverride(controlScenario?.type);

    return scenarioOverride
        ? { ...availability, ...scenarioOverride }
        : availability;
}

function getDocumentAvailabilityOverride(scenarioType) {
    const overrides = {
        [CONTROL_SCENARIO_TYPES.MISSING_LICENSE]: {
            [INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE]:
                DOCUMENT_AVAILABILITY_STATUSES.FORGOTTEN
        },
        [CONTROL_SCENARIO_TYPES.MISSING_INSURANCE]: {
            [INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE]:
                DOCUMENT_AVAILABILITY_STATUSES.LOST
        },
        [CONTROL_SCENARIO_TYPES.INITIAL_REFUSAL]: {
            [INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION]:
                DOCUMENT_AVAILABILITY_STATUSES.INITIALLY_REFUSED
        },
        [CONTROL_SCENARIO_TYPES.FINAL_REFUSAL]: {
            [INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION]:
                DOCUMENT_AVAILABILITY_STATUSES.REFUSED
        },
        [CONTROL_SCENARIO_TYPES.WRONG_DOCUMENT]: {
            [INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE]:
                DOCUMENT_AVAILABILITY_STATUSES.WRONG_DOCUMENT
        },
        [CONTROL_SCENARIO_TYPES.DAMAGED_DOCUMENT]: {
            [INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION]:
                DOCUMENT_AVAILABILITY_STATUSES.DAMAGED
        }
    };

    return overrides[scenarioType] ?? null;
}

// Antworten werden vor Kontrollbeginn festgelegt. So bleiben wiederholte Fragen konsistent
// und ein späteres Dialog- oder KI-System kann denselben fachlichen Vertrag verwenden.
function createStatementProfile({ controlScenario, driverProfile, vehicleOwnerProfile }) {
    const driver = driverProfile.real;
    const owner = vehicleOwnerProfile.real;
    const ownerName = [owner.firstName, owner.lastName].filter(Boolean).join(" ");
    const responses = {
        full_name: {
            text: [driver.firstName, driver.lastName].filter(Boolean).join(" ")
        },
        address: {
            text: driver.address
        },
        vehicle_owner: {
            text: driver.npcId === owner.npcId
                ? "Das Fahrzeug gehört mir."
                : `Das Fahrzeug gehört ${ownerName || "einer anderen Person"}.`
        },
        travel_reason: {
            text: "Ich bin auf dem Weg zu einem privaten Termin."
        },
        address_follow_up: {
            text: "Nein, die genannte Anschrift ist korrekt. Dabei bleibe ich."
        }
    };
    const hasContradiction = controlScenario?.type
        === CONTROL_SCENARIO_TYPES.CONTRADICTORY_STATEMENT
        || controlScenario?.type === CONTROL_SCENARIO_TYPES.MULTI_ISSUE;

    if (hasContradiction) {
        responses.address = {
            text: "Ich wohne in der Lindenstraße 14.",
            findingId: "inconsistent_driver_statement"
        };
    }

    return {
        responses
    };
}
