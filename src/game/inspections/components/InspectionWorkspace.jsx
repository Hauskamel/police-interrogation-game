import { useEffect, useState } from "react";
import {
    FaCheck,
    FaClipboardCheck,
    FaClock,
    FaFileCircleExclamation,
    FaTowerBroadcast,
    FaTriangleExclamation,
    FaXmark
} from "react-icons/fa6";

import {
    gameStates,
    useInspectionStore,
    useControlScenarioStore,
    useGameStore,
    useNpcStore,
    useOfficialRegistryStore,
    useTrafficStore
} from "@stores";

import {
    INSPECTION_DECISION_OPTIONS,
    DISCREPANCY_CHECK_TYPES,
    DISCREPANCY_FIELD_DEFINITIONS_BY_ID,
    INSPECTION_DOCUMENT_LABELS,
    INSPECTION_FINDING_CATEGORIES,
    INSPECTION_FINDING_DEFINITIONS_BY_ID,
    INSPECTION_OUTCOMES,
    INSPECTION_RESOLUTION_ACTIONS
} from "../data";
import { evaluateInspection } from "../utils";
import { getCurrentGameDate } from "@game/shared";

// ##### Inspection Workspace
// -----> Verbindet die aktive Kontrollsession mit Prüfpunkten, Entscheidung und Ergebnis.
// ---> Die tatsächliche Dokumentwahrheit wird erst beim Abschließen ausgewertet.
export function InspectionWorkspace() {
    const activeInspection = useInspectionStore((state) => state.activeInspection);
    const lastCompletedInspection = useInspectionStore(
        (state) => state.lastCompletedInspection
    );
    const startDiscrepancyMode = useInspectionStore(
        (state) => state.startDiscrepancyMode
    );
    const cancelDiscrepancyMode = useInspectionStore(
        (state) => state.cancelDiscrepancyMode
    );
    const startRadioInquiryMode = useInspectionStore(
        (state) => state.startRadioInquiryMode
    );
    const cancelRadioInquiryMode = useInspectionStore(
        (state) => state.cancelRadioInquiryMode
    );
    const completeInspection = useInspectionStore(
        (state) => state.completeInspection
    );
    const dismissCompletedInspection = useInspectionStore(
        (state) => state.dismissCompletedInspection
    );
    const recordCompletedScenario = useControlScenarioStore(
        (state) => state.recordCompletedScenario
    );

    const gameState = useGameStore((state) => state.gameState);
    const continueTrafficEntity = useTrafficStore(
        (state) => state.continueTrafficEntity
    );
    const removeTrafficEntity = useTrafficStore(
        (state) => state.removeTrafficEntity
    );
    const setSelectedVehicleId = useTrafficStore(
        (state) => state.setSelectedVehicleId
    );
    const criminalDatabase = useNpcStore((state) => state.criminalDatabase);
    const officialRegistry = useOfficialRegistryStore(
        (state) => state.officialRegistry
    );

    const [dialog, setDialog] = useState(null);
    const [selectedDecision, setSelectedDecision] = useState(null);
    const [selectedReasonCodes, setSelectedReasonCodes] = useState([]);

    const activeTrafficEntity = useTrafficStore((state) => {
        return state.trafficEntities.find(
            (entity) => entity.id === activeInspection?.trafficEntityId
        );
    });

    useEffect(() => {
        if (!activeInspection) {
            setDialog(null);
            setSelectedDecision(null);
            setSelectedReasonCodes([]);
        }
    }, [activeInspection]);

    const submitDecision = () => {
        if (!activeInspection || !activeTrafficEntity || !selectedDecision) {
            return;
        }

        const playerDecision = {
            type: selectedDecision,
            reasonCodes: [...selectedReasonCodes]
        };
        const resolution = evaluateInspection({
            inspectionSession: activeInspection,
            trafficEntity: activeTrafficEntity,
            criminalDatabase,
            officialRegistry,
            playerDecision
        });

        completeInspection({
            playerDecision,
            resolution
        });
    };

    const finishCompletedInspection = () => {
        if (!lastCompletedInspection) return;

        const trafficEntityId = lastCompletedInspection.trafficEntityId;
        const resolutionAction = lastCompletedInspection.resolution?.resolutionAction;
        const completedScenario = lastCompletedInspection.resolution?.scenario;
        const entity = useTrafficStore.getState().trafficEntities.find(
            (trafficEntity) => trafficEntity.id === trafficEntityId
        );
        const entityCanLeaveWorld = resolutionAction
            === INSPECTION_RESOLUTION_ACTIONS.RELEASED;

        if (entityCanLeaveWorld && !entity?.spawn?.spawnForDevPurposes) {
            continueTrafficEntity(trafficEntityId);
        } else {
            // Festgehaltene und uebergebene Faelle verlassen den aktiven Verkehrskontext.
            // Dev-Spawns werden ebenfalls entfernt, da sie technisch nicht weiterfahren.
            removeTrafficEntity(trafficEntityId);
        }

        setSelectedVehicleId(null);
        if (completedScenario) {
            recordCompletedScenario({
                scenario: completedScenario,
                score: lastCompletedInspection.resolution.score,
                outcome: lastCompletedInspection.resolution.outcome
            });
        }
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

    return (
        <>
            <InspectionActionDock
                inspection={activeInspection}
                onStartDiscrepancy={startDiscrepancyMode}
                onCancelDiscrepancy={cancelDiscrepancyMode}
                onStartRadioInquiry={startRadioInquiryMode}
                onCancelRadioInquiry={cancelRadioInquiryMode}
                onOpenDecision={() => {
                    setSelectedReasonCodes(
                        activeInspection.findings.map((finding) => finding.findingId)
                    );
                    setDialog("decision");
                }}
            />

            {(activeInspection.discrepancyMode?.active || activeInspection.radioInquiryMode?.active) && (
                <InspectionFocusOverlay
                    laptopOpen={gameState === gameStates.LAPTOP}
                    radioInquiryActive={activeInspection.radioInquiryMode?.active}
                />
            )}

            {dialog === "decision" && (
                <InspectionDialog
                    title="Kontrolle abschließen"
                    description="Wähle Maßnahme und die Feststellungen, auf die du deine Entscheidung stützt."
                    onClose={() => setDialog(null)}
                >
                    <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-left text-xs leading-5 text-blue-900">
                        <strong>Dienstregel:</strong> Aktive Fahndungen werden
                        gemeldet. Manipulierte Dokumente werden sichergestellt,
                        widersprüchliche Identitätsangaben vor Ort geklärt. Fehlende
                        oder abgelaufene Pflichtnachweise verhindern die Weiterfahrt.
                        Polizeibekanntheit allein ist kein Grund für eine Maßnahme.
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

                    <div className="mt-5 border-t border-zinc-200 pt-4 text-left">
                        <h3 className="text-sm font-semibold">Begründung</h3>
                        <p className="mt-1 text-xs leading-5 text-zinc-500">
                            Es werden nur Feststellungen angeboten, die du während dieser Kontrolle belegt hast.
                        </p>
                        {activeInspection.findings.length === 0 ? (
                            <p className="mt-3 rounded bg-zinc-100 px-3 py-2 text-xs text-zinc-500">
                                Keine Feststellung dokumentiert.
                            </p>
                        ) : (
                            <div className="mt-3 space-y-2">
                                {activeInspection.findings.map((finding) => {
                                    const definition = INSPECTION_FINDING_DEFINITIONS_BY_ID[
                                        finding.findingId
                                    ];

                                    return (
                                        <label
                                            key={finding.id}
                                            className="flex cursor-pointer gap-3 rounded border border-zinc-200 bg-white p-3 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                className="mt-0.5 accent-blue-700"
                                                checked={selectedReasonCodes.includes(finding.findingId)}
                                                onChange={() => setSelectedReasonCodes((current) => {
                                                    return current.includes(finding.findingId)
                                                        ? current.filter((id) => id !== finding.findingId)
                                                        : [...current, finding.findingId];
                                                })}
                                            />
                                            <span>
                                                <strong className="block">{definition?.label ?? finding.findingId}</strong>
                                                <span className="mt-1 block text-xs text-zinc-500">
                                                    Erkannt durch {getFindingSourceLabel(finding.discoveredVia)}
                                                </span>
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
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

// ##### Inspection Action Dock
// -----> Haelt alle kontrollbezogenen Aktionen stabil links neben der Gespraechsbox.
function InspectionActionDock({
    inspection,
    onStartDiscrepancy,
    onCancelDiscrepancy,
    onStartRadioInquiry,
    onCancelRadioInquiry,
    onOpenDecision
}) {
    const elapsedTime = useElapsedTime(inspection.startedAt);
    const discrepancyMode = inspection.discrepancyMode ?? {};
    const discrepancyIsActive = Boolean(discrepancyMode.active);
    const radioInquiryMode = inspection.radioInquiryMode ?? {};
    const radioInquiryIsActive = Boolean(radioInquiryMode.active);
    const fieldModeIsActive = discrepancyIsActive || radioInquiryIsActive;
    const canStartFieldMode = inspection.visibleDocuments.length > 0;
    const discrepancyLabel = discrepancyIsActive
        ? "Diskrepanzprüfung abbrechen"
        : "Diskrepanz entdecken";

    return (
        <aside className="fixed bottom-[410px] right-4 z-[9700] flex items-end gap-2 text-white sm:right-8 lg:bottom-4 lg:right-[calc(580px+2.5rem)] lg:flex-col">
            {fieldModeIsActive && (discrepancyMode.feedback || radioInquiryMode.feedback) && (
                <div className="absolute bottom-full right-0 mb-2 w-64 rounded-md border border-blue-400 bg-zinc-900 px-3 py-2 text-left text-xs leading-5 text-zinc-200 shadow-xl lg:bottom-auto lg:left-auto lg:right-full lg:top-0 lg:mb-0 lg:mr-2">
                    <span className="font-semibold text-blue-300">
                        {radioInquiryIsActive
                            ? "Funkabfrage"
                            : getDiscrepancyProgressLabel(discrepancyMode)
                        }
                    </span>
                    <span className="mt-0.5 block">
                        {radioInquiryMode.feedback ?? discrepancyMode.feedback}
                    </span>
                </div>
            )}

            <div
                className="flex h-11 min-w-11 items-center justify-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-[11px] font-semibold text-zinc-300 shadow-xl"
                title="Dauer der aktuellen Kontrolle"
                aria-label={`Kontrolldauer ${elapsedTime}`}
            >
                <FaClock aria-hidden="true" />
                <span>{elapsedTime}</span>
            </div>

            <button
                type="button"
                className={`relative flex h-11 w-11 items-center justify-center rounded-md border text-base shadow-xl transition ${
                    discrepancyIsActive
                        ? "border-blue-400 bg-blue-700 text-white hover:bg-blue-800"
                        : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                } disabled:cursor-not-allowed disabled:opacity-40`}
                disabled={radioInquiryIsActive || (!canStartFieldMode && !discrepancyIsActive) || discrepancyMode.isResolving}
                aria-label={discrepancyLabel}
                aria-pressed={discrepancyIsActive}
                title={!canStartFieldMode && !discrepancyIsActive
                    ? "Öffnen Sie zuerst mindestens ein Dokument."
                    : discrepancyLabel
                }
                onClick={discrepancyIsActive
                    ? onCancelDiscrepancy
                    : onStartDiscrepancy
                }
            >
                <FaTriangleExclamation aria-hidden="true" />
                {inspection.findings.length > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white ring-2 ring-zinc-900">
                        {inspection.findings.length}
                    </span>
                )}
            </button>

            <button
                type="button"
                className={`flex h-11 w-11 items-center justify-center rounded-md border text-base shadow-xl transition ${
                    radioInquiryIsActive
                        ? "border-blue-400 bg-blue-700 text-white hover:bg-blue-800"
                        : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                } disabled:cursor-not-allowed disabled:opacity-40`}
                disabled={discrepancyIsActive || (!canStartFieldMode && !radioInquiryIsActive) || radioInquiryMode.isResolving}
                aria-label={radioInquiryIsActive ? "Funkabfrage abbrechen" : "Zentrale per Funk anfragen"}
                aria-pressed={radioInquiryIsActive}
                title={!canStartFieldMode && !radioInquiryIsActive
                    ? "Öffnen Sie zuerst mindestens ein Dokument."
                    : radioInquiryIsActive
                        ? "Funkabfrage abbrechen"
                        : "Zentrale per Funk anfragen"
                }
                onClick={radioInquiryIsActive
                    ? onCancelRadioInquiry
                    : onStartRadioInquiry
                }
            >
                <FaTowerBroadcast aria-hidden="true" />
            </button>

            <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-md border border-blue-500 bg-blue-700 text-base text-white shadow-xl transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={fieldModeIsActive}
                aria-label="Kontrolle abschließen"
                title="Kontrolle abschließen"
                onClick={onOpenDecision}
            >
                <FaClipboardCheck aria-hidden="true" />
            </button>
        </aside>
    );
}

function getDiscrepancyProgressLabel(discrepancyMode) {
    const firstSelectedField = discrepancyMode.selectedFields?.[0];
    if (!firstSelectedField) return "Feld auswählen";

    const definition = DISCREPANCY_FIELD_DEFINITIONS_BY_ID[
        firstSelectedField.fieldId
    ];

    return definition?.checkType === DISCREPANCY_CHECK_TYPES.PAIR
        ? "Vergleich 1/2"
        : "Prüfung läuft";
}

// ##### Inspection Focus Overlay
// -----> Diskrepanzen lassen den Laptop als Vergleichsflaeche frei; Funkabfragen dunkeln ihn mit ab.
function InspectionFocusOverlay({ laptopOpen, radioInquiryActive }) {
    return (
        <div
            className={`pointer-events-none fixed inset-0 ${
                laptopOpen && !radioInquiryActive ? "z-[7900]" : "z-[8500]"
            } bg-black/75 backdrop-blur-[1px]`}
            aria-hidden="true"
        />
    );
}

// Aktualisiert nur die sichtbare Dauer; die gespeicherten Zeitpunkte bleiben unverändert.
function useElapsedTime(startedAt) {
    const [currentTime, setCurrentTime] = useState(
        getCurrentGameDate().getTime()
    );

    useEffect(() => {
        const timerId = window.setInterval(() => {
            setCurrentTime(getCurrentGameDate().getTime());
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
        <div className="fixed inset-0 z-[13000] flex items-center justify-center bg-black/55 p-4">
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
                            {getResolutionButtonLabel(resolution.resolutionAction)}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function getResolutionButtonLabel(resolutionAction) {
    const labelByAction = {
        [INSPECTION_RESOLUTION_ACTIONS.RELEASED]: "Bericht schließen und Weiterfahrt erlauben",
        [INSPECTION_RESOLUTION_ACTIONS.HELD]: "Bericht schließen und Fahrzeug zurückhalten",
        [INSPECTION_RESOLUTION_ACTIONS.DOCUMENTS_SEIZED]: "Bericht schließen und Dokumente sicherstellen",
        [INSPECTION_RESOLUTION_ACTIONS.TRANSFERRED]: "Bericht schließen und Person übergeben"
    };

    return labelByAction[resolutionAction] ?? "Bericht schließen";
}

function getFindingSourceLabel(source) {
    const labelBySource = {
        document_comparison: "Dokumentenvergleich",
        radio_inquiry: "Funkabfrage",
        document_request: "Dokumentanfrage",
        driver_statement: "Fahrerbefragung"
    };

    return labelBySource[source] ?? source;
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
