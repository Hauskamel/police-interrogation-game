// ##### Control Scenario Categories
// -----> Beschreiben, welche spielbare Aufgabe eine Kontrolle fuer den Spieler enthaelt.
// ---> Die Kategorie ist bewusst unabhaengig davon, wer der NPC in der Welt wirklich ist.
export const CONTROL_SCENARIO_CATEGORIES = {
    CLEAN: "clean",
    EXPIRED_DOCUMENT: "expired_document",
    FORGED_DOCUMENT: "forged_document",
    DOCUMENT_AVAILABILITY: "document_availability",
    CONTRADICTORY_STATEMENT: "contradictory_statement",
    HIDDEN_OFFENDER: "hidden_offender",
    MULTI_ISSUE: "multi_issue",
    WANTED_PERSON: "wanted_person"
};

// ##### Control Scenario Types
// -----> Konkrete Fallrezepte fuer den aktuellen kontrollbasierten Gameplay-Loop.
export const CONTROL_SCENARIO_TYPES = {
    CLEAN: "clean",
    EXPIRED_LICENSE: "expired_license",
    EXPIRED_INSURANCE: "expired_insurance",
    FORGED_IDENTITY: "forged_identity",
    FORGED_VEHICLE: "forged_vehicle",
    FORGED_INSURANCE: "forged_insurance",
    MISSING_LICENSE: "missing_license",
    MISSING_INSURANCE: "missing_insurance",
    INITIAL_REFUSAL: "initial_refusal",
    DAMAGED_DOCUMENT: "damaged_document",
    CONTRADICTORY_STATEMENT: "contradictory_statement",
    HIDDEN_OFFENDER: "hidden_offender",
    MULTI_ISSUE: "multi_issue",
    WANTED_PERSON: "wanted_person"
};

// ##### Default Control Scenario Distribution
// -----> Haeufige Falschungen halten Kontrollen interessant, waehrend saubere Faelle
// -----> verhindern, dass der Spieler bei jedem NPC automatisch einen Fehler erwartet.
export const DEFAULT_CONTROL_SCENARIOS = [
    {
        type: CONTROL_SCENARIO_TYPES.CLEAN,
        category: CONTROL_SCENARIO_CATEGORIES.CLEAN,
        weight: 25,
        complexityLevel: 1,
        deceptionRisk: 0,
        focusAreas: ["routine_documents"]
    },
    {
        type: CONTROL_SCENARIO_TYPES.EXPIRED_LICENSE,
        category: CONTROL_SCENARIO_CATEGORIES.EXPIRED_DOCUMENT,
        weight: 10,
        complexityLevel: 1,
        deceptionRisk: 0.05,
        focusAreas: ["routine_documents", "expired_dates"]
    },
    {
        type: CONTROL_SCENARIO_TYPES.EXPIRED_INSURANCE,
        category: CONTROL_SCENARIO_CATEGORIES.EXPIRED_DOCUMENT,
        weight: 7,
        complexityLevel: 1,
        deceptionRisk: 0.05,
        focusAreas: ["routine_documents", "expired_dates"]
    },
    {
        type: CONTROL_SCENARIO_TYPES.FORGED_IDENTITY,
        category: CONTROL_SCENARIO_CATEGORIES.FORGED_DOCUMENT,
        weight: 14,
        complexityLevel: 2,
        deceptionRisk: 0.6,
        focusAreas: ["identity_check", "document_consistency"]
    },
    {
        type: CONTROL_SCENARIO_TYPES.FORGED_VEHICLE,
        category: CONTROL_SCENARIO_CATEGORIES.FORGED_DOCUMENT,
        weight: 11,
        complexityLevel: 2,
        deceptionRisk: 0.5,
        focusAreas: ["vehicle_documents", "document_consistency"]
    },
    {
        type: CONTROL_SCENARIO_TYPES.MISSING_LICENSE,
        category: CONTROL_SCENARIO_CATEGORIES.DOCUMENT_AVAILABILITY,
        weight: 7,
        complexityLevel: 1,
        deceptionRisk: 0.05,
        focusAreas: ["document_availability"]
    },
    {
        type: CONTROL_SCENARIO_TYPES.MISSING_INSURANCE,
        category: CONTROL_SCENARIO_CATEGORIES.DOCUMENT_AVAILABILITY,
        weight: 6,
        complexityLevel: 1,
        deceptionRisk: 0.05,
        focusAreas: ["document_availability"]
    },
    {
        type: CONTROL_SCENARIO_TYPES.INITIAL_REFUSAL,
        category: CONTROL_SCENARIO_CATEGORIES.DOCUMENT_AVAILABILITY,
        weight: 5,
        complexityLevel: 1,
        deceptionRisk: 0.1,
        focusAreas: ["driver_cooperation"]
    },
    {
        type: CONTROL_SCENARIO_TYPES.DAMAGED_DOCUMENT,
        category: CONTROL_SCENARIO_CATEGORIES.DOCUMENT_AVAILABILITY,
        weight: 5,
        complexityLevel: 2,
        deceptionRisk: 0.25,
        focusAreas: ["document_condition", "document_consistency"]
    },
    {
        type: CONTROL_SCENARIO_TYPES.CONTRADICTORY_STATEMENT,
        category: CONTROL_SCENARIO_CATEGORIES.CONTRADICTORY_STATEMENT,
        weight: 7,
        complexityLevel: 2,
        deceptionRisk: 0.45,
        focusAreas: ["driver_interview", "identity_check"]
    },
    {
        type: CONTROL_SCENARIO_TYPES.HIDDEN_OFFENDER,
        category: CONTROL_SCENARIO_CATEGORIES.HIDDEN_OFFENDER,
        weight: 5,
        complexityLevel: 2,
        deceptionRisk: 0.35,
        focusAreas: ["routine_documents", "driver_interview"]
    },
    {
        type: CONTROL_SCENARIO_TYPES.MULTI_ISSUE,
        category: CONTROL_SCENARIO_CATEGORIES.MULTI_ISSUE,
        weight: 4,
        complexityLevel: 3,
        deceptionRisk: 0.75,
        focusAreas: ["document_consistency", "expired_dates", "driver_interview"]
    },
    {
        type: CONTROL_SCENARIO_TYPES.FORGED_INSURANCE,
        category: CONTROL_SCENARIO_CATEGORIES.FORGED_DOCUMENT,
        weight: 10,
        complexityLevel: 2,
        deceptionRisk: 0.5,
        focusAreas: ["vehicle_documents", "document_consistency"]
    },
    {
        type: CONTROL_SCENARIO_TYPES.WANTED_PERSON,
        category: CONTROL_SCENARIO_CATEGORIES.WANTED_PERSON,
        weight: 10,
        complexityLevel: 2,
        deceptionRisk: 0.35,
        focusAreas: ["identity_check", "wanted_database"]
    }
];

export const CONTROL_SCENARIOS_BY_TYPE = Object.fromEntries(
    DEFAULT_CONTROL_SCENARIOS.map((scenario) => [scenario.type, scenario])
);
