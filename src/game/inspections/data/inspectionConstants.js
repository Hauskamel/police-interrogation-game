// ##### Inspection Statuses
// -----> Phase 1 unterscheidet nur laufende, abgeschlossene und abgebrochene Kontrollen.
export const INSPECTION_STATUSES = {
    ACTIVE: "active",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
};

// ##### Inspection Document Types
// -----> Verwendet dieselben Keys wie der bestehende DocumentManager.
// ---> Die fachliche Verfügbarkeit wird pro TrafficEntity festgelegt.
export const INSPECTION_DOCUMENT_TYPES = {
    DRIVERS_LICENSE: "driversLicense",
    VEHICLE_REGISTRATION: "carDocuments",
    PROOF_OF_INSURANCE: "proofOfInsurance"
};

export const INSPECTION_DOCUMENT_LABELS = {
    [INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE]: "Führerschein",
    [INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION]: "Fahrzeugpapiere",
    [INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE]: "Versicherung"
};

export const REQUIRED_INSPECTION_DOCUMENTS = Object.values(
    INSPECTION_DOCUMENT_TYPES
);

// ##### Document Availability
// -----> Trennt den Besitz eines Dokuments von dessen Verhalten bei einer Kontrolle.
export const DOCUMENT_AVAILABILITY_STATUSES = {
    PROVIDED: "provided",
    FORGOTTEN: "forgotten",
    LOST: "lost",
    INITIALLY_REFUSED: "initially_refused",
    REFUSED: "refused",
    WRONG_DOCUMENT: "wrong_document",
    DAMAGED: "damaged"
};

// ##### Inspection Decisions
// -----> Beschreibt die administrativen Maßnahmen der ersten Gameplay-Version.
export const INSPECTION_DECISIONS = {
    ALLOW_TO_CONTINUE: "allow_to_continue",
    DENY_CONTINUATION: "deny_continuation",
    SEIZE_DOCUMENTS: "seize_documents",
    HOLD_FOR_CLARIFICATION: "hold_for_clarification",
    REPORT_WANTED_HIT: "report_wanted_hit"
};

// ##### Inspection Resolution Actions
// -----> Beschreibt die fachliche Folge der tatsaechlich gewaehlten Spielerentscheidung.
export const INSPECTION_RESOLUTION_ACTIONS = {
    RELEASED: "released",
    HELD: "held",
    DOCUMENTS_SEIZED: "documents_seized",
    TRANSFERRED: "transferred"
};

export const INSPECTION_DECISION_OPTIONS = [
    {
        id: INSPECTION_DECISIONS.ALLOW_TO_CONTINUE,
        label: "Weiterfahrt erlauben",
        description: "Die Kontrolle ist unauffällig und das Fahrzeug darf weiterfahren."
    },
    {
        id: INSPECTION_DECISIONS.DENY_CONTINUATION,
        label: "Weiterfahrt verweigern",
        description: "Fahrer oder Fahrzeug dürfen die Kontrollstelle vorerst nicht verlassen."
    },
    {
        id: INSPECTION_DECISIONS.SEIZE_DOCUMENTS,
        label: "Dokumente sicherstellen",
        description: "Manipulierte oder erheblich beschädigte Dokumente werden zur Prüfung sichergestellt."
    },
    {
        id: INSPECTION_DECISIONS.HOLD_FOR_CLARIFICATION,
        label: "Person zur Klärung festhalten",
        description: "Widersprüchliche Identitätsangaben müssen vor Ort weiter geklärt werden."
    },
    {
        id: INSPECTION_DECISIONS.REPORT_WANTED_HIT,
        label: "Fahndungstreffer melden",
        description: "Die aktive Fahndung wird bestätigt und eine geordnete Übergabe angefordert."
    }
];

// ##### Inspection Outcomes
// -----> Kleine Ergebnisabstufung für den Kontrollbericht der ersten Version.
export const INSPECTION_OUTCOMES = {
    CORRECT: "correct",
    PARTIALLY_CORRECT: "partially_correct",
    INCORRECT: "incorrect"
};
