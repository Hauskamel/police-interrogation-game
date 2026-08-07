import { useEffect, useState } from "react";
import {
    FaClipboardCheck,
    FaClock,
    FaTowerBroadcast,
    FaTriangleExclamation
} from "react-icons/fa6";

import { getCurrentGameDate } from "@game/shared";
import {
    DISCREPANCY_CHECK_TYPES,
    DISCREPANCY_FIELD_DEFINITIONS_BY_ID
} from "../data";

// ##### Inspection Action Dock
// -----> Hält alle kontrollbezogenen Aktionen stabil links neben der Gesprächsbox.
export function InspectionActionDock({
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
                <div className="absolute bottom-full right-0 mb-2 w-64 rounded-md border border-blue-400 bg-zinc-900 px-3 py-2 text-left text-xs leading-5 text-zinc-200 shadow-xl lg:bottom-auto lg:right-full lg:top-0 lg:mb-0 lg:mr-2">
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
                disabled={
                    radioInquiryIsActive
                    || (!canStartFieldMode && !discrepancyIsActive)
                    || discrepancyMode.isResolving
                }
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
                disabled={
                    discrepancyIsActive
                    || (!canStartFieldMode && !radioInquiryIsActive)
                    || radioInquiryMode.isResolving
                }
                aria-label={radioInquiryIsActive
                    ? "Funkabfrage abbrechen"
                    : "Zentrale per Funk anfragen"
                }
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
