import {
    INSPECTION_DECISIONS,
    INSPECTION_FINDING_DEFINITIONS,
    INSPECTION_OUTCOMES,
    REQUIRED_INSPECTION_DOCUMENTS
} from "../data";

// ##### Inspection Evaluator
// -----> Bewertet ausschließlich Sachverhalte, die in der aktuellen Kontrolle erkennbar waren.
// ---> Unbekannte World-Truth-Straftaten sind deshalb kein erwartetes Finding.
export function evaluateInspection({
    inspectionSession,
    trafficEntity,
    criminalDatabase,
    playerDecision
}) {
    const actualFindingIds = getDetectableFindingIds({
        inspectionSession,
        trafficEntity,
        criminalDatabase
    });
    const playerFindingIds = Array.from(new Set([
        ...inspectionSession.markedFindingIds,
        ...getDecisionFindingIds(playerDecision)
    ]));

    const correctlyIdentifiedFindings = playerFindingIds.filter(
        (findingId) => actualFindingIds.includes(findingId)
    );
    const missedFindings = actualFindingIds.filter(
        (findingId) => !playerFindingIds.includes(findingId)
    );
    const falsePositiveFindings = playerFindingIds.filter(
        (findingId) => !actualFindingIds.includes(findingId)
    );
    const expectedDecision = getExpectedDecision(actualFindingIds);
    const decisionWasCorrect = playerDecision.type === expectedDecision;
    const unopenedDocuments = REQUIRED_INSPECTION_DOCUMENTS.filter(
        (documentType) => !inspectionSession.openedDocuments.includes(documentType)
    );

    return {
        outcome: determineOutcome({
            decisionWasCorrect,
            correctlyIdentifiedFindings,
            missedFindings,
            falsePositiveFindings,
            unopenedDocuments
        }),
        decisionWasCorrect,
        expectedDecision,
        actualFindingIds,
        correctlyIdentifiedFindings,
        missedFindings,
        falsePositiveFindings,
        unopenedDocuments
    };
}

// ##### Detectable Finding Resolver
// -----> Kombiniert Dokumentmanipulation, Führerscheingültigkeit und aktive Fahndung.
function getDetectableFindingIds({
    inspectionSession,
    trafficEntity,
    criminalDatabase
}) {
    const affectedFields = [
        ...(trafficEntity.documentState?.npcDocuments?.driversLicense?.affectedFields ?? []),
        ...(trafficEntity.documentState?.vehicleDocuments?.registration?.affectedFields ?? [])
    ];
    const documentFindingIds = INSPECTION_FINDING_DEFINITIONS
        .filter((definition) => {
            return definition.affectedFields.some(
                (field) => affectedFields.includes(field)
            );
        })
        .map((definition) => definition.id);
    const validityFindingIds = isDriversLicenseExpired({
        trafficEntity,
        inspectedAt: inspectionSession.startedAt
    })
        ? ["expired_drivers_license"]
        : [];
    const policeFindingIds = hasActiveWantedRecord({
        trafficEntity,
        criminalDatabase
    })
        ? ["active_wanted_record"]
        : [];

    return Array.from(new Set([
        ...documentFindingIds,
        ...validityFindingIds,
        ...policeFindingIds
    ]));
}

// Der Kontrollbeginn ist der fachliche Stichtag für die Führerscheingültigkeit.
function isDriversLicenseExpired({ trafficEntity, inspectedAt }) {
    const expiryDate = trafficEntity.driverProfile?.real?.driversLicense?.expiryDate;
    if (!expiryDate) return false;

    return new Date(expiryDate).getTime() < new Date(inspectedAt).getTime();
}

// Nur ein auflösbarer aktiver Fahndungsrecord ist eine handlungsrelevante Fahndung.
function hasActiveWantedRecord({ trafficEntity, criminalDatabase }) {
    const wantedRecordId = trafficEntity.police?.wantedRecordId;
    const wantedRecord = criminalDatabase.wantedRecordsById?.[wantedRecordId];

    return Boolean(wantedRecord && wantedRecord.status === "active");
}

// Die Abschlussentscheidung ist die bewusste Aussage des Spielers über einen Fahndungstreffer.
// Reine Suchanfragen oder geöffnete Akten werden nicht als Identifikation interpretiert.
function getDecisionFindingIds(playerDecision) {
    if (playerDecision.type === INSPECTION_DECISIONS.REPORT_WANTED_HIT) {
        return ["active_wanted_record"];
    }

    return [];
}

// ##### Expected Decision Resolver
// -----> Priorisiert Fahndungen vor Manipulationen und abgelaufenen Führerscheinen.
function getExpectedDecision(actualFindingIds) {
    if (actualFindingIds.includes("active_wanted_record")) {
        return INSPECTION_DECISIONS.REPORT_WANTED_HIT;
    }

    const hasDocumentManipulation = actualFindingIds.some((findingId) => {
        const definition = INSPECTION_FINDING_DEFINITIONS.find(
            ({ id }) => id === findingId
        );

        return definition?.category === "document";
    });

    if (hasDocumentManipulation) {
        return INSPECTION_DECISIONS.REQUEST_ADDITIONAL_REVIEW;
    }

    if (actualFindingIds.includes("expired_drivers_license")) {
        return INSPECTION_DECISIONS.DENY_CONTINUATION;
    }

    return INSPECTION_DECISIONS.ALLOW_TO_CONTINUE;
}

function determineOutcome({
    decisionWasCorrect,
    correctlyIdentifiedFindings,
    missedFindings,
    falsePositiveFindings,
    unopenedDocuments
}) {
    const allFindingsCorrect = missedFindings.length === 0
        && falsePositiveFindings.length === 0;
    const allDocumentsReviewed = unopenedDocuments.length === 0;

    if (
        decisionWasCorrect
        && allFindingsCorrect
        && allDocumentsReviewed
    ) {
        return INSPECTION_OUTCOMES.CORRECT;
    }

    if (decisionWasCorrect || correctlyIdentifiedFindings.length > 0) {
        return INSPECTION_OUTCOMES.PARTIALLY_CORRECT;
    }

    return INSPECTION_OUTCOMES.INCORRECT;
}
