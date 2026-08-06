import { DOCUMENT_FORGERY_TARGETS } from "@game/documents/data";
import { CONTROL_SCENARIO_TYPES } from "@game/inspections/data";

import { TRAFFIC_ENTITY_TYPES } from "../data";

const GENERATED_IDENTITY_WEIGHTS = [
    { type: TRAFFIC_ENTITY_TYPES.CIVILIAN, weight: 70 },
    { type: TRAFFIC_ENTITY_TYPES.UNKNOWN_OFFENDER, weight: 30 }
];

const VARIED_IDENTITY_WEIGHTS = [
    { type: TRAFFIC_ENTITY_TYPES.CIVILIAN, weight: 55 },
    { type: TRAFFIC_ENTITY_TYPES.UNKNOWN_OFFENDER, weight: 30 },
    { type: TRAFFIC_ENTITY_TYPES.KNOWN_OFFENDER, weight: 15 }
];

// ##### Control Scenario Generator Options
// -----> Uebersetzt einen spielbaren Kontrollfall in vorhandene Generator-Optionen.
// ---> Die Generatoren bleiben damit wiederverwendbar und kennen keine Pacing-Regeln.
export function getControlScenarioGenerationOptions(controlScenario) {
    const type = controlScenario?.type;

    if (!type) return {};

    const baseOptions = {
        forcedHasForgery: false,
        forcedLicenseExpired: false,
        forcedInsuranceExpired: false
    };

    if (type === CONTROL_SCENARIO_TYPES.EXPIRED_LICENSE) {
        return {
            ...baseOptions,
            forcedLicenseExpired: true
        };
    }

    if (type === CONTROL_SCENARIO_TYPES.EXPIRED_INSURANCE) {
        return {
            ...baseOptions,
            forcedInsuranceExpired: true
        };
    }

    if (type === CONTROL_SCENARIO_TYPES.MULTI_ISSUE) {
        return {
            ...baseOptions,
            forcedHasForgery: true,
            forcedForgeryTarget: DOCUMENT_FORGERY_TARGETS.VEHICLE,
            forcedLicenseExpired: true
        };
    }

    const forgeryTargetByScenario = {
        [CONTROL_SCENARIO_TYPES.FORGED_IDENTITY]: DOCUMENT_FORGERY_TARGETS.DRIVER,
        [CONTROL_SCENARIO_TYPES.FORGED_VEHICLE]: DOCUMENT_FORGERY_TARGETS.VEHICLE,
        [CONTROL_SCENARIO_TYPES.FORGED_INSURANCE]: DOCUMENT_FORGERY_TARGETS.INSURANCE
    };
    const forcedForgeryTarget = forgeryTargetByScenario[type];

    if (forcedForgeryTarget) {
        return {
            ...baseOptions,
            forcedHasForgery: true,
            forcedForgeryTarget,
            forcedDriverIsRegisteredOwner: type
                === CONTROL_SCENARIO_TYPES.FORGED_IDENTITY
                ? true
                : undefined
        };
    }

    return baseOptions;
}

// Saubere und Fuehrerschein-Ablauffaelle nutzen neue Identitaeten, deren Daten gezielt erzeugt werden koennen.
export function getTrafficTypeWeightsForControlScenario(controlScenario) {
    if (controlScenario?.type === CONTROL_SCENARIO_TYPES.HIDDEN_OFFENDER) {
        return [
            { type: TRAFFIC_ENTITY_TYPES.UNKNOWN_OFFENDER, weight: 100 }
        ];
    }
    if (
        controlScenario?.type === CONTROL_SCENARIO_TYPES.CLEAN
        || controlScenario?.type === CONTROL_SCENARIO_TYPES.EXPIRED_LICENSE
    ) {
        return GENERATED_IDENTITY_WEIGHTS;
    }

    return VARIED_IDENTITY_WEIGHTS;
}
