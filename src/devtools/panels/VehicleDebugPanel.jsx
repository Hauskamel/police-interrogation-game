import { useEffect, useMemo, useState } from "react";

import { useTrafficStore } from "@stores";

import { PoliceDatabaseDebugPanelContent } from "./PoliceDatabaseDebugPanelContent.jsx";

// ##### Debug Panel Types
// -----> Steuert, welches der beiden unabhängigen Debug-Panels geöffnet ist.
// ---> Es bleibt immer nur ein Panel sichtbar, damit sie sich nicht überlagern.
const DEBUG_PANELS = {
    PROFILE: "profile",
    POLICE_DATABASE: "policeDatabase"
};

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
    const [activePanel, setActivePanel] = useState(null);
    const [activeTab, setActiveTab] = useState(DEBUG_TABS.OVERVIEW);
    const selectedTrafficEntity = useTrafficStore(state => state.selectedTrafficEntity);
    const canOpenProfile = Boolean(
        stoppedCar
        && stoppedCar.id === selectedTrafficEntity?.id
    );

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

    // Schließt nur das fahrzeugbezogene Panel, wenn kein angehaltener NPC mehr ausgewählt ist.
    // Die Polizei-Datenbank bleibt unabhängig von der aktuellen Verkehrskontrolle verfügbar.
    useEffect(() => {
        if (!canOpenProfile && activePanel === DEBUG_PANELS.PROFILE) {
            setActivePanel(null);
        }
    }, [activePanel, canOpenProfile]);

    return (
        <div className="fixed bottom-6 left-[370px] z-20 flex flex-col items-start gap-3">
            {activePanel && (
                <div className="fixed bottom-20 left-6 w-[680px] max-w-[calc(100vw-3rem)] max-h-[78vh] overflow-hidden rounded-lg border border-gray-500 bg-gray-900/95 text-gray-100 shadow-xl">
                    {activePanel === DEBUG_PANELS.PROFILE && canOpenProfile && (
                        <>
                            <DebugHeader selectedTrafficEntity={selectedTrafficEntity} />

                            <div className="flex gap-1 border-b border-gray-700 bg-gray-950/50 px-3 py-2">
                                {debugTabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`${activeTab === tab.id ? "!bg-blue-600 text-white" : "!bg-gray-700 text-gray-200"} rounded px-3 py-1.5 text-xs font-semibold transition hover:bg-gray-600 cursor-pointer`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="max-h-[64vh] overflow-auto p-4">
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
                        </>
                    )}

                    {activePanel === DEBUG_PANELS.POLICE_DATABASE && (
                        <PoliceDatabaseDebugPanelContent />
                    )}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={() => setActivePanel((currentPanel) =>
                        currentPanel === DEBUG_PANELS.PROFILE
                            ? null
                            : DEBUG_PANELS.PROFILE
                    )}
                    disabled={!canOpenProfile}
                    className={`${activePanel === DEBUG_PANELS.PROFILE ? "!bg-blue-600 text-white" : "!bg-gray-700 text-gray-100"} rounded px-4 py-2 text-sm font-semibold shadow-lg transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer`}
                    title={canOpenProfile ? "Fahrer- und Fahrzeugdaten öffnen" : "Dafür muss ein angehaltener NPC ausgewählt sein"}
                >
                    Debug Profile
                </button>

                <button
                    onClick={() => setActivePanel((currentPanel) =>
                        currentPanel === DEBUG_PANELS.POLICE_DATABASE
                            ? null
                            : DEBUG_PANELS.POLICE_DATABASE
                    )}
                    className={`${activePanel === DEBUG_PANELS.POLICE_DATABASE ? "!bg-blue-600 text-white" : "!bg-gray-700 text-gray-100"} rounded px-4 py-2 text-sm font-semibold shadow-lg transition hover:bg-gray-600 cursor-pointer`}
                >
                    Polizei-Datenbank
                </button>
            </div>
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
    const realDriver = selectedTrafficEntity.driverProfile?.real;
    const presentedDriver = selectedTrafficEntity.driverProfile?.presented;
    const realOwner = selectedTrafficEntity.vehicleOwnerProfile?.real;
    const presentedOwner = selectedTrafficEntity.vehicleOwnerProfile?.presented;
    const realVehicle = selectedTrafficEntity.vehicleProfile?.real;
    const presentedVehicle = selectedTrafficEntity.vehicleProfile?.presented;

    return (
        <>
            <DebugSection title="TrafficEntity">
                <DebugRow label="trafficEntityId" value={selectedTrafficEntity.trafficEntityId ?? selectedTrafficEntity.id} />
                <DebugRow label="npcId" value={selectedTrafficEntity.npcId} />
                <DebugRow label="vehicleId" value={selectedTrafficEntity.vehicleId} />
                <DebugRow label="trafficType" value={selectedTrafficEntity.trafficType} />
                <DebugRow label="stopped" value={selectedTrafficEntity.stopped} />
            </DebugSection>

            <div className="grid grid-cols-2 gap-3">
                <DebugSection title="Fahrer - real">
                    <NpcIdentityRows profile={realDriver} />
                </DebugSection>

                <DebugSection title="Fahrer - presented">
                    <NpcIdentityRows profile={presentedDriver} />
                </DebugSection>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <DebugSection title="Führerschein - real">
                    <DriversLicenseRows profile={realDriver} />
                </DebugSection>

                <DebugSection title="Führerschein - presented">
                    <DriversLicenseRows profile={presentedDriver} />
                </DebugSection>
            </div>

            <DebugSection title="Fahrzeughalter">
                <DebugRow label="registeredOwnerNpcId" value={selectedTrafficEntity.ownership?.registeredOwnerNpcId} />
                <DebugRow label="driverIsRegisteredOwner" value={selectedTrafficEntity.ownership?.driverIsRegisteredOwner} />
                <DebugRow label="realName" value={formatNpcName(realOwner)} />
                <DebugRow label="realAddress" value={realOwner?.address} />
                <DebugRow label="presentedName" value={formatNpcName(presentedOwner)} />
                <DebugRow label="presentedAddress" value={presentedOwner?.address} />
            </DebugSection>

            <div className="grid grid-cols-2 gap-3">
                <DebugSection title="Fahrzeug - real">
                    <VehicleSummaryRows profile={realVehicle} />
                </DebugSection>

                <DebugSection title="Fahrzeug - presented">
                    <VehicleSummaryRows profile={presentedVehicle} />
                </DebugSection>
            </div>

            <DebugSection title="Interne Fallwahrheit">
                <DebugRow label="role" value={selectedTrafficEntity.truth?.role} />
                <DebugRow label="crimeRecordIds" value={selectedTrafficEntity.truth?.crimeRecordIds} />
                <DebugRow label="caseIds" value={selectedTrafficEntity.truth?.caseIds} />
                <DebugRow label="hiddenCrimeCount" value={selectedTrafficEntity.truth?.hiddenCrimeRecords?.length ?? 0} />
            </DebugSection>

            <DebugSection title="Polizei">
                <DebugRow label="status" value={selectedTrafficEntity.police?.status} />
                <DebugRow label="knownToPolice" value={selectedTrafficEntity.police?.knownToPolice} />
                <DebugRow label="wantedLevel" value={selectedTrafficEntity.police?.wantedLevel} />
                <DebugRow label="databaseNpcId" value={selectedTrafficEntity.police?.databaseNpcId} />
                <DebugRow label="wantedRecordId" value={selectedTrafficEntity.police?.wantedRecordId} />
            </DebugSection>

            <DebugSection title="Dokumentstatus">
                <DebugRow label="hasForgery" value={selectedTrafficEntity.documentState?.hasForgery} />
                <DebugRow label="driversLicenseIntegrity" value={selectedTrafficEntity.documentState?.npcDocuments?.driversLicense?.integrity} />
                <DebugRow label="driversLicenseForgery" value={selectedTrafficEntity.documentState?.npcDocuments?.driversLicense?.forgeryType} />
                <DebugRow label="registrationIntegrity" value={selectedTrafficEntity.documentState?.vehicleDocuments?.registration?.integrity} />
                <DebugRow label="registrationForgery" value={selectedTrafficEntity.documentState?.vehicleDocuments?.registration?.forgeryType} />
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

// ##### NPC Identity Rows
// -----> Zeigt die spielrelevanten Stammdaten eines real- oder presented-Profils.
// ---> Derselbe Aufbau auf beiden Seiten macht manipulierte Angaben direkt vergleichbar.
function NpcIdentityRows({ profile }) {
    return (
        <>
            <DebugRow label="npcId" value={profile?.npcId} />
            <DebugRow label="firstName" value={profile?.firstName} />
            <DebugRow label="lastName" value={profile?.lastName} />
            <DebugRow label="address" value={profile?.address} />
            <DebugRow label="birthDate" value={profile?.birthDate} />
            <DebugRow label="age" value={profile?.age} />
            <DebugRow label="sex" value={profile?.sex} />
            <DebugRow label="height" value={profile?.height} />
            <DebugRow label="hairColor" value={profile?.hairColor} />
            <DebugRow label="eyeColor" value={profile?.eyeColor} />
        </>
    );
}

// ##### Drivers License Rows
// -----> Zeigt Führerscheindaten separat von den allgemeinen Personenstammdaten.
function DriversLicenseRows({ profile }) {
    return (
        <>
            <DebugRow label="licenseNumber" value={profile?.driversLicense?.licenseNumber} />
            <DebugRow label="issueDate" value={profile?.driversLicense?.issueDate} />
            <DebugRow label="expiryDate" value={profile?.driversLicense?.expiryDate} />
            <DebugRow label="documentIds" value={profile?.documentIds} />
        </>
    );
}

// ##### Vehicle Summary Rows
// -----> Zeigt sichtbare Fahrzeug- und Registrierungsdaten für real/presented-Vergleiche.
function VehicleSummaryRows({ profile }) {
    return (
        <>
            <DebugRow label="vehicleId" value={profile?.vehicleId} />
            <DebugRow label="registeredOwnerNpcId" value={profile?.registeredOwnerNpcId} />
            <DebugRow label="brand" value={profile?.brand} />
            <DebugRow label="model" value={profile?.model} />
            <DebugRow label="plateNumber" value={profile?.carDocumentsData?.plateNumber} />
            <DebugRow label="registrationNumber" value={profile?.carDocumentsData?.carRegistrationNumber} />
            <DebugRow label="registrationIssueDate" value={profile?.carDocumentsData?.formattedIssueDate} />
            <DebugRow label="yearOfConstruction" value={profile?.yearOfConstruction} />
            <DebugRow label="ps" value={profile?.ps} />
            <DebugRow label="weight" value={profile?.weight} />
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

            <DebugSection title="Fahrzeughalter real">
                <DebugJson data={selectedTrafficEntity.vehicleOwnerProfile?.real} />
            </DebugSection>

            <DebugSection title="Fahrzeughalter presented">
                <DebugJson data={selectedTrafficEntity.vehicleOwnerProfile?.presented} />
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

// ##### NPC Name Formatter
// -----> Erstellt für Fahrer- und Halterinformationen einen kompakten Anzeigenamen.
function formatNpcName(profile) {
    return [profile?.firstName, profile?.lastName]
        .filter(Boolean)
        .join(" ");
}
