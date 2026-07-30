import { createElement } from "react";
import {
    FaArrowRight,
    FaBullhorn,
    FaDatabase,
    FaShieldHalved,
    FaUserGroup
} from "react-icons/fa6";

import { useNpcStore } from "@stores";

// ##### Laptop Home Screen
// -----> Zeigt einen knappen Systemstatus und führt in die spielbare Datenbank.
// ---> Alle Kennzahlen stammen ausschließlich aus dem freigegebenen Polizeibestand.
export function HomeScreen({ onOpenDatabase }) {
    const criminalDatabase = useNpcStore((state) => state.criminalDatabase);
    const personCount = criminalDatabase.criminalNpcIds.length;
    const vehicleCount = criminalDatabase.vehicleIds?.length ?? 0;
    const activeWantedCount = criminalDatabase.wantedRecordIds.filter((recordId) => {
        return criminalDatabase.wantedRecordsById[recordId]?.status === "active";
    }).length;

    const currentDate = new Intl.DateTimeFormat("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(new Date());

    return (
        <div className="h-full overflow-y-auto">
            <header className="border-b border-zinc-200 bg-white px-6 py-5 lg:px-10">
                <p className="text-sm capitalize text-zinc-500">{currentDate}</p>
                <h1 className="mt-1 !text-2xl font-semibold tracking-normal text-zinc-950">
                    Dienstübersicht
                </h1>
            </header>

            <div className="mx-auto max-w-6xl space-y-8 px-6 py-8 lg:px-10">
                <section className="border-l-4 border-blue-700 bg-white px-6 py-5 shadow-sm">
                    <div className="flex items-start gap-4">
                        <FaShieldHalved className="mt-1 shrink-0 text-xl text-blue-700" aria-hidden="true" />
                        <div>
                            <h2 className="font-semibold text-zinc-950">Zugriff: Polizeibestand</h2>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-600">
                                Das Terminal zeigt nur bereits erfasste Personen, Fahndungen,
                                Straftaten und registrierte Fahrzeuge. Interne Weltinformationen
                                sind nicht Bestandteil dieser Anwendung.
                            </p>
                        </div>
                    </div>
                </section>

                <section aria-labelledby="database-status-title">
                    <div className="mb-3 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase text-blue-700">Systemstatus</p>
                            <h2 id="database-status-title" className="mt-1 text-lg font-semibold">
                                Zentraler Datenbestand
                            </h2>
                        </div>
                        <span className="flex items-center gap-2 text-xs text-emerald-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Online
                        </span>
                    </div>

                    <div className="grid gap-px overflow-hidden rounded-md border border-zinc-200 bg-zinc-200 sm:grid-cols-3">
                        <StatusValue icon={FaUserGroup} label="Bekannte Personen" value={personCount} />
                        <StatusValue icon={FaBullhorn} label="Aktive Fahndungen" value={activeWantedCount} />
                        <StatusValue icon={FaDatabase} label="Registrierte Fahrzeuge" value={vehicleCount} />
                    </div>
                </section>

                <section className="flex flex-col items-start justify-between gap-5 border-t border-zinc-300 pt-6 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="font-semibold text-zinc-950">Datenbankabfrage starten</h2>
                        <p className="mt-1 text-sm text-zinc-600">
                            Suche nach Personen, Führerscheinen oder Kennzeichen.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="flex items-center gap-3 rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                        onClick={onOpenDatabase}
                    >
                        Datenbank öffnen
                        <FaArrowRight aria-hidden="true" />
                    </button>
                </section>
            </div>
        </div>
    );
}

// ##### Status Value
// -----> Stellt eine einzelne Datenbank-Kennzahl ohne zusätzliche Interaktion dar.
function StatusValue({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4 bg-white px-5 py-5">
            {createElement(icon, {
                className: "shrink-0 text-lg text-zinc-500",
                "aria-hidden": true
            })}
            <div>
                <p className="text-2xl font-semibold text-zinc-950">{value}</p>
                <p className="text-xs text-zinc-500">{label}</p>
            </div>
        </div>
    );
}
