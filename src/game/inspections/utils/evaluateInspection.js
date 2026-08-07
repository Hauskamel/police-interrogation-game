import {
    INSPECTION_DECISIONS,
    INSPECTION_BALANCING,
    INSPECTION_FINDING_DEFINITIONS,
    getExpectedInspectionDecision,
    INSPECTION_OUTCOMES,
    INSPECTION_RESOLUTION_ACTIONS,
    REQUIRED_INSPECTION_DOCUMENTS
} from "../data";

// ##### Inspection Evaluator
// -----> Bewertet ausschließlich Sachverhalte, die in der aktuellen Kontrolle erkennbar waren.
// ---> Unbekannte World-Truth-Straftaten sind deshalb kein erwartetes Finding.
export function evaluateInspection({
    inspectionSession,
    trafficEntity,
    criminalDatabase,
    officialRegistry,
    playerDecision
}) {
    const actualFindingIds = getDetectableFindingIds({
        inspectionSession,
        trafficEntity,
        criminalDatabase,
        officialRegistry
    });
    const selectedReasonCodes = playerDecision.reasonCodes ?? [];
    const playerFindingIds = Array.from(new Set([
        ...selectedReasonCodes,
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
    const expectedDecision = getExpectedInspectionDecision(actualFindingIds);
    const decisionWasCorrect = playerDecision.type === expectedDecision;
    const unavailableDocuments = getUnavailableRequestedDocuments(inspectionSession);
    const unopenedDocuments = REQUIRED_INSPECTION_DOCUMENTS.filter((documentType) => {
        return !inspectionSession.openedDocuments.includes(documentType)
            && !unavailableDocuments.includes(documentType);
    });
    const score = calculateInspectionScore({
        decisionWasCorrect,
        actualFindingIds,
        correctlyIdentifiedFindings,
        falsePositiveFindings,
        unopenedDocuments
    });

    return {
        outcome: determineOutcome({
            decisionWasCorrect,
            correctlyIdentifiedFindings,
            missedFindings,
            falsePositiveFindings,
            unopenedDocuments
        }),
        resolutionAction: getResolutionAction(playerDecision.type),
        decisionWasCorrect,
        expectedDecision,
        actualFindingIds,
        correctlyIdentifiedFindings,
        missedFindings,
        falsePositiveFindings,
        unopenedDocuments,
        unavailableDocuments,
        score,
        feedback: createFeedback({
            decisionWasCorrect,
            missedFindings,
            falsePositiveFindings,
            unopenedDocuments
        }),
        scenario: trafficEntity.controlScenario
    };
}

// ##### Detectable Finding Resolver
// -----> Kombiniert Dokumentmanipulation, Führerscheingültigkeit und aktive Fahndung.
function getDetectableFindingIds({
    inspectionSession,
    trafficEntity,
    criminalDatabase,
    officialRegistry
}) {
    const affectedFields = [
        ...(trafficEntity.documentState?.npcDocuments?.driversLicense?.affectedFields ?? []),
        ...(trafficEntity.documentState?.vehicleDocuments?.registration?.affectedFields ?? []),
        ...(trafficEntity.documentState?.vehicleDocuments?.insurance?.affectedFields ?? [])
    ];
    const documentFindingIds = INSPECTION_FINDING_DEFINITIONS
        .filter((definition) => {
            const fieldWasAffected = definition.affectedFields.some(
                (field) => affectedFields.includes(field)
            );

            return fieldWasAffected && isFindingResolvable({
                definition,
                trafficEntity,
                officialRegistry
            });
        })
        .map((definition) => definition.id);
    const validityFindingIds = isDriversLicenseExpired({
        trafficEntity,
        inspectedAt: inspectionSession.startedAt
    })
        ? ["expired_drivers_license"]
        : [];
    const insuranceValidityFindingIds = isInsuranceExpired({
        trafficEntity,
        inspectedAt: inspectionSession.startedAt
    })
        ? ["expired_insurance"]
        : [];
    const policeFindingIds = hasActiveWantedRecord({
        trafficEntity,
        criminalDatabase
    })
        ? ["active_wanted_record"]
        : [];
    const controlFindingIds = getControlInteractionFindingIds({
        inspectionSession,
        trafficEntity,
        officialRegistry
    });

    return Array.from(new Set([
        ...documentFindingIds,
        ...validityFindingIds,
        ...insuranceValidityFindingIds,
        ...controlFindingIds,
        ...policeFindingIds
    ]));
}

// Dokumentverfügbarkeit ist sofort beobachtbar. Fahreraussagen werden dagegen nur
// bewertet, wenn der Spieler die betreffende Frage in dieser Kontrolle gestellt hat.
function getControlInteractionFindingIds({
    inspectionSession,
    trafficEntity,
    officialRegistry
}) {
    const findingByDocument = {
        driversLicense: "missing_drivers_license",
        carDocuments: "missing_vehicle_registration",
        proofOfInsurance: "missing_insurance"
    };
    const findings = Object.entries(trafficEntity.documentAvailability ?? {})
        .flatMap(([documentType, availability]) => {
            if (availability === "forgotten" || availability === "lost") {
                return [findingByDocument[documentType]];
            }

            if (availability === "damaged") return ["damaged_document"];
            return [];
        })
        .filter(Boolean);

    const addressWasAsked = (inspectionSession.conversationEntries ?? []).some(
        (entry) => entry.type === "interview" && entry.questionId === "address"
    );
    const statedAddress = trafficEntity.statementProfile?.responses?.address?.value;
    const registeredAddress = officialRegistry.peopleById?.[
        trafficEntity.npcId
    ]?.address;
    const hasContradictoryResponse = addressWasAsked
        && statedAddress
        && registeredAddress
        && normalizeComparableValue(statedAddress)
            !== normalizeComparableValue(registeredAddress);

    if (hasContradictoryResponse) {
        findings.push("inconsistent_driver_statement");
    }

    const availabilityValues = Object.values(
        trafficEntity.documentAvailability ?? {}
    );

    if (availabilityValues.includes("refused")) {
        findings.push("document_refusal");
    }

    if (availabilityValues.includes("wrong_document")) {
        findings.push("wrong_document_presented");
    }

    return findings;
}

function normalizeComparableValue(value) {
    return String(value).trim().toLocaleLowerCase("de-DE");
}

// Ein Dokumentfehler wird nur erwartet, wenn sein kanonischer Registerrecord aufloesbar ist.
function isFindingResolvable({ definition, trafficEntity, officialRegistry }) {
    if (definition.registryType === "driverLicense") {
        const licenseNumber = trafficEntity.driverProfile?.real?.driversLicense?.licenseNumber;
        return Boolean(officialRegistry.driverLicensesByNumber?.[licenseNumber]);
    }

    if (definition.registryType === "vehicle") {
        return Boolean(officialRegistry.vehiclesById?.[trafficEntity.vehicleId]);
    }

    if (definition.registryType === "insurance") {
        const policyId = trafficEntity.insuranceProfile?.real?.policyId;
        return Boolean(officialRegistry.insurancePoliciesById?.[policyId]);
    }

    return true;
}

// Der Kontrollbeginn ist der fachliche Stichtag für die Führerscheingültigkeit.
function isDriversLicenseExpired({ trafficEntity, inspectedAt }) {
    const expiryDate = trafficEntity.driverProfile?.real?.driversLicense?.expiryDate;
    if (!expiryDate) return false;

    return expiryDate < inspectedAt.slice(0, 10);
}

function isInsuranceExpired({ trafficEntity, inspectedAt }) {
    const validUntil = trafficEntity.insuranceProfile?.real?.validUntil;
    if (!validUntil) return false;

    return validUntil < inspectedAt.slice(0, 10);
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

function getResolutionAction(decisionType) {
    const actionByDecision = {
        [INSPECTION_DECISIONS.ALLOW_TO_CONTINUE]: INSPECTION_RESOLUTION_ACTIONS.RELEASED,
        [INSPECTION_DECISIONS.DENY_CONTINUATION]: INSPECTION_RESOLUTION_ACTIONS.HELD,
        [INSPECTION_DECISIONS.SEIZE_DOCUMENTS]: INSPECTION_RESOLUTION_ACTIONS.DOCUMENTS_SEIZED,
        [INSPECTION_DECISIONS.HOLD_FOR_CLARIFICATION]: INSPECTION_RESOLUTION_ACTIONS.HELD,
        [INSPECTION_DECISIONS.REPORT_WANTED_HIT]: INSPECTION_RESOLUTION_ACTIONS.TRANSFERRED
    };

    return actionByDecision[decisionType] ?? INSPECTION_RESOLUTION_ACTIONS.HELD;
}

function getUnavailableRequestedDocuments(inspectionSession) {
    return Object.entries(inspectionSession.documentRequestStates ?? {})
        .filter(([, requestState]) => {
            return ["unavailable", "refused", "wrong_document"].includes(
                requestState.result
            );
        })
        .map(([documentType]) => documentType);
}

// 40 Punkte bewerten die Maßnahme, 40 die Feststellungen und je 10 die Prüfungstiefe
// sowie unbegründete Beanstandungen. Die Werte sind bewusst leicht nachvollziehbar.
function calculateInspectionScore({
    decisionWasCorrect,
    actualFindingIds,
    correctlyIdentifiedFindings,
    falsePositiveFindings,
    unopenedDocuments
}) {
    const findingRatio = actualFindingIds.length === 0
        ? 1
        : correctlyIdentifiedFindings.length / actualFindingIds.length;
    const scoreWeights = INSPECTION_BALANCING.score;
    const findingPoints = Math.round(
        findingRatio * scoreWeights.identifiedFindings
    );
    const reviewPoints = unopenedDocuments.length === 0
        ? scoreWeights.reviewedDocuments
        : 0;
    const precisionPoints = falsePositiveFindings.length === 0
        ? scoreWeights.noFalsePositives
        : 0;

    return (decisionWasCorrect ? scoreWeights.correctDecision : 0)
        + findingPoints
        + reviewPoints
        + precisionPoints;
}

function createFeedback({
    decisionWasCorrect,
    missedFindings,
    falsePositiveFindings,
    unopenedDocuments
}) {
    const feedback = [];

    feedback.push(decisionWasCorrect
        ? "Die gewählte Maßnahme war fachlich passend."
        : "Die gewählte Maßnahme passte nicht zum festgestellten Sachverhalt."
    );
    if (missedFindings.length > 0) {
        feedback.push(`${missedFindings.length} relevante Feststellung(en) wurden nicht begründet.`);
    }
    if (falsePositiveFindings.length > 0) {
        feedback.push(`${falsePositiveFindings.length} Begründung(en) waren nicht belegbar.`);
    }
    if (unopenedDocuments.length > 0) {
        feedback.push("Nicht alle verfügbaren Pflichtdokumente wurden geprüft.");
    }

    return feedback;
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
