import { createElement, useMemo } from "react";
import {
    FaBullhorn,
    FaCar,
    FaFileCircleExclamation,
    FaIdCard,
    FaMagnifyingGlass,
    FaUser
} from "react-icons/fa6";

import { BaseImage } from "@game/documents/components/base";
import {
    POLICE_DATABASE_SEARCH_TYPES,
    POLICE_DATABASE_SECTIONS,
    useNpcStore,
    usePoliceLaptopStore
} from "@stores";

import {
    getActiveWantedRecordForNpc,
    getActiveWantedRecords,
    getCrimeRecordsForNpc,
    getVehiclesForNpc,
    searchDriverLicenses,
    searchPeople,
    searchVehicles
} from "./policeDatabaseSearch.js";

const searchTypeConfiguration = {
    [POLICE_DATABASE_SEARCH_TYPES.PERSON]: {
        label: "Person",
        placeholder: "Name, Adresse oder Personen-ID",
        icon: FaUser
    },
    [POLICE_DATABASE_SEARCH_TYPES.LICENSE]: {
        label: "Führerschein",
        placeholder: "Führerscheinnummer",
        icon: FaIdCard
    },
    [POLICE_DATABASE_SEARCH_TYPES.PLATE]: {
        label: "Kennzeichen",
        placeholder: "Kennzeichen oder Zulassungsnummer",
        icon: FaCar
    }
};

// ##### Police Database Screen
// -----> Spielbare Suche für Personen, Führerscheine, Kennzeichen und aktive Fahndungen.
// ---> Der Screen liest ausschließlich die polizeiliche criminalDatabase aus dem NPC Store.
export function PoliceDatabaseScreen() {
    const criminalDatabase = useNpcStore((state) => state.criminalDatabase);
    const {
        activeSection,
        query,
        searchType,
        selection
    } = usePoliceLaptopStore((state) => state.database);
    const setDatabaseQuery = usePoliceLaptopStore(
        (state) => state.setDatabaseQuery
    );
    const setDatabaseSection = usePoliceLaptopStore(
        (state) => state.setDatabaseSection
    );
    const setDatabaseSearchType = usePoliceLaptopStore(
        (state) => state.setDatabaseSearchType
    );
    const setDatabaseSelection = usePoliceLaptopStore(
        (state) => state.setDatabaseSelection
    );

    const results = useMemo(() => {
        if (activeSection === POLICE_DATABASE_SECTIONS.WANTED) {
            return getActiveWantedRecords(criminalDatabase);
        }

        if (searchType === POLICE_DATABASE_SEARCH_TYPES.LICENSE) {
            return searchDriverLicenses(criminalDatabase, query);
        }

        if (searchType === POLICE_DATABASE_SEARCH_TYPES.PLATE) {
            return searchVehicles(criminalDatabase, query);
        }

        return searchPeople(criminalDatabase, query);
    }, [activeSection, criminalDatabase, query, searchType]);

    const changeSection = (section) => {
        setDatabaseSection(section);
    };

    const changeSearchType = (type) => {
        setDatabaseSearchType(type);
    };

    return (
        <div className="flex h-full min-h-0 flex-col bg-zinc-100">
            <header className="shrink-0 border-b border-zinc-200 bg-white px-5 py-4 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase text-blue-700">
                            Polizeilicher Datenbestand
                        </p>
                        <h1 className="mt-1 !text-xl font-semibold tracking-normal text-zinc-950">
                            Zentrales Polizeiregister
                        </h1>
                    </div>
                    <span className="rounded border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                        Verbindung geschützt
                    </span>
                </div>

                <div className="mt-4 flex gap-6 border-b border-zinc-200">
                    <SectionButton
                        active={activeSection === POLICE_DATABASE_SECTIONS.SEARCH}
                        icon={FaMagnifyingGlass}
                        label="Suche"
                        onClick={() => {
                            changeSection(POLICE_DATABASE_SECTIONS.SEARCH);
                        }}
                    />
                    <SectionButton
                        active={activeSection === POLICE_DATABASE_SECTIONS.WANTED}
                        icon={FaBullhorn}
                        label="Fahndungsliste"
                        onClick={() => {
                            changeSection(POLICE_DATABASE_SECTIONS.WANTED);
                        }}
                    />
                </div>
            </header>

            {activeSection === POLICE_DATABASE_SECTIONS.SEARCH && (
                <SearchToolbar
                    query={query}
                    searchType={searchType}
                    onQueryChange={(event) => {
                        setDatabaseQuery(event.target.value);
                    }}
                    onSearchTypeChange={changeSearchType}
                />
            )}

            <div className="grid min-h-0 flex-1 lg:grid-cols-[340px_minmax(0,1fr)]">
                <ResultsList
                    activeSection={activeSection}
                    query={query}
                    results={results}
                    searchType={searchType}
                    selection={selection}
                    onSelect={setDatabaseSelection}
                />
                <RecordDetails
                    criminalDatabase={criminalDatabase}
                    selection={selection}
                    onSelect={setDatabaseSelection}
                />
            </div>
        </div>
    );
}

// ##### Section Button
// -----> Wechselt zwischen freier Datenbanksuche und aktiver Fahndungsliste.
function SectionButton({ active, icon, label, onClick }) {
    return (
        <button
            type="button"
            className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold ${
                active
                    ? "border-blue-700 text-blue-700"
                    : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
            onClick={onClick}
        >
            {createElement(icon, { "aria-hidden": true })}
            {label}
        </button>
    );
}

// ##### Search Toolbar
// -----> Legt zuerst die Datenart und danach den konkreten Suchbegriff fest.
function SearchToolbar({
    query,
    searchType,
    onQueryChange,
    onSearchTypeChange
}) {
    const searchConfiguration = searchTypeConfiguration[searchType];

    return (
        <div className="shrink-0 border-b border-zinc-200 bg-zinc-50 px-5 py-4 lg:px-8">
            <div className="flex flex-col gap-3 xl:flex-row">
                <div className="flex shrink-0 overflow-hidden rounded-md border border-zinc-300 bg-white">
                    {Object.entries(searchTypeConfiguration).map(([type, configuration]) => {
                        return (
                            <button
                                key={type}
                                type="button"
                                className={`flex items-center gap-2 px-3 py-2 text-sm ${
                                    searchType === type
                                        ? "bg-zinc-800 text-white"
                                        : "text-zinc-600 hover:bg-zinc-100"
                                }`}
                                onClick={() => onSearchTypeChange(type)}
                            >
                                {createElement(configuration.icon, {
                                    "aria-hidden": true
                                })}
                                <span>{configuration.label}</span>
                            </button>
                        );
                    })}
                </div>

                <label className="relative min-w-0 flex-1">
                    <span className="sr-only">{searchConfiguration.placeholder}</span>
                    <FaMagnifyingGlass
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                        aria-hidden="true"
                    />
                    <input
                        type="search"
                        className="h-10 w-full rounded-md border border-zinc-300 bg-white pl-10 pr-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        value={query}
                        placeholder={searchConfiguration.placeholder}
                        onChange={onQueryChange}
                    />
                </label>
            </div>
        </div>
    );
}

// ##### Results List
// -----> Stellt Suchtreffer und Fahndungen einheitlich als auswählbare Records dar.
function ResultsList({
    activeSection,
    query,
    results,
    searchType,
    selection,
    onSelect
}) {
    const isWaitingForQuery = activeSection === POLICE_DATABASE_SECTIONS.SEARCH
        && !query.trim();

    return (
        <section className="min-h-0 overflow-y-auto border-r border-zinc-200 bg-white">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
                <h2 className="text-sm font-semibold text-zinc-900">
                    {activeSection === POLICE_DATABASE_SECTIONS.WANTED
                        ? "Aktive Fahndungen"
                        : "Suchergebnisse"
                    }
                </h2>
                <span className="text-xs text-zinc-500">
                    {isWaitingForQuery ? "–" : results.length}
                </span>
            </div>

            {isWaitingForQuery ? (
                <ListMessage
                    title="Suchbegriff eingeben"
                    text="Es werden keine vollständigen Personenlisten ohne konkrete Abfrage angezeigt."
                />
            ) : results.length === 0 ? (
                <ListMessage
                    title="Kein Treffer"
                    text="Im verfügbaren Polizeibestand wurde kein passender Datensatz gefunden."
                />
            ) : (
                <div className="divide-y divide-zinc-100">
                    {results.map((record) => {
                        const itemSelection = createSelection(activeSection, searchType, record);
                        const isSelected = selection?.kind === itemSelection.kind
                            && selection?.id === itemSelection.id;

                        return (
                            <ResultButton
                                key={`${itemSelection.kind}-${itemSelection.id}`}
                                activeSection={activeSection}
                                isSelected={isSelected}
                                record={record}
                                searchType={searchType}
                                onClick={() => onSelect(itemSelection)}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
}

// Formt die verschiedenen Trefferarten in eine stabile Detailauswahl um.
function createSelection(activeSection, searchType, record) {
    if (activeSection === POLICE_DATABASE_SECTIONS.WANTED) {
        return { kind: "wanted", id: record.id };
    }

    if (searchType === POLICE_DATABASE_SEARCH_TYPES.PLATE) {
        return { kind: "vehicle", id: record.vehicleId };
    }

    return { kind: "person", id: record.npcId };
}

// Stellt die für den jeweiligen Suchmodus wichtigsten Trefferinformationen dar.
function ResultButton({ activeSection, isSelected, record, searchType, onClick }) {
    const isVehicle = searchType === POLICE_DATABASE_SEARCH_TYPES.PLATE
        && activeSection !== POLICE_DATABASE_SECTIONS.WANTED;
    const title = isVehicle
        ? record.carDocumentsData?.plateNumber
        : activeSection === POLICE_DATABASE_SECTIONS.WANTED
            ? `Fahndung ${record.id}`
            : `${record.firstName} ${record.lastName}`;
    const subtitle = isVehicle
        ? `${record.brand} ${record.model}`
        : activeSection === POLICE_DATABASE_SECTIONS.WANTED
            ? `Priorität ${record.priorityLevel}`
            : searchType === POLICE_DATABASE_SEARCH_TYPES.LICENSE
                ? record.driversLicense?.licenseNumber
                : record.address;

    return (
        <button
            type="button"
            className={`w-full border-l-4 px-4 py-4 text-left ${
                isSelected
                    ? "border-blue-700 bg-blue-50"
                    : "border-transparent hover:bg-zinc-50"
            }`}
            onClick={onClick}
        >
            <p className="truncate text-sm font-semibold text-zinc-950">{title}</p>
            <p className="mt-1 truncate text-xs text-zinc-500">{subtitle}</p>
        </button>
    );
}

// ##### Record Details
// -----> Löst die gewählte Record-ID erst beim Anzeigen gegen die relationale Datenbank auf.
function RecordDetails({ criminalDatabase, selection, onSelect }) {
    if (!selection) {
        return (
            <div className="flex min-h-0 items-center justify-center overflow-y-auto p-8">
                <ListMessage
                    title="Kein Datensatz ausgewählt"
                    text="Wähle links einen Treffer aus, um die polizeilich bekannten Details zu öffnen."
                />
            </div>
        );
    }

    if (selection.kind === "vehicle") {
        const vehicle = criminalDatabase.vehiclesById?.[selection.id];
        const owner = criminalDatabase.npcsById?.[vehicle?.registeredOwnerNpcId];

        return (
            <VehicleDetails
                vehicle={vehicle}
                owner={owner}
                onSelectOwner={() => {
                    if (owner) onSelect({ kind: "person", id: owner.npcId });
                }}
            />
        );
    }

    if (selection.kind === "wanted") {
        const wantedRecord = criminalDatabase.wantedRecordsById[selection.id];
        const npc = criminalDatabase.npcsById[wantedRecord?.npcId];

        return (
            <WantedDetails
                criminalDatabase={criminalDatabase}
                wantedRecord={wantedRecord}
                npc={npc}
                onSelectPerson={() => {
                    if (npc) onSelect({ kind: "person", id: npc.npcId });
                }}
            />
        );
    }

    const npc = criminalDatabase.npcsById[selection.id];

    return <PersonDetails criminalDatabase={criminalDatabase} npc={npc} onSelect={onSelect} />;
}

// Zeigt Personenstammdaten und alle daran referenzierten Polizeirecords.
function PersonDetails({ criminalDatabase, npc, onSelect }) {
    if (!npc) return <MissingRecord />;

    const crimes = getCrimeRecordsForNpc(criminalDatabase, npc);
    const vehicles = getVehiclesForNpc(criminalDatabase, npc);
    const wantedRecord = getActiveWantedRecordForNpc(criminalDatabase, npc.npcId);

    return (
        <DetailLayout title="Personenakte" recordId={npc.npcId}>
            <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 sm:flex-row">
                <BaseImage
                    data={npc.npcImage}
                    alt={`${npc.firstName} ${npc.lastName}`}
                    className="h-36 w-28 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-semibold text-zinc-950">
                                {npc.firstName} {npc.lastName}
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">{npc.address}</p>
                        </div>
                        <StatusBadge wanted={Boolean(wantedRecord)} />
                    </div>
                    <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                        <DataField label="Geburtsdatum" value={formatDate(npc.birthDate)} />
                        <DataField label="Alter" value={`${npc.age} Jahre`} />
                        <DataField label="Geschlecht" value={formatSex(npc.sex)} />
                        <DataField label="Größe" value={npc.height ? `${npc.height} cm` : "Nicht erfasst"} />
                        <DataField label="Haarfarbe" value={npc.hairColor} />
                        <DataField label="Augenfarbe" value={npc.eyeColor} />
                    </dl>
                </div>
            </div>

            <DetailSection title="Führerschein">
                {npc.driversLicense ? (
                    <dl className="grid gap-4 sm:grid-cols-3">
                        <DataField label="Nummer" value={npc.driversLicense.licenseNumber} />
                        <DataField label="Ausgestellt" value={formatDate(npc.driversLicense.issueDate)} />
                        <DataField label="Gültig bis" value={formatDate(npc.driversLicense.expiryDate)} />
                    </dl>
                ) : (
                    <EmptyInline text="Kein Führerschein im Polizeibestand." />
                )}
            </DetailSection>

            <DetailSection title="Registrierte Fahrzeuge">
                {vehicles.length > 0 ? vehicles.map((vehicle) => (
                    <button
                        key={vehicle.vehicleId}
                        type="button"
                        className="flex w-full items-center justify-between gap-4 border-b border-zinc-100 py-3 text-left last:border-0 hover:text-blue-700"
                        onClick={() => onSelect({ kind: "vehicle", id: vehicle.vehicleId })}
                    >
                        <span>
                            <span className="block text-sm font-semibold">
                                {vehicle.carDocumentsData?.plateNumber}
                            </span>
                            <span className="block text-xs text-zinc-500">
                                {vehicle.brand} {vehicle.model}
                            </span>
                        </span>
                        <FaCar aria-hidden="true" />
                    </button>
                )) : (
                    <EmptyInline text="Kein Fahrzeug im Polizeibestand." />
                )}
            </DetailSection>

            <CrimeRecordList crimes={crimes} />
        </DetailLayout>
    );
}

// Zeigt die kanonischen Zulassungsdaten und den separat verknüpften Halter.
function VehicleDetails({ vehicle, owner, onSelectOwner }) {
    if (!vehicle) return <MissingRecord />;

    return (
        <DetailLayout title="Fahrzeugakte" recordId={vehicle.vehicleId}>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-5">
                <div>
                    <p className="text-3xl font-semibold tracking-normal text-zinc-950">
                        {vehicle.carDocumentsData?.plateNumber}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                        {vehicle.brand} {vehicle.model}
                    </p>
                </div>
                <span className="rounded border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600">
                    Registriert
                </span>
            </div>

            <DetailSection title="Zulassungsdaten">
                <dl className="grid gap-4 sm:grid-cols-3">
                    <DataField
                        label="Zulassungsnummer"
                        value={vehicle.carDocumentsData?.carRegistrationNumber}
                    />
                    <DataField
                        label="Ausgestellt"
                        value={formatDate(vehicle.carDocumentsData?.formattedIssueDate)}
                    />
                    <DataField label="Baujahr" value={vehicle.yearOfConstruction} />
                    <DataField label="Leistung" value={vehicle.ps ? `${vehicle.ps} PS` : null} />
                    <DataField label="Gewicht" value={vehicle.weight ? `${vehicle.weight} kg` : null} />
                </dl>
            </DetailSection>

            <DetailSection title="Eingetragener Halter">
                {owner ? (
                    <button
                        type="button"
                        className="flex w-full items-center gap-4 rounded-md border border-zinc-200 bg-white p-4 text-left hover:border-blue-300 hover:bg-blue-50"
                        onClick={onSelectOwner}
                    >
                        <BaseImage
                            data={owner.npcImage}
                            alt={`${owner.firstName} ${owner.lastName}`}
                            className="h-16 w-12 rounded object-cover"
                        />
                        <span>
                            <span className="block font-semibold text-zinc-950">
                                {owner.firstName} {owner.lastName}
                            </span>
                            <span className="mt-1 block text-xs text-zinc-500">{owner.address}</span>
                        </span>
                    </button>
                ) : (
                    <EmptyInline text="Kein Halter im Polizeibestand auflösbar." />
                )}
            </DetailSection>
        </DetailLayout>
    );
}

// Zeigt den eigenständigen Fahndungsrecord samt Person und Fahndungsgrund.
function WantedDetails({ criminalDatabase, wantedRecord, npc, onSelectPerson }) {
    if (!wantedRecord || !npc) return <MissingRecord />;

    const reasonCrimes = wantedRecord.reasonCrimeRecordIds
        .map((crimeRecordId) => criminalDatabase.crimeRecordsById[crimeRecordId])
        .filter(Boolean);

    return (
        <DetailLayout title="Fahndungsakte" recordId={wantedRecord.id}>
            <div className="flex flex-col gap-5 border-b border-red-200 bg-red-50 p-5 sm:flex-row">
                <BaseImage
                    data={npc.npcImage}
                    alt={`${npc.firstName} ${npc.lastName}`}
                    className="h-32 w-24 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase text-red-700">
                        Aktive Fahndung · Priorität {wantedRecord.priorityLevel}
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
                        {npc.firstName} {npc.lastName}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600">{npc.address}</p>
                    <button
                        type="button"
                        className="mt-4 text-sm font-semibold text-blue-700 hover:text-blue-900"
                        onClick={onSelectPerson}
                    >
                        Vollständige Personenakte öffnen
                    </button>
                </div>
            </div>

            <DetailSection title="Fahndungsstatus">
                <dl className="grid gap-4 sm:grid-cols-3">
                    <DataField label="Status" value="Aktiv" />
                    <DataField label="Ausgestellt am" value={formatDate(wantedRecord.issuedAt)} />
                    <DataField label="Prioritätsstufe" value={wantedRecord.priorityLevel} />
                </dl>
            </DetailSection>

            <CrimeRecordList title="Fahndungsgrund" crimes={reasonCrimes} />
        </DetailLayout>
    );
}

// Gemeinsamer Scrollbereich für die drei Detailakten.
function DetailLayout({ title, recordId, children }) {
    return (
        <article className="min-h-0 overflow-y-auto p-5 lg:p-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold uppercase text-zinc-500">{title}</h2>
                    <span className="font-mono text-xs text-zinc-400">{recordId}</span>
                </div>
                {children}
            </div>
        </article>
    );
}

// Gruppiert einen inhaltlichen Abschnitt innerhalb einer geöffneten Akte.
function DetailSection({ title, children }) {
    return (
        <section className="border-b border-zinc-200 py-6 last:border-0">
            <h3 className="mb-4 text-sm font-semibold text-zinc-950">{title}</h3>
            {children}
        </section>
    );
}

// Zeigt bekannte Straftaten mit Status und Datum.
function CrimeRecordList({ crimes, title = "Bekannte Straftaten" }) {
    return (
        <DetailSection title={title}>
            {crimes.length > 0 ? (
                <div className="divide-y divide-zinc-200 border-y border-zinc-200">
                    {crimes.map((crime) => (
                        <div key={crime.id} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto]">
                            <div>
                                <p className="text-sm font-semibold text-zinc-950">{crime.title}</p>
                                <p className="mt-1 text-xs leading-5 text-zinc-500">{crime.description}</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-xs font-medium text-zinc-700">
                                    {formatCrimeStatus(crime.status)}
                                </p>
                                <p className="mt-1 text-xs text-zinc-500">{formatDate(crime.committedAt)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyInline text="Keine Straftaten im Polizeibestand." />
            )}
        </DetailSection>
    );
}

// Kleine Definition-List-Zelle für Stammdaten.
function DataField({ label, value }) {
    return (
        <div>
            <dt className="text-xs text-zinc-500">{label}</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">{value || "Nicht erfasst"}</dd>
        </div>
    );
}

// Kennzeichnet den aktuell polizeilich bekannten Status der Person.
function StatusBadge({ wanted }) {
    return (
        <span className={`rounded border px-2.5 py-1 text-xs font-semibold ${
            wanted
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
        }`}>
            {wanted ? "Aktiv gesucht" : "Polizeibekannt"}
        </span>
    );
}

// Einheitlicher leerer Zustand für Listen und noch nicht ausgewählte Records.
function ListMessage({ title, text }) {
    return (
        <div className="mx-auto max-w-sm px-6 py-12 text-center">
            <FaFileCircleExclamation className="mx-auto text-2xl text-zinc-400" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-zinc-800">{title}</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">{text}</p>
        </div>
    );
}

function EmptyInline({ text }) {
    return <p className="text-sm text-zinc-500">{text}</p>;
}

function MissingRecord() {
    return (
        <div className="flex h-full items-center justify-center p-8">
            <ListMessage
                title="Datensatz nicht verfügbar"
                text="Die gespeicherte Referenz konnte im Polizeibestand nicht aufgelöst werden."
            />
        </div>
    );
}

function formatDate(value) {
    if (!value) return "Nicht erfasst";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("de-DE").format(date);
}

function formatSex(value) {
    if (value === "male") return "Männlich";
    if (value === "female") return "Weiblich";

    return value || "Nicht erfasst";
}

function formatCrimeStatus(status) {
    const labels = {
        open: "Offen",
        convicted: "Verurteilt",
        under_investigation: "In Ermittlung"
    };

    return labels[status] ?? status ?? "Nicht erfasst";
}
