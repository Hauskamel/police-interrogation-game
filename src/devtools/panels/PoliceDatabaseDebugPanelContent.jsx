import { useMemo, useState } from "react";

import { useNpcStore } from "@stores";

// ##### Police Database Tabs
// -----> Trennt Kennzahlen, Fahndungsliste und die einzelnen Datenbanktabellen.
const DATABASE_TABS = {
    OVERVIEW: "overview",
    WANTED: "wanted",
    NPCS: "npcs",
    CRIMES: "crimes",
    DOCUMENTS: "documents"
};

const databaseTabs = [
    { id: DATABASE_TABS.OVERVIEW, label: "Übersicht" },
    { id: DATABASE_TABS.WANTED, label: "Fahndungsliste" },
    { id: DATABASE_TABS.NPCS, label: "NPCs" },
    { id: DATABASE_TABS.CRIMES, label: "Straftaten" },
    { id: DATABASE_TABS.DOCUMENTS, label: "Dokumente" }
];

/**
 * ##### Police Database Debug Panel Content
 * -----> Zeigt den aktuellen Zustand der beim Spielstart generierten Polizei-Datenbank.
 * ---> Der Inhalt liest direkt aus dem NPC-Store und reagiert automatisch auf Datenänderungen.
 */
export function PoliceDatabaseDebugPanelContent() {
    const [activeTab, setActiveTab] = useState(DATABASE_TABS.OVERVIEW);
    const criminalDatabase = useNpcStore(state => state.criminalDatabase);

    const databaseTables = useMemo(() => ({
        npcs: Object.values(criminalDatabase.npcsById ?? {}),
        crimes: Object.values(criminalDatabase.crimeRecordsById ?? {}),
        documents: Object.values(criminalDatabase.documentsById ?? {}),
        wantedRecords: Object.values(criminalDatabase.wantedRecordsById ?? {})
    }), [criminalDatabase]);

    return (
        <>
            <div className="flex items-center justify-between gap-3 border-b border-gray-700 p-4">
                <div>
                    <h3 className="text-sm font-bold text-white">Debug: Polizei-Datenbank</h3>
                    <p className="text-xs text-gray-400">NPCs, Fahndungen, Straftaten und Dokumente</p>
                </div>

                <span className="rounded bg-gray-700 px-2 py-1 text-xs font-semibold text-gray-200">
                    {databaseTables.npcs.length} NPCs
                </span>
            </div>

            <div className="flex flex-wrap gap-1 border-b border-gray-700 bg-gray-950/50 px-3 py-2">
                {databaseTabs.map(tab => (
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
                {activeTab === DATABASE_TABS.OVERVIEW && (
                    <DatabaseOverview
                        criminalDatabase={criminalDatabase}
                        databaseTables={databaseTables}
                    />
                )}

                {activeTab === DATABASE_TABS.WANTED && (
                    <WantedNpcList
                        wantedRecords={databaseTables.wantedRecords}
                        npcsById={criminalDatabase.npcsById ?? {}}
                    />
                )}

                {activeTab === DATABASE_TABS.NPCS && (
                    <DatabaseRecordList
                        emptyMessage="Keine NPC-Datensätze vorhanden."
                        records={databaseTables.npcs}
                        getRecordTitle={getNpcTitle}
                    />
                )}

                {activeTab === DATABASE_TABS.CRIMES && (
                    <DatabaseRecordList
                        emptyMessage="Keine Straftaten vorhanden."
                        records={databaseTables.crimes}
                        getRecordTitle={(record) => record.title ?? record.type ?? record.id}
                    />
                )}

                {activeTab === DATABASE_TABS.DOCUMENTS && (
                    <DatabaseRecordList
                        emptyMessage="Keine Dokumente vorhanden."
                        records={databaseTables.documents}
                        getRecordTitle={(record) => record.id ?? "Dokument"}
                    />
                )}
            </div>
        </>
    );
}

// ##### Database Overview
// -----> Zeigt die Größe und Verknüpfungen der einzelnen In-Memory-Tabellen.
function DatabaseOverview({ criminalDatabase, databaseTables }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <DatabaseStat label="NPC-Datensätze" value={databaseTables.npcs.length} />
            <DatabaseStat label="Kriminelle NPCs" value={(criminalDatabase.criminalNpcIds ?? []).length} />
            <DatabaseStat label="Bekannt, nicht gesucht" value={(criminalDatabase.knownOffenderNpcIds ?? []).length} />
            <DatabaseStat label="Fahndungsrecords" value={databaseTables.wantedRecords.length} />
            <DatabaseStat label="Straftaten" value={databaseTables.crimes.length} />
            <DatabaseStat label="Dokumente" value={databaseTables.documents.length} />
        </div>
    );
}

// ##### Wanted NPC List
// -----> Löst die IDs der Fahndungsliste zu den zugehörigen NPC-Datensätzen auf.
// ---> Fehlende Referenzen werden sichtbar markiert, damit Datenbankfehler schnell auffallen.
function WantedNpcList({ wantedRecords, npcsById }) {
    if (wantedRecords.length === 0) {
        return <EmptyDatabaseMessage message="Die Fahndungsliste ist leer." />;
    }

    return (
        <div className="space-y-2">
            {wantedRecords.map((wantedRecord) => {
                const npc = npcsById[wantedRecord.npcId];

                return (
                    <details key={wantedRecord.id} className="rounded border border-gray-700 bg-gray-800/70 p-3">
                        <summary className="cursor-pointer text-xs font-semibold text-gray-100">
                            {npc ? `${getNpcTitle(npc)} - ${wantedRecord.status}` : `Fehlende NPC-Referenz: ${wantedRecord.npcId}`}
                        </summary>
                        <DebugJson data={{
                            wantedRecord,
                            npc: npc ?? {
                                npcId: wantedRecord.npcId,
                                referenceMissing: true
                            }
                        }} />
                    </details>
                );
            })}
        </div>
    );
}

// ##### Database Record List
// -----> Rendert beliebige Datenbanktabellen als einklappbare JSON-Datensätze.
function DatabaseRecordList({ records, getRecordTitle, emptyMessage }) {
    if (records.length === 0) {
        return <EmptyDatabaseMessage message={emptyMessage} />;
    }

    return (
        <div className="space-y-2">
            {records.map((record, index) => (
                <details
                    key={record.id ?? record.real?.npcId ?? index}
                    className="rounded border border-gray-700 bg-gray-800/70 p-3"
                >
                    <summary className="cursor-pointer text-xs font-semibold text-gray-100">
                        {getRecordTitle(record)}
                    </summary>
                    <DebugJson data={record} />
                </details>
            ))}
        </div>
    );
}

// ##### NPC Debug Title
// -----> Erstellt eine lesbare Beschriftung aus dem real-Profil des Datenbank-NPCs.
function getNpcTitle(npc) {
    const real = npc.real ?? {};
    const fullName = [real.firstName, real.lastName].filter(Boolean).join(" ");

    return fullName || real.npcId || "Unbenannter NPC";
}

// ##### Database Stat
// -----> Stellt eine einzelne Datenbank-Kennzahl kompakt dar.
function DatabaseStat({ label, value }) {
    return (
        <div className="rounded border border-gray-700 bg-gray-800/70 p-3">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="mt-1 text-xl font-bold text-white">{value}</p>
        </div>
    );
}

// ##### Empty Database Message
// -----> Macht leere Tabellen als gültigen Zustand eindeutig sichtbar.
function EmptyDatabaseMessage({ message }) {
    return (
        <p className="rounded border border-gray-700 bg-gray-800/70 p-3 text-xs text-gray-400">
            {message}
        </p>
    );
}

// ##### Database Debug JSON
// -----> Zeigt den vollständigen Record unterhalb seiner lesbaren Zusammenfassung.
function DebugJson({ data }) {
    return (
        <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded bg-gray-950/80 p-2 text-xs leading-relaxed text-gray-200">
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}
