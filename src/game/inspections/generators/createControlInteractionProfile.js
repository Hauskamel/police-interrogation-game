import {
    CONTROL_SCENARIO_TYPES,
    DOCUMENT_AVAILABILITY_STATUSES,
    INSPECTION_DOCUMENT_TYPES
} from "../data";
import { HOME_COUNTRY, TRAVEL_PURPOSES } from "@game/npcs/data";

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
    const migrationProfile = driver.migrationProfile;
    const owner = vehicleOwnerProfile.real;
    const ownerName = [owner.firstName, owner.lastName].filter(Boolean).join(" ");
    const responses = {
        full_name: {
            text: [driver.firstName, driver.lastName].filter(Boolean).join(" ")
        },
        address: {
            text: driver.address,
            value: driver.address,
            fieldId: "statement.address"
        },
        vehicle_owner: {
            text: driver.npcId === owner.npcId
                ? "Das Fahrzeug gehört mir."
                : `Das Fahrzeug gehört ${ownerName || "einer anderen Person"}.`
        },
        travel_reason: {
            text: createTravelReasonResponse(migrationProfile)
        },
        address_follow_up: {
            text: "Nein, die genannte Anschrift ist korrekt. Dabei bleibe ich."
        }
    };

    if (driver.countryOfOrigin !== HOME_COUNTRY) {
        responses.foreign_stay = {
            text: createForeignStayResponse(migrationProfile)
        };

        if (migrationProfile.requiresResidencePermit) {
            responses.residence_details = {
                text: `Ich wohne während meines Aufenthalts in ${migrationProfile.localAddress}.`
            };
        }

        if (migrationProfile.requiresWorkPermit) {
            responses.employment_details = {
                text: `Ich arbeite als ${migrationProfile.employment.occupation} bei ${migrationProfile.employment.employer}.`
            };
        }
    }
    const hasContradiction = controlScenario?.type
        === CONTROL_SCENARIO_TYPES.CONTRADICTORY_STATEMENT
        || controlScenario?.type === CONTROL_SCENARIO_TYPES.MULTI_ISSUE;

    if (hasContradiction) {
        responses.address = {
            text: "Ich wohne in der Lindenstraße 14.",
            value: "Lindenstraße 14",
            fieldId: "statement.address"
        };
    }

    return {
        responses
    };
}

function createTravelReasonResponse(migrationProfile) {
    const responseByPurpose = {
        [TRAVEL_PURPOSES.TRANSIT]: "Ich bin nur auf der Durchreise.",
        [TRAVEL_PURPOSES.VISIT]: "Ich besuche Freunde in Westmark.",
        [TRAVEL_PURPOSES.LONG_STAY]: "Ich bleibe für einen längeren privaten Aufenthalt in Westmark.",
        [TRAVEL_PURPOSES.WORK]: "Ich fahre zu meiner Arbeitsstelle in Westmark."
    };

    return responseByPurpose[migrationProfile?.travelPurpose]
        ?? "Ich bin auf dem Weg zu einem privaten Termin.";
}

function createForeignStayResponse(migrationProfile) {
    const country = migrationProfile.countryOfOrigin;
    const duration = formatStayDuration(migrationProfile.plannedStayDays);

    if (migrationProfile.travelPurpose === TRAVEL_PURPOSES.TRANSIT) {
        return `Ich komme aus ${country} und bin nur auf der Durchreise. Ich bleibe ${duration}.`;
    }

    if (migrationProfile.travelPurpose === TRAVEL_PURPOSES.WORK) {
        return `Ich komme aus ${country} und werde für ${duration} in Westmark arbeiten.`;
    }

    return `Ich komme aus ${country} und bleibe für ${duration} in Westmark.`;
}

function formatStayDuration(days) {
    if (days === 1) return "einen Tag";
    if (days < 14) return `${days} Tage`;
    if (days < 60) return `${Math.round(days / 7)} Wochen`;
    if (days < 548) return `${Math.round(days / 30)} Monate`;
    return `${Math.round(days / 365)} Jahre`;
}
