import {
    DISCREPANCY_DEFINITIONS,
    INSPECTION_DECISIONS,
    INSPECTION_OUTCOMES,
    REQUIRED_INSPECTION_DOCUMENTS
} from "../data";

// ##### Inspection Evaluator
// -----> Vergleicht die abgeschlossene Spielerprüfung mit dem Dokument-Wahrheitszustand.
// ---> Diese Funktion wird erst beim Bestätigen der Entscheidung aufgerufen.
export function evaluateInspection({
    inspectionSession,
    trafficEntity,
    playerDecision
}) {
    const actualDiscrepancyIds = getActualDiscrepancyIds(trafficEntity);
    const markedDiscrepancyIds = inspectionSession.markedDiscrepancies;

    const correctlyMarkedDiscrepancies = markedDiscrepancyIds.filter(
        (discrepancyId) => actualDiscrepancyIds.includes(discrepancyId)
    );
    const missedDiscrepancies = actualDiscrepancyIds.filter(
        (discrepancyId) => !markedDiscrepancyIds.includes(discrepancyId)
    );
    const falsePositiveDiscrepancies = markedDiscrepancyIds.filter(
        (discrepancyId) => !actualDiscrepancyIds.includes(discrepancyId)
    );

    const expectedDecision = actualDiscrepancyIds.length > 0
        ? INSPECTION_DECISIONS.REQUEST_ADDITIONAL_REVIEW
        : INSPECTION_DECISIONS.ALLOW_TO_CONTINUE;
    const decisionWasCorrect = playerDecision.type === expectedDecision;
    const unopenedDocuments = REQUIRED_INSPECTION_DOCUMENTS.filter(
        (documentType) => !inspectionSession.openedDocuments.includes(documentType)
    );

    return {
        outcome: determineOutcome({
            decisionWasCorrect,
            correctlyMarkedDiscrepancies,
            missedDiscrepancies,
            falsePositiveDiscrepancies,
            unopenedDocuments
        }),
        decisionWasCorrect,
        expectedDecision,
        actualDiscrepancyIds,
        correctlyMarkedDiscrepancies,
        missedDiscrepancies,
        falsePositiveDiscrepancies,
        unopenedDocuments
    };
}

// ##### Actual Discrepancy Resolver
// -----> Übersetzt betroffene Generatorfelder in spielbare Prüfpunkte.
// ---> Der UI werden weiterhin immer alle Prüfpunkte angeboten.
function getActualDiscrepancyIds(trafficEntity) {
    const affectedFields = [
        ...(trafficEntity.documentState?.npcDocuments?.driversLicense?.affectedFields ?? []),
        ...(trafficEntity.documentState?.vehicleDocuments?.registration?.affectedFields ?? [])
    ];

    return DISCREPANCY_DEFINITIONS
        .filter((definition) => {
            return definition.affectedFields.some(
                (field) => affectedFields.includes(field)
            );
        })
        .map((definition) => definition.id);
}

// ##### Inspection Outcome Resolver
// -----> Liefert eine kleine, verständliche Ergebnisabstufung ohne Punktesystem.
function determineOutcome({
    decisionWasCorrect,
    correctlyMarkedDiscrepancies,
    missedDiscrepancies,
    falsePositiveDiscrepancies,
    unopenedDocuments
}) {
    const allDiscrepanciesCorrect = missedDiscrepancies.length === 0
        && falsePositiveDiscrepancies.length === 0;
    const allDocumentsReviewed = unopenedDocuments.length === 0;

    if (decisionWasCorrect && allDiscrepanciesCorrect && allDocumentsReviewed) {
        return INSPECTION_OUTCOMES.CORRECT;
    }

    if (decisionWasCorrect || correctlyMarkedDiscrepancies.length > 0) {
        return INSPECTION_OUTCOMES.PARTIALLY_CORRECT;
    }

    return INSPECTION_OUTCOMES.INCORRECT;
}
