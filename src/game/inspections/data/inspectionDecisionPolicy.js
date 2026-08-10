import {
    INSPECTION_DECISIONS
} from "./inspectionConstants.js";
import {
    INSPECTION_FINDING_CATEGORIES,
    INSPECTION_FINDING_DEFINITIONS_BY_ID
} from "./findingDefinitions.js";

// ##### Inspection Decision Policy
// -----> Ist die kanonische Priorität für Handbuch und technische Auswertung.
// ---> Der erste passende Eintrag bestimmt bei mehreren Feststellungen die Maßnahme.
export const INSPECTION_DECISION_POLICY = [
    {
        decision: INSPECTION_DECISIONS.REPORT_WANTED_HIT,
        ruleText: "Passende aktive Fahndung: Fahndungstreffer melden.",
        matches: (findingIds) => findingIds.includes("active_wanted_record")
    },
    {
        decision: INSPECTION_DECISIONS.HOLD_FOR_CLARIFICATION,
        ruleText: "Widersprüchliche Identitätsangabe: Person zur Klärung festhalten.",
        matches: (findingIds) => findingIds.includes(
            "inconsistent_driver_statement"
        )
    },
    {
        decision: INSPECTION_DECISIONS.SEIZE_DOCUMENTS,
        ruleText: "Manipuliertes oder erheblich beschädigtes Dokument: Dokumente sicherstellen.",
        matches: (findingIds) => findingIds.includes("damaged_document")
            || findingIds.some(isDocumentFinding)
    },
    {
        decision: INSPECTION_DECISIONS.DENY_CONTINUATION,
        ruleText: "Fehlender, unpassender oder abgelaufener Pflichtnachweis: Weiterfahrt verweigern.",
        matches: (findingIds) => findingIds.some(isContinuationBlockingFinding)
    },
    {
        decision: INSPECTION_DECISIONS.ALLOW_TO_CONTINUE,
        ruleText: "Keine relevante Feststellung: Weiterfahrt erlauben.",
        matches: () => true
    }
];

export function getExpectedInspectionDecision(findingIds) {
    return INSPECTION_DECISION_POLICY.find(
        (policyEntry) => policyEntry.matches(findingIds)
    ).decision;
}

function isDocumentFinding(findingId) {
    return INSPECTION_FINDING_DEFINITIONS_BY_ID[findingId]?.category
        === INSPECTION_FINDING_CATEGORIES.DOCUMENT;
}

function isContinuationBlockingFinding(findingId) {
    return findingId === "expired_drivers_license"
        || findingId === "expired_insurance"
        || findingId === "expired_residence_permit"
        || findingId === "expired_work_permit"
        || findingId.startsWith("missing_")
        || findingId === "document_refusal"
        || findingId === "wrong_document_presented";
}
