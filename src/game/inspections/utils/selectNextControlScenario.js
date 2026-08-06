import { pickWeightedItem } from "@game/shared";

import {
    CONTROL_SCENARIO_CATEGORIES,
    CONTROL_SCENARIO_TYPES,
    DEFAULT_CONTROL_SCENARIOS
} from "../data";

const MAX_CONSECUTIVE_CLEAN_CASES = 2;
const MAX_CONSECUTIVE_IDENTICAL_CASES = 2;
const FORGERY_GUARANTEE_WINDOW = 5;
const WANTED_COOLDOWN_CASES = 3;
const INTERMEDIATE_CASE_THRESHOLD = 3;
const ADVANCED_CASE_THRESHOLD = 10;

// ##### Next Control Scenario Selector
// -----> Waehlt einen gewichteten Kontrollfall und verhindert ereignisarme Zufallsserien.
// ---> history enthaelt nur erfolgreich gespawnte Faelle; abgelehnte Spawns veraendern das Pacing nicht.
export function selectNextControlScenario({
    history = [],
    scenarios = DEFAULT_CONTROL_SCENARIOS,
    excludedTypes = [],
    random = Math.random
} = {}) {
    const maximumComplexity = getMaximumComplexity(history.length);
    const unlockedScenarios = scenarios.filter((scenario) => {
        return !excludedTypes.includes(scenario.type)
            && scenario.complexityLevel <= maximumComplexity;
    });
    let candidates = unlockedScenarios;

    if (mustSpawnForgery(history)) {
        candidates = candidates.filter(
            (scenario) => scenario.category === CONTROL_SCENARIO_CATEGORIES.FORGED_DOCUMENT
        );
    } else {
        candidates = applyPacingConstraints(candidates, history);
    }

    // Eine benutzerdefinierte Konfiguration darf nicht durch alle Filter leer werden.
    if (candidates.length === 0) {
        candidates = unlockedScenarios;
    }

    if (candidates.length === 0) return null;

    return cloneScenario(pickWeightedItem(candidates, random));
}

// Die ersten Kontrollen lehren einzelne Regeln. Danach werden Täuschungen und schließlich
// kombinierte Fälle freigeschaltet, ohne einen separaten Schwierigkeitszustand zu speichern.
function getMaximumComplexity(completedCaseCount) {
    if (completedCaseCount >= ADVANCED_CASE_THRESHOLD) return 3;
    if (completedCaseCount >= INTERMEDIATE_CASE_THRESHOLD) return 2;
    return 1;
}

// Erzwingt innerhalb von jeweils fuenf erfolgreichen Kontrollen mindestens eine Falschung.
function mustSpawnForgery(history) {
    const previousCases = history.slice(-(FORGERY_GUARANTEE_WINDOW - 1));
    if (previousCases.length < FORGERY_GUARANTEE_WINDOW - 1) return false;

    return previousCases.every(
        (entry) => entry.category !== CONTROL_SCENARIO_CATEGORIES.FORGED_DOCUMENT
    );
}

function applyPacingConstraints(candidates, history) {
    let constrainedCandidates = [...candidates];
    const recentCleanCases = history.slice(-MAX_CONSECUTIVE_CLEAN_CASES);
    const recentIdenticalCases = history.slice(-MAX_CONSECUTIVE_IDENTICAL_CASES);
    const recentWantedCases = history.slice(-WANTED_COOLDOWN_CASES);

    if (
        recentCleanCases.length === MAX_CONSECUTIVE_CLEAN_CASES
        && recentCleanCases.every(
            (entry) => entry.type === CONTROL_SCENARIO_TYPES.CLEAN
        )
    ) {
        constrainedCandidates = constrainedCandidates.filter(
            (scenario) => scenario.type !== CONTROL_SCENARIO_TYPES.CLEAN
        );
    }

    if (
        recentIdenticalCases.length === MAX_CONSECUTIVE_IDENTICAL_CASES
        && recentIdenticalCases.every(
            (entry) => entry.type === recentIdenticalCases[0].type
        )
    ) {
        constrainedCandidates = constrainedCandidates.filter(
            (scenario) => scenario.type !== recentIdenticalCases[0].type
        );
    }

    if (
        recentWantedCases.some(
            (entry) => entry.type === CONTROL_SCENARIO_TYPES.WANTED_PERSON
        )
    ) {
        constrainedCandidates = constrainedCandidates.filter(
            (scenario) => scenario.type !== CONTROL_SCENARIO_TYPES.WANTED_PERSON
        );
    }

    return constrainedCandidates;
}

function cloneScenario(scenario) {
    return {
        ...scenario,
        focusAreas: [...scenario.focusAreas]
    };
}
