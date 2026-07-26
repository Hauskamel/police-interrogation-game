import { useMemo, useState } from "react";

import { useTrafficStore } from "@stores";

// ##### Debug Tabs
// -----> Definiert die sichtbaren Reiter des Dev-Panels.
// ---> Die Tabs halten real/presented, Dokumentstatus und Rohdaten voneinander getrennt.
const DEBUG_TABS = {
    OVERVIEW: "overview",
    DOCUMENTS: "documents",
    PROFILES: "profiles",
    RAW: "raw"
};

const debugTabs = [
    { id: DEBUG_TABS.OVERVIEW, label: "Übersicht" },
    { id: DEBUG_TABS.DOCUMENTS, label: "Dokumente" },
    { id: DEBUG_TABS.PROFILES, label: "Profile" },
    { id: DEBUG_TABS.RAW, label: "Rohdaten" }
];

/**
 * ##### Vehicle Debug Panel
 * -----> Temporäres Entwickler-Panel für TrafficEntity-, Fahrer-, Fahrzeug- und Dokumentdaten.
 * ---> Der Button sitzt rechts neben den Fahrzeugoptionen; das Panel ist bewusst als Devtool gestaltet.
 */
export const VehicleDebugPanel = ({ stoppedCar }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(DEBUG_TABS.OVERVIEW);
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
        <div className="fixed bottom-6 left-[370px] z-20 flex flex-col items-start gap-3">
            {isOpen && (
                <div className="mb-2 w-[560px] max-h-[74vh] overflow-hidden rounded-xl border border-gray-500 bg-gray-900/95 text-gray-100 shadow-xl">
                    <DebugHeader selectedTrafficEntity={selectedTrafficEntity} />

                    <div className="flex gap-1 border-b border-gray-700 bg-gray-950/50 px-3 py-2">
                        {debugTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${activeTab === tab.id ? "!bg-blue-600 text-white" : "!bg-gray-700 text-gray-200"} rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:bg-gray-600 cursor-pointer`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="max-h-[60vh] overflow-auto p-4">
                        {activeTab === DEBUG_TABS.OVERVIEW && (
                            <OverviewTab selectedTrafficEntity={selectedTrafficEntity} />
                        )}

                        {activeTab === DEBUG_TABS.DOCUMENTS && (
                            <DocumentsTab
                                selectedTrafficEntity={selectedTrafficEntity}
                                driverDiffs={driverDiffs}
                                vehicleDiffs={vehicleDiffs}
                            />
                        )}

                        {activeTab === DEBUG_TABS.PROFILES && (
                            <ProfilesTab selectedTrafficEntity={selectedTrafficEntity} />
                        )}

                        {activeTab === DEBUG_TABS.RAW && (
                            <RawTab selectedTrafficEntity={selectedTrafficEntity} />
                        )}
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={`${isOpen ? "!bg-blue-600 text-white" : "!bg-gray-700 text-gray-100"} rounded-xl px-4 py-2 text-sm font-semibold shadow-lg transition hover:bg-gray-600 cursor-pointer`}
            >
                Debug Profile
            </button>
        </div>
    );
};

// ##### Debug Header
// -----> Zeigt den wichtigsten Dokumentstatus direkt oben im Panel.
// ---> So ist sofort sichtbar, ob der aktuelle Testspawn manipulierte Papiere hat.
function DebugHeader({ selectedTrafficEntity }) {
    const hasForgery = selectedTrafficEntity.documentState?.hasForgery;

    return (
        <div className="flex items-center justify-between gap-3 border-b border-gray-700 p-4">
            <div>
                <h3 className="text-sm font-bold tracking-wide text-white">Debug: Fahrer & Fahrzeugprofil</h3>
                <p className="text-xs text-gray-400">real / presented / documentState</p>
            </div>

            <span className={hasForgery ? "rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white" : "rounded bg-gray-700 px-2 py-1 text-xs font-semibold text-gray-200"}>
                {hasForgery ? "Manipuliert" : "Unverändert"}
            </span>
        </div>
    );
}

// ##### Overview Tab
// -----> Zeigt kompakte Kontrollinformationen zur aktuellen TrafficEntity.
// ---> Dieser Reiter beantwortet schnell: Wer ist gespawned und wie wird er polizeilich bewertet?
function OverviewTab({ selectedTrafficEntity }) {
    return (
        <>
            <DebugSection title="TrafficEntity">
                <DebugRow label="trafficEntityId" value={selectedTrafficEntity.trafficEntityId ?? selectedTrafficEntity.id} />
                <DebugRow label="npcId" value={selectedTrafficEntity.npcId} />
                <DebugRow label="vehicleId" value={selectedTrafficEntity.vehicleId} />
                <DebugRow label="trafficType" value={selectedTrafficEntity.trafficType} />
                <DebugRow label="source" value={selectedTrafficEntity.source} />
                <DebugRow label="stopped" value={selectedTrafficEntity.stopped} />
            </DebugSection>

            <DebugSection title="Polizei">
                <DebugRow label="status" value={selectedTrafficEntity.police?.status} />
                <DebugRow label="knownToPolice" value={selectedTrafficEntity.police?.knownToPolice} />
                <DebugRow label="wantedLevel" value={selectedTrafficEntity.police?.wantedLevel} />
                <DebugRow label="databaseNpcId" value={selectedTrafficEntity.police?.databaseNpcId} />
            </DebugSection>

            <DebugSection title="Prüfprofil">
                <DebugRow label="complexityLevel" value={selectedTrafficEntity.inspectionProfile?.complexityLevel} />
                <DebugRow label="deceptionRisk" value={selectedTrafficEntity.inspectionProfile?.deceptionRisk} />
                <DebugRow label="focusAreas" value={selectedTrafficEntity.inspectionProfile?.focusAreas} />
            </DebugSection>

            {selectedTrafficEntity.debugOverrides && (
                <DebugSection title="lil-gui Overrides">
                    <DebugJson data={selectedTrafficEntity.debugOverrides} />
                </DebugSection>
            )}
        </>
    );
}

// ##### Documents Tab
// -----> Fokussiert auf Dokumentzustand und automatisch erkannte Abweichungen.
// ---> Das ist der wichtigste Reiter zum Testen gefälschter Papiere.
function DocumentsTab({ selectedTrafficEntity, driverDiffs, vehicleDiffs }) {
    return (
        <>
            <DebugSection title="Dokumentzustand">
                <DebugJson data={selectedTrafficEntity.documentState} />
            </DebugSection>

            <DebugSection title="Abweichungen real vs. presented">
                <DebugDiffList title="Fahrer" diffs={driverDiffs} />
                <DebugDiffList title="Fahrzeug" diffs={vehicleDiffs} />
            </DebugSection>
        </>
    );
}

// ##### Profiles Tab
// -----> Zeigt Fahrer- und Fahrzeugprofil jeweils mit real und presented nebeneinander.
// ---> Gut, wenn man eine konkrete Feldmanipulation genauer prüfen möchte.
function ProfilesTab({ selectedTrafficEntity }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <DebugSection title="Fahrer real">
                <DebugJson data={selectedTrafficEntity.driverProfile?.real} />
            </DebugSection>

            <DebugSection title="Fahrer presented">
                <DebugJson data={selectedTrafficEntity.driverProfile?.presented} />
            </DebugSection>

            <DebugSection title="Fahrzeug real">
                <DebugJson data={selectedTrafficEntity.vehicleProfile?.real} />
            </DebugSection>

            <DebugSection title="Fahrzeug presented">
                <DebugJson data={selectedTrafficEntity.vehicleProfile?.presented} />
            </DebugSection>
        </div>
    );
}

// ##### Raw Tab
// -----> Zeigt die rohe TrafficEntity inklusive truth, police, profile und documentState.
// ---> Dieser Reiter ist der schnelle Komplett-Dump für hartnäckige Debugfälle.
function RawTab({ selectedTrafficEntity }) {
    return (
        <DebugSection title="TrafficEntity Raw">
            <DebugJson data={selectedTrafficEntity} />
        </DebugSection>
    );
}

// ##### Debug Section
// -----> Kleine optische Gruppe für zusammengehörige Debug-Informationen.
// ---> Hält das Panel lesbar, obwohl mehrere Datenquellen nebeneinander angezeigt werden.
function DebugSection({ title, children }) {
    return (
        <section className="mb-4 rounded-lg border border-gray-700 bg-gray-800/70 p-3 last:mb-0">
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
        <div className="grid grid-cols-[130px_1fr] gap-2 border-b border-gray-700 py-1 text-xs last:border-b-0">
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
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded bg-gray-950/80 p-2 text-xs leading-relaxed text-gray-200">
            {JSON.stringify(data, null, 2)}
        </pre>
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
