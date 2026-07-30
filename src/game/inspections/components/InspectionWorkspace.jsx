import { useEffect, useState } from "react";
import {
    FaCheck,
    FaClipboardCheck,
    FaClock,
    FaFileCircleExclamation,
    FaFlag,
    FaXmark
} from "react-icons/fa6";

import {
    selectSelectedTrafficEntity,
    useInspectionStore,
    useNpcStore,
    useTrafficStore
} from "@stores";

import {
    INSPECTION_DECISION_OPTIONS,
    INSPECTION_DOCUMENT_LABELS,
    INSPECTION_FINDING_CATEGORIES,
    INSPECTION_FINDING_DEFINITIONS_BY_ID,
    INSPECTION_OUTCOMES,
    PLAYER_SELECTABLE_FINDINGS
} from "../data";
import { evaluateInspection } from "../utils";

// ##### Inspection Workspace
// -----> Verbindet die aktive Kontrollsession mit Prüfpunkten, Entscheidung und Ergebnis.
// ---> Die tatsächliche Dokumentwahrheit wird erst beim Abschließen ausgewertet.
export function InspectionWorkspace() {
    const activeInspection = useInspectionStore((state) => state.activeInspection);
    const lastCompletedInspection = useInspectionStore(
        (state) => state.lastCompletedInspection
    );
    const toggleFinding = useInspectionStore(
        (state) => state.toggleFinding
    );
    const completeInspection = useInspectionStore(
        (state) => state.completeInspection
    );
    const dismissCompletedInspection = useInspectionStore(
        (state) => state.dismissCompletedInspection
    );

    const selectedTrafficEntity = useTrafficStore(selectSelectedTrafficEntity);
    const continueTrafficEntity = useTrafficStore(
        (state) => state.continueTrafficEntity
    );
    const setSelectedVehicleId = useTrafficStore(
        (state) => state.setSelectedVehicleId
    );
    const criminalDatabase = useNpcStore((state) => state.criminalDatabase);

    const [dialog, setDialog] = useState(null);
    const [selectedDecision, setSelectedDecision] = useState(null);

    const activeTrafficEntity = useTrafficStore((state) => {
        return state.trafficEntities.find(
            (entity) => entity.id === activeInspection?.trafficEntityId
        );
    });

    useEffect(() => {
        if (!activeInspection) {
            setDialog(null);
            setSelectedDecision(null);
        }
    }, [activeInspection]);

    const submitDecision = () => {
        if (!activeInspection || !activeTrafficEntity || !selectedDecision) {
            return;
        }

        const playerDecision = {
            type: selectedDecision,
            reasonCodes: [...activeInspection.markedFindingIds]
        };
        const resolution = evaluateInspection({
            inspectionSession: activeInspection,
            trafficEntity: activeTrafficEntity,
            criminalDatabase,
            playerDecision
        });

        completeInspection({
            playerDecision,
            resolution
        });
    };

    const finishCompletedInspection = () => {
        if (!lastCompletedInspection) return;

        continueTrafficEntity(lastCompletedInspection.trafficEntityId);
        setSelectedVehicleId(null);
        dismissCompletedInspection();
    };

    if (lastCompletedInspection) {
        return (
            <InspectionResultDialog
                inspection={lastCompletedInspection}
                onFinish={finishCompletedInspection}
            />
        );
    }

    if (!activeInspection || !activeTrafficEntity) return null;

    const selectedEntityMatchesInspection = selectedTrafficEntity?.id
        === activeInspection.trafficEntityId;

    return (
        <>
            <InspectionToolbar
                inspection={activeInspection}
                selectedEntityMatchesInspection={selectedEntityMatchesInspection}
                onOpenFindings={() => setDialog("findings")}
                onOpenDecision={() => setDialog("decision")}
            />

            {dialog === "findings" && (
                <InspectionDialog
                    title="Feststellungen markieren"
                    description="Markiere Dokument- und Gültigkeitsprobleme selbst. Polizeirecords werden bewusst im Police Laptop zur Kontrolle hinzugefügt."
                    onClose={() => setDialog(null)}
                >
                    <div className="divide-y divide-zinc-200">
                        {PLAYER_SELECTABLE_FINDINGS.map((definition) => {
                            const isMarked = activeInspection.markedFindingIds
                                .includes(definition.id);

                            return (
                                <label
                                    key={definition.id}
                                    className="flex cursor-pointer gap-3 py-4 text-left"
                                >
                                    <input
                                        type="checkbox"
                                        className="mt-1 h-4 w-4 accent-blue-700"
                                        checked={isMarked}
                                        onChange={() => toggleFinding(definition.id)}
                                    />
                                    <span>
                                        <span className="mb-1 block text-[10px] font-semibold uppercase text-blue-700">
                                            {getFindingCategoryLabel(definition.category)}
                                        </span>
                                        <span className="block text-sm font-semibold text-zinc-950">
                                            {definition.label}
                                        </span>
                                        <span className="mt-1 block text-xs leading-5 text-zinc-500">
                                            {definition.description}
                                        </span>
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </InspectionDialog>
            )}

            {dialog === "decision" && (
                <InspectionDialog
                    title="Kontrolle abschließen"
                    description="Wähle die administrative Maßnahme. Danach wird die Kontrolle endgültig ausgewertet."
                    onClose={() => setDialog(null)}
                >
                    <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-left text-xs leading-5 text-blue-900">
                        <strong>Dienstregel Phase 1:</strong> Aktive Fahndungen
                        werden gemeldet. Manipulationsverdacht geht in die weitere
                        Prüfung. Ein abgelaufener Führerschein verhindert die
                        Weiterfahrt. Polizeibekanntheit allein ist kein Grund für
                        eine Maßnahme.
                    </div>

                    <div className="space-y-2">
                        {INSPECTION_DECISION_OPTIONS.map((option) => (
                            <label
                                key={option.id}
                                className={`flex cursor-pointer gap-3 rounded-md border p-3 text-left ${
                                    selectedDecision === option.id
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-zinc-200 bg-white hover:border-zinc-300"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="inspection-decision"
                                    className="mt-1 accent-blue-700"
                                    checked={selectedDecision === option.id}
                                    onChange={() => setSelectedDecision(option.id)}
                                />
                                <span>
                                    <span className="block text-sm font-semibold text-zinc-950">
                                        {option.label}
                                    </span>
                                    <span className="mt-1 block text-xs leading-5 text-zinc-500">
                                        {option.description}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="mt-5 w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                        disabled={!selectedDecision}
                        onClick={submitDecision}
                    >
                        Entscheidung bestätigen
                    </button>
                </InspectionDialog>
            )}
        </>
    );
}

// ##### Inspection Toolbar
// -----> Zeigt den laufenden Kontrollstatus, ohne Dokumente oder Panels zu verdecken.
function InspectionToolbar({
    inspection,
    selectedEntityMatchesInspection,
    onOpenFindings,
    onOpenDecision
}) {
    const elapsedTime = useElapsedTime(inspection.startedAt);

    return (
        <aside className="fixed left-1/2 top-4 z-[900] w-[min(680px,calc(100vw-2rem))] -translate-x-1/2 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-3 text-white shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-blue-700">
                        <FaClipboardCheck aria-hidden="true" />
                    </div>
                    <div className="min-w-0 text-left">
                        <p className="truncate text-sm font-semibold">Kontrolle aktiv</p>
                        <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <FaClock aria-hidden="true" />
                            {elapsedTime}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded bg-zinc-700 px-3 py-2 text-xs font-semibold hover:bg-zinc-600"
                        onClick={onOpenFindings}
                    >
                        <FaFlag aria-hidden="true" />
                        Feststellungen ({inspection.markedFindingIds.length})
                    </button>
                    <button
                        type="button"
                        className="rounded bg-blue-700 px-3 py-2 text-xs font-semibold hover:bg-blue-800"
                        onClick={onOpenDecision}
                    >
                        Entscheidung
                    </button>
                </div>
            </div>

            {!selectedEntityMatchesInspection && (
                <p className="mt-2 border-t border-zinc-700 pt-2 text-left text-xs text-amber-300">
                    Wähle das angehaltene Fahrzeug erneut aus, um seine Dokumente zu öffnen.
                </p>
            )}

        </aside>
    );
}

// Aktualisiert nur die sichtbare Dauer; die gespeicherten Zeitpunkte bleiben unverändert.
function useElapsedTime(startedAt) {
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const timerId = window.setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => window.clearInterval(timerId);
    }, []);

    const elapsedMilliseconds = Math.max(
        0,
        currentTime - new Date(startedAt).getTime()
    );
    const totalSeconds = Math.floor(elapsedMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ##### Inspection Dialog
// -----> Einheitlicher Modalrahmen für Markierungen und Abschlussentscheidung.
function InspectionDialog({ title, description, children, onClose }) {
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 p-4">
            <section
                className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md bg-zinc-50 text-zinc-900 shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="inspection-dialog-title"
            >
                <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-zinc-200 bg-white px-5 py-4">
                    <div className="text-left">
                        <h2 id="inspection-dialog-title" className="!text-lg font-semibold">
                            {title}
                        </h2>
                        <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
                    </div>
                    <button
                        type="button"
                        className="rounded p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                        aria-label="Dialog schließen"
                        onClick={onClose}
                    >
                        <FaXmark aria-hidden="true" />
                    </button>
                </header>
                <div className="px-5 py-4">{children}</div>
            </section>
        </div>
    );
}

// ##### Inspection Result Dialog
// -----> Zeigt World-Truth-basierte Bewertung ausschließlich nach Abschluss der Kontrolle.
function InspectionResultDialog({ inspection, onFinish }) {
    const resolution = inspection.resolution;
    const outcomeConfiguration = getOutcomeConfiguration(resolution.outcome);
    const decision = INSPECTION_DECISION_OPTIONS.find(
        (option) => option.id === inspection.playerDecision?.type
    );
    const expectedDecision = INSPECTION_DECISION_OPTIONS.find(
        (option) => option.id === resolution.expectedDecision
    );

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4">
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

                    <div className="sticky bottom-0 -mx-6 -mb-5 border-t border-zinc-200 bg-white px-6 py-4">
                        <button
                            type="button"
                            className="w-full rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                            onClick={onFinish}
                        >
                            Bericht schließen und Fahrzeug freigeben
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Gruppiert richtige, übersehene und falsche Findings nach ihrem fachlichen Bereich.
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

    return (
        <section>
            <h3 className="text-sm font-semibold">{title}</h3>
            <div className="mt-2 space-y-2 rounded-md border border-zinc-200 bg-white p-4">
                <FindingResultRow
                    label="Richtig erkannt"
                    findingIds={correctFindingIds}
                    tone="success"
                />
                <FindingResultRow
                    label="Übersehen"
                    findingIds={missedFindingIds}
                    tone="warning"
                />
                <FindingResultRow
                    label="Falsch beanstandet"
                    findingIds={falseFindingIds}
                    tone="error"
                />
                {correctFindingIds.length === 0
                && missedFindingIds.length === 0
                && falseFindingIds.length === 0 && (
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

function getFindingCategoryLabel(category) {
    const labels = {
        [INSPECTION_FINDING_CATEGORIES.DOCUMENT]: "Dokumentenprüfung",
        [INSPECTION_FINDING_CATEGORIES.VALIDITY]: "Gültigkeitsprüfung",
        [INSPECTION_FINDING_CATEGORIES.POLICE]: "Polizeiabgleich"
    };

    return labels[category] ?? category;
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
