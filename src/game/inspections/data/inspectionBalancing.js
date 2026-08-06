// ##### Inspection Balancing
// -----> Bündelt alle Werte, die das Kontrolltempo und die Auswertung beeinflussen.
// ---> Änderungen am Spielgefühl benötigen dadurch keine Eingriffe in Auswahl- oder Bewertungslogik.
export const INSPECTION_BALANCING = {
    historyLimit: 20,
    pacing: {
        maximumConsecutiveCleanCases: 2,
        maximumConsecutiveIdenticalCases: 2,
        forgeryGuaranteeWindow: 5,
        wantedCooldownCases: 3,
        intermediateUnlockAfterCompletedCases: 3,
        advancedUnlockAfterCompletedCases: 10,
        advancedMinimumRecentAverageScore: 60,
        advancedScoreWindow: 5
    },
    score: {
        correctDecision: 40,
        identifiedFindings: 40,
        reviewedDocuments: 10,
        noFalsePositives: 10
    }
};

// Gewichte bleiben nach Falltyp benannt, damit neue Szenarien bewusst ergänzt werden müssen.
export const CONTROL_SCENARIO_WEIGHTS = {
    clean: 25,
    expired_license: 10,
    expired_insurance: 7,
    forged_identity: 14,
    forged_vehicle: 11,
    forged_insurance: 10,
    missing_license: 7,
    missing_insurance: 6,
    initial_refusal: 5,
    final_refusal: 4,
    wrong_document: 4,
    damaged_document: 5,
    contradictory_statement: 7,
    hidden_offender: 5,
    multi_issue: 4,
    wanted_person: 10
};
