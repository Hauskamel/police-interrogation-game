import { pickWeightedItem } from "@game/shared";

import {
    CONTROL_SCENARIO_CATEGORIES,
    CONTROL_SCENARIO_TYPES,
    DEFAULT_CONTROL_SCENARIOS,
    INSPECTION_BALANCING
} from "../data";

const PACING = INSPECTION_BALANCING.pacing;

// ##### Next Control Scenario Selector
// -----> Waehlt einen gewichteten Kontrollfall und verhindert ereignisarme Zufallsserien.
// ---> history enthält nur abgeschlossene Kontrollen; reine Spawns verändern das Pacing nicht.
export function selectNextControlScenario({
    history = [],
    scenarios = DEFAULT_CONTROL_SCENARIOS,
    excludedTypes = [],
    random = Math.random
} = {}) {
    const maximumComplexity = getMaximumComplexity(history);
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
function getMaximumComplexity(history) {
    const completedCaseCount = history.length;
    const recentScores = history
        .slice(-PACING.advancedScoreWindow)
        .map((entry) => entry.score ?? 100);
    const recentAverageScore = recentScores.length === 0
        ? 0
        : recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    const advancedTierUnlocked = completedCaseCount
        >= PACING.advancedUnlockAfterCompletedCases
        && recentAverageScore >= PACING.advancedMinimumRecentAverageScore;

    if (advancedTierUnlocked) return 3;
    if (completedCaseCount >= PACING.intermediateUnlockAfterCompletedCases) return 2;
    return 1;
}

// Erzwingt innerhalb von jeweils fuenf erfolgreichen Kontrollen mindestens eine Falschung.
function mustSpawnForgery(history) {
    const previousCases = history.slice(-(PACING.forgeryGuaranteeWindow - 1));
    if (previousCases.length < PACING.forgeryGuaranteeWindow - 1) return false;

    return previousCases.every(
        (entry) => entry.category !== CONTROL_SCENARIO_CATEGORIES.FORGED_DOCUMENT
    );
}

function applyPacingConstraints(candidates, history) {
    let constrainedCandidates = [...candidates];
    const recentCleanCases = history.slice(-PACING.maximumConsecutiveCleanCases);
    const recentIdenticalCases = history.slice(
        -PACING.maximumConsecutiveIdenticalCases
    );
    const recentWantedCases = history.slice(-PACING.wantedCooldownCases);

    if (
        recentCleanCases.length === PACING.maximumConsecutiveCleanCases
        && recentCleanCases.every(
            (entry) => entry.type === CONTROL_SCENARIO_TYPES.CLEAN
        )
    ) {
        constrainedCandidates = constrainedCandidates.filter(
            (scenario) => scenario.type !== CONTROL_SCENARIO_TYPES.CLEAN
        );
    }

    if (
        recentIdenticalCases.length === PACING.maximumConsecutiveIdenticalCases
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
