import { useMemo, useState } from "react";

import { useTrafficStore } from "@stores";

/**
 * ##### Vehicle Debug Panel
 * -----> Temporäres Entwickler-Panel für TrafficEntity-, Fahrer-, Fahrzeug- und Dokumentdaten.
 * ---> Gehört nicht ins finale Spiel und hilft vor allem beim Prüfen von real/presented-Abweichungen.
 */
export const VehicleDebugPanel = ({ stoppedCar }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedTrafficEntity = useTrafficStore(state => state.selectedTrafficEntity);

    const driverDiffs = useMemo(() => {
        return getProfileDifferences(
            selectedTrafficEntity?.driverProfile?.real,
            selectedTrafficEntity?.driverProfile?.presented
        );
    }, [selectedTrafficEntity]);

    const vehicleDiffs = useMemo(() => {
        return getProfileDifferences(
            selectedTrafficEntity?.vehicleProfile?.real,
            selectedTrafficEntity?.vehicleProfile?.presented
        );
    }, [selectedTrafficEntity]);

    if (!stoppedCar || stoppedCar.id !== selectedTrafficEntity?.id) return;

    return (
        <div className="fixed bottom-5 left-5 z-20 flex flex-col items-start gap-3">
            {isOpen && (
                <div className="w-[420px] max-h-[72vh] overflow-auto rounded-xl border border-gray-500 bg-gray-900/95 p-4 text-gray-100 shadow-xl">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-bold tracking-wide text-white">Debug: Fahrer & Fahrzeugprofil</h3>
                            <p className="text-xs text-gray-400">real / presented / documentState</p>
                        </div>

                        <span className={selectedTrafficEntity.documentState?.hasForgery ? "rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white" : "rounded bg-gray-700 px-2 py-1 text-xs font-semibold text-gray-200"}>
                            {selectedTrafficEntity.documentState?.hasForgery ? "Manipuliert" : "Unverändert"}
                        </span>
                    </div>

                    <DebugSection title="TrafficEntity">
                        <DebugRow label="trafficEntityId" value={selectedTrafficEntity.trafficEntityId ?? selectedTrafficEntity.id} />
                        <DebugRow label="npcId" value={selectedTrafficEntity.npcId} />
                        <DebugRow label="vehicleId" value={selectedTrafficEntity.vehicleId} />
                        <DebugRow label="trafficType" value={selectedTrafficEntity.trafficType} />
                        <DebugRow label="source" value={selectedTrafficEntity.source} />
                        <DebugRow label="stopped" value={selectedTrafficEntity.stopped} />
                    </DebugSection>

                    <DebugSection title="Polizei & Wahrheit">
                        <DebugJson data={{
                            truth: selectedTrafficEntity.truth,
                            police: selectedTrafficEntity.police,
                            inspectionProfile: selectedTrafficEntity.inspectionProfile
                        }} />
                    </DebugSection>

                    <DebugSection title="Dokumentzustand">
                        <DebugJson data={selectedTrafficEntity.documentState} />
                    </DebugSection>

                    <DebugSection title="Abweichungen">
                        <DebugDiffList title="Fahrer" diffs={driverDiffs} />
                        <DebugDiffList title="Fahrzeug" diffs={vehicleDiffs} />
                    </DebugSection>

                    <DebugSection title="Fahrerprofil">
                        <DebugProfileCompare
                            real={selectedTrafficEntity.driverProfile?.real}
                            presented={selectedTrafficEntity.driverProfile?.presented}
                        />
                    </DebugSection>

                    <DebugSection title="Fahrzeugprofil">
                        <DebugProfileCompare
                            real={selectedTrafficEntity.vehicleProfile?.real}
                            presented={selectedTrafficEntity.vehicleProfile?.presented}
                        />
                    </DebugSection>
                </div>
            )}

            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={`${isOpen ? "!bg-blue-600 text-white" : "!bg-gray-700 text-gray-100"} rounded-xl px-4 py-2 text-sm font-semibold shadow-lg transition hover:bg-gray-600 cursor-pointer`}
            >
                Debug Profile
            </button>
        </div>
    )
}

// ##### Debug Section
// -----> Kleine optische Gruppe für zusammengehörige Debug-Informationen.
// ---> Hält das Panel lesbar, obwohl mehrere Datenquellen nebeneinander angezeigt werden.
function DebugSection({ title, children }) {
    return (
        <section className="mb-4 rounded-lg border border-gray-700 bg-gray-800/70 p-3">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-300">{title}</h4>
            {children}
        </section>
    );
}

// ##### Debug Row
// -----> Zeigt einfache Key/Value-Werte wie IDs, Status oder Spawnquelle.
// ---> Wird für Werte genutzt, die in JSON-Blöcken schnell untergehen würden.
function DebugRow({ label, value }) {
    return (
        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-gray-700 py-1 text-xs last:border-b-0">
            <span className="text-gray-400">{label}</span>
            <span className="break-all text-gray-100">{formatDebugValue(value)}</span>
        </div>
    );
}

// ##### Debug JSON
// -----> Rendert verschachtelte Debug-Daten kompakt als lesbaren JSON-Block.
// ---> Gut für documentState, truth, police und inspectionProfile.
function DebugJson({ data }) {
    return (
        <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded bg-gray-950/80 p-2 text-xs leading-relaxed text-gray-200">
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}

// ##### Profile Compare
// -----> Zeigt real und presented direkt nebeneinander als Rohdaten.
// ---> Das ist bewusst technisch, weil dieses Panel nur fürs Debugging gedacht ist.
function DebugProfileCompare({ real, presented }) {
    return (
        <div className="grid gap-2 text-xs">
            <div>
                <p className="mb-1 font-semibold text-gray-300">real</p>
                <DebugJson data={real} />
            </div>
            <div>
                <p className="mb-1 font-semibold text-gray-300">presented</p>
                <DebugJson data={presented} />
            </div>
        </div>
    );
}

// ##### Debug Diff List
// -----> Zeigt automatisch erkannte Unterschiede zwischen real und presented.
// ---> Besonders hilfreich, um Dokumentmanipulationen sofort in der UI zu validieren.
function DebugDiffList({ title, diffs }) {
    return (
        <div className="mb-3 last:mb-0">
            <p className="mb-1 text-xs font-semibold text-gray-300">{title}</p>
            {diffs.length === 0 ? (
                <p className="text-xs text-gray-500">Keine Abweichungen erkannt.</p>
            ) : (
                <div className="space-y-2">
                    {diffs.map(diff => (
                        <div key={diff.path} className="rounded bg-gray-950/70 p-2 text-xs">
                            <p className="font-semibold text-blue-300">{diff.path}</p>
                            <p className="break-all text-gray-400">real: {formatDebugValue(diff.real)}</p>
                            <p className="break-all text-gray-200">presented: {formatDebugValue(diff.presented)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ##### Profile Difference Collector
// -----> Durchläuft zwei Profile rekursiv und sammelt Feldabweichungen.
// ---> Arrays werden als JSON-Werte verglichen, weil sie hier nur ID-Listen enthalten.
function getProfileDifferences(real, presented, path = "") {
    if (!isComparableObject(real) || !isComparableObject(presented)) {
        return isSameDebugValue(real, presented)
            ? []
            : [{ path: path || "value", real, presented }];
    }

    const keys = Array.from(new Set([
        ...Object.keys(real ?? {}),
        ...Object.keys(presented ?? {})
    ]));

    return keys.flatMap(key => {
        const nextPath = path ? `${path}.${key}` : key;
        return getProfileDifferences(real?.[key], presented?.[key], nextPath);
    });
}

// ##### Comparable Object Check
// -----> Prüft, ob ein Wert als verschachteltes Objekt weiter durchsucht werden soll.
// ---> Arrays werden nicht rekursiv zerlegt, damit documentIds kompakt bleiben.
function isComparableObject(value) {
    return Boolean(value)
        && typeof value === "object"
        && !Array.isArray(value);
}

// ##### Debug Value Compare
// -----> Vergleicht einfache Werte und Arrays stabil über JSON.
// ---> Für Debug-Zwecke reicht das aus und hält die Diff-Logik klein.
function isSameDebugValue(left, right) {
    return JSON.stringify(left) === JSON.stringify(right);
}

// ##### Debug Value Formatter
// -----> Macht Booleans, null und undefined im Panel eindeutig sichtbar.
// ---> Ohne Formatter wären manche Werte leer und dadurch beim Debugging missverständlich.
function formatDebugValue(value) {
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "object") return JSON.stringify(value);

    return value;
}
