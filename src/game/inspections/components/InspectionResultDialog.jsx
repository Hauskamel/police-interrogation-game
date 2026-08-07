import {
    FaCheck,
    FaFileCircleExclamation,
    FaXmark
} from "react-icons/fa6";

import {
    INSPECTION_DECISION_OPTIONS,
    INSPECTION_DOCUMENT_LABELS,
    INSPECTION_FINDING_CATEGORIES,
    INSPECTION_FINDING_DEFINITIONS_BY_ID,
    INSPECTION_OUTCOMES
} from "../data";

// ##### Inspection Result Dialog
// -----> Zeigt World-Truth-basierte Bewertung ausschließlich nach Abschluss der Kontrolle.
export function InspectionResultDialog({ inspection, onFinish }) {
    const resolution = inspection.resolution;
    const outcomeConfiguration = getOutcomeConfiguration(resolution.outcome);
    const decision = INSPECTION_DECISION_OPTIONS.find(
        (option) => option.id === inspection.playerDecision?.type
    );
    const expectedDecision = INSPECTION_DECISION_OPTIONS.find(
        (option) => option.id === resolution.expectedDecision
    );

    return (
        <div className="fixed inset-0 z-[13000] flex items-center justify-center bg-black/60 p-4">
            <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-md bg-zinc-50 text-zinc-900 shadow-2xl">
                <header className={`border-b px-6 py-5 text-left ${outcomeConfiguration.headerClass}`}>
                    <p className="text-xs font-semibold uppercase">Kontrollbericht</p>
                    <div className="mt-2 flex items-center gap-3">
                        {outcomeConfiguration.icon}
                        <h2 className="!text-2xl font-semibold">
                            {outcomeConfiguration.label}
                        </h2>
                    </div>
                    <p className="mt-2 text-sm">
                        Dauer: {formatInspectionDuration(
                            inspection.startedAt,
                            inspection.completedAt
                        )}
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                        Bewertung: {resolution.score}/100 Punkte
                    </p>
                </header>

                <div className="space-y-6 px-6 py-5 text-left">
                    <section>
                        <h3 className="text-sm font-semibold">Entscheidung</h3>
                        <div className="mt-2 rounded-md border border-zinc-200 bg-white p-4">
                            <p className="font-semibold">{decision?.label}</p>
                            {!resolution.decisionWasCorrect && (
                                <p className="mt-2 text-xs text-zinc-600">
                                    Erwartete Maßnahme: <strong>{expectedDecision?.label}</strong>
                                </p>
                            )}
                        </div>
                    </section>

                    <FindingCategoryReport
                        category={INSPECTION_FINDING_CATEGORIES.DOCUMENT}
                        title="Dokumentenprüfung"
                        resolution={resolution}
                    />
                    <FindingCategoryReport
                        category={INSPECTION_FINDING_CATEGORIES.COOPERATION}
                        title="Dokumentvorlage und Aussagen"
                        resolution={resolution}
                    />
                    <FindingCategoryReport
                        category={INSPECTION_FINDING_CATEGORIES.VALIDITY}
                        title="Gültigkeitsprüfung"
                        resolution={resolution}
                    />
                    <FindingCategoryReport
                        category={INSPECTION_FINDING_CATEGORIES.POLICE}
                        title="Polizeiabgleich"
                        resolution={resolution}
                    />

                    <section>
                        <h3 className="text-sm font-semibold">Geöffnete Dokumente</h3>
                        <p className="mt-2 text-sm text-zinc-600">
                            {resolution.unopenedDocuments.length === 0
                                ? "Alle verfügbaren Dokumente wurden geöffnet."
                                : `Nicht geöffnet: ${resolution.unopenedDocuments
                                    .map((documentType) => INSPECTION_DOCUMENT_LABELS[documentType])
                                    .join(", ")}`
                            }
                        </p>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold">Einsatzfeedback</h3>
                        <div className="mt-2 rounded-md border border-zinc-200 bg-white p-4">
                            <ul className="space-y-1 text-sm text-zinc-700">
                                {resolution.feedback.map((message) => (
                                    <li key={message}>{message}</li>
                                ))}
                            </ul>
                            {resolution.scenario && (
                                <p className="mt-3 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
                                    Falltyp nach Abschluss: {resolution.scenario.type}
                                    {` · Komplexität ${resolution.scenario.complexityLevel}`}
                                </p>
                            )}
                        </div>
                    </section>

                    <div className="sticky bottom-0 -mx-6 -mb-5 border-t border-zinc-200 bg-white px-6 py-4">
                        <button
                            type="button"
                            className="w-full rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                            onClick={onFinish}
                        >
                            Bericht schließen
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FindingCategoryReport({ category, title, resolution }) {
    const correctFindingIds = filterFindingsByCategory(
        resolution.correctlyIdentifiedFindings,
        category
    );
    const missedFindingIds = filterFindingsByCategory(
        resolution.missedFindings,
        category
    );
    const falseFindingIds = filterFindingsByCategory(
        resolution.falsePositiveFindings,
        category
    );
    const hasFindings = correctFindingIds.length > 0
        || missedFindingIds.length > 0
        || falseFindingIds.length > 0;

    return (
        <section>
            <h3 className="text-sm font-semibold">{title}</h3>
            <div className="mt-2 space-y-2 rounded-md border border-zinc-200 bg-white p-4">
                <FindingResultRow label="Richtig erkannt" findingIds={correctFindingIds} tone="success" />
                <FindingResultRow label="Übersehen" findingIds={missedFindingIds} tone="warning" />
                <FindingResultRow label="Falsch beanstandet" findingIds={falseFindingIds} tone="error" />
                {!hasFindings && (
                    <p className="text-sm text-zinc-500">
                        Keine handlungsrelevante Feststellung in diesem Bereich.
                    </p>
                )}
            </div>
        </section>
    );
}

function FindingResultRow({ label, findingIds, tone }) {
    if (findingIds.length === 0) return null;

    const toneClasses = {
        success: "text-emerald-800",
        warning: "text-amber-800",
        error: "text-red-800"
    };

    return (
        <div>
            <p className={`text-xs font-semibold ${toneClasses[tone]}`}>{label}</p>
            <ul className="mt-1 space-y-1 text-sm text-zinc-800">
                {findingIds.map((findingId) => (
                    <li key={findingId}>
                        {INSPECTION_FINDING_DEFINITIONS_BY_ID[findingId]?.label
                            ?? findingId}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function filterFindingsByCategory(findingIds, category) {
    return findingIds.filter((findingId) => {
        return INSPECTION_FINDING_DEFINITIONS_BY_ID[findingId]?.category
            === category;
    });
}

function getOutcomeConfiguration(outcome) {
    if (outcome === INSPECTION_OUTCOMES.CORRECT) {
        return {
            label: "Kontrolle korrekt abgeschlossen",
            headerClass: "border-emerald-200 bg-emerald-50 text-emerald-900",
            icon: <FaCheck className="text-xl" aria-hidden="true" />
        };
    }

    if (outcome === INSPECTION_OUTCOMES.PARTIALLY_CORRECT) {
        return {
            label: "Kontrolle teilweise korrekt",
            headerClass: "border-amber-200 bg-amber-50 text-amber-900",
            icon: <FaFileCircleExclamation className="text-xl" aria-hidden="true" />
        };
    }

    return {
        label: "Kontrolle fehlerhaft",
        headerClass: "border-red-200 bg-red-50 text-red-900",
        icon: <FaXmark className="text-xl" aria-hidden="true" />
    };
}

function formatInspectionDuration(startedAt, completedAt) {
    const durationMilliseconds = Math.max(
        0,
        new Date(completedAt).getTime() - new Date(startedAt).getTime()
    );
    const totalSeconds = Math.floor(durationMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes} Min. ${seconds} Sek.`;
}
