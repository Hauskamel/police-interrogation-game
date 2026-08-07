import { FaClipboardList } from "react-icons/fa6";

import { useShiftStore } from "@stores";
import { FIRST_SHIFT_STORY, SHIFT_CLUE_LABELS } from "../data";

export function ShiftStatusPanel() {
    const status = useShiftStore((state) => state.status);
    const completedEncounters = useShiftStore((state) => state.completedEncounters);
    const clueIds = useShiftStore((state) => state.clueIds);
    const currentEncounter = useShiftStore((state) => state.getCurrentEncounter());

    return (
        <aside className="fixed left-4 top-4 z-[700] w-[min(22rem,calc(100vw-2rem))] rounded-md border border-zinc-700 bg-zinc-900/95 p-4 text-left text-white shadow-lg sm:left-6 sm:top-6">
            <div className="flex items-start gap-3">
                <FaClipboardList className="mt-1 shrink-0 text-blue-400" aria-hidden="true" />
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase text-zinc-400">Schichtauftrag</p>
                    <h2 className="!text-sm font-semibold">{FIRST_SHIFT_STORY.title}</h2>
                </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-zinc-300">
                {status === "completed"
                    ? "Schicht abgeschlossen. Die gesammelten Hinweise wurden an die Ermittler übergeben."
                    : currentEncounter?.summary ?? FIRST_SHIFT_STORY.briefing}
            </p>

            <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                <span>Kontrollen</span>
                <strong className="text-white">
                    {completedEncounters.length}/{FIRST_SHIFT_STORY.targetInspectionCount}
                </strong>
            </div>

            {clueIds.length > 0 && (
                <details className="mt-3 border-t border-zinc-700 pt-3">
                    <summary className="cursor-pointer text-xs font-semibold text-blue-300">
                        Ermittlungsnotizen ({clueIds.length})
                    </summary>
                    <ul className="mt-2 space-y-1 text-xs leading-4 text-zinc-300">
                        {clueIds.map((clueId) => (
                            <li key={clueId}>• {SHIFT_CLUE_LABELS[clueId]}</li>
                        ))}
                    </ul>
                </details>
            )}
        </aside>
    );
}
