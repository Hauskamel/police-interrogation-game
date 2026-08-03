import { useEffect, useState } from "react";
import { FaCalendarDay } from "react-icons/fa6";

import { formatDateForDisplay, getCurrentGameDate } from "@game/shared";


// ##### Game Date Display
// -----> Zeigt den aktuellen Spieltag dauerhaft in der regulaeren Spieloberflaeche an.
// ---> Verwendet dieselbe zentrale Spieluhr wie Dokumente, Register und Kontrollsessions.
export function GameDateDisplay() {
    const [gameDate, setGameDate] = useState(() => getCurrentGameDate());

    useEffect(() => {
        const updateInterval = window.setInterval(() => {
            setGameDate(getCurrentGameDate());
        }, 60_000);

        return () => {
            window.clearInterval(updateInterval);
        };
    }, []);

    return (
        <div
            className="fixed left-1/2 top-4 z-[700] flex -translate-x-1/2 items-center gap-3 rounded-md border border-zinc-700 bg-zinc-900/95 px-4 py-3 text-left text-white shadow-lg sm:top-6"
            aria-label={`Aktueller Spieltag: ${formatDateForDisplay(gameDate)}`}
        >
            <FaCalendarDay className="text-base text-blue-400" aria-hidden="true" />
            <div>
                <p className="text-[10px] font-semibold uppercase text-zinc-400">
                    Spieltag
                </p>
                <time
                    className="block text-sm font-semibold tabular-nums"
                    dateTime={gameDate.toISOString().split("T")[0]}
                >
                    {formatDateForDisplay(gameDate)}
                </time>
            </div>
        </div>
    );
}
