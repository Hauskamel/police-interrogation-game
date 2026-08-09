import { createElement, useMemo } from "react";
import {
    FaBullhorn,
    FaCar,
    FaFileCircleExclamation,
    FaFileSignature,
    FaIdCard,
    FaMagnifyingGlass,
    FaUser
} from "react-icons/fa6";

import { BaseImage } from "@game/documents/components/base";
import { useInspectionFieldInteraction } from "@game/inspections/hooks/useInspectionFieldInteraction.js";
import { formatDateForDisplay } from "@game/shared";
import {
    POLICE_DATABASE_SEARCH_TYPES,
    POLICE_DATABASE_SECTIONS,
    useNpcStore,
    useOfficialRegistryStore,
    usePoliceLaptopStore
} from "@stores";
import {
    DISTINGUISHING_MARK_LABELS,
    getNpcPhotoComparisonValue
} from "@game/npcs/data";

import {
    getActiveWantedRecordForNpc,
    getActiveWantedRecords,
    getCrimeRecordsForNpc,
    getOfficialVehiclesForNpc,
    searchInsurancePolicies,
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
    },
    [POLICE_DATABASE_SEARCH_TYPES.INSURANCE]: {
        label: "Versicherung",
        placeholder: "Policennummer",
        icon: FaFileSignature
    }
};

// ##### Police Database Screen
// -----> Spielbare Suche für Personen, Führerscheine, Kennzeichen und aktive Fahndungen.
// ---> Personenakten stammen aus dem Polizeibestand, Dokumentabfragen aus amtlichen Registern.
export function PoliceDatabaseScreen() {
    const criminalDatabase = useNpcStore((state) => state.criminalDatabase);
    const officialRegistry = useOfficialRegistryStore(
        (state) => state.officialRegistry
    );
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
            return searchDriverLicenses(officialRegistry, query);
        }

        if (searchType === POLICE_DATABASE_SEARCH_TYPES.PLATE) {
            return searchVehicles(officialRegistry, query);
        }

        if (searchType === POLICE_DATABASE_SEARCH_TYPES.INSURANCE) {
            return searchInsurancePolicies(officialRegistry, query);
        }

        return searchPeople(criminalDatabase, query);
    }, [activeSection, criminalDatabase, officialRegistry, query, searchType]);

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
                            Polizei- und Verwaltungsbestand
                        </p>
                        <h1 className="mt-1 !text-xl font-semibold tracking-normal text-zinc-950">
                            Zentrales Behördenregister
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
                    criminalDatabase={criminalDatabase}
                    officialRegistry={officialRegistry}
                    query={query}
                    results={results}
                    searchType={searchType}
                    selection={selection}
                    onSelect={setDatabaseSelection}
                />
                <RecordDetails
                    criminalDatabase={criminalDatabase}
                    officialRegistry={officialRegistry}
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
    criminalDatabase,
    officialRegistry,
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
                    text="Im verfügbaren Behördenbestand wurde kein passender Datensatz gefunden."
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
                                criminalDatabase={criminalDatabase}
                                officialRegistry={officialRegistry}
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
        return { kind: "registryVehicle", id: record.vehicleId };
    }

    if (searchType === POLICE_DATABASE_SEARCH_TYPES.INSURANCE) {
        return { kind: "insurancePolicy", id: record.policyId };
    }

    if (searchType === POLICE_DATABASE_SEARCH_TYPES.LICENSE) {
        return { kind: "registryPerson", id: record.npcId };
    }

    return { kind: "person", id: record.npcId };
}

// Stellt die für den jeweiligen Suchmodus wichtigsten Trefferinformationen dar.
function ResultButton({
    activeSection,
    criminalDatabase,
    officialRegistry,
    isSelected,
    record,
    searchType,
    onClick
}) {
    const isVehicle = searchType === POLICE_DATABASE_SEARCH_TYPES.PLATE
        && activeSection !== POLICE_DATABASE_SECTIONS.WANTED;
    const isInsurance = searchType === POLICE_DATABASE_SEARCH_TYPES.INSURANCE
        && activeSection !== POLICE_DATABASE_SECTIONS.WANTED;
    const wantedNpc = activeSection === POLICE_DATABASE_SECTIONS.WANTED
        ? criminalDatabase.npcsById?.[record.npcId]
        : null;
    const insuranceVehicle = isInsurance
        ? officialRegistry.vehiclesById?.[record.vehicleId]
        : null;
    const title = isInsurance
        ? record.policyNumber
        : isVehicle
        ? record.carDocumentsData?.plateNumber
        : activeSection === POLICE_DATABASE_SECTIONS.WANTED
            ? formatNpcName(wantedNpc)
            : `${record.firstName} ${record.lastName}`;
    const subtitle = isInsurance
        ? `${record.provider} · ${insuranceVehicle?.carDocumentsData?.plateNumber ?? "Fahrzeug nicht auflösbar"}`
        : isVehicle
        ? `${record.brand} ${record.model}`
        : activeSection === POLICE_DATABASE_SECTIONS.WANTED
            ? `Priorität ${record.priorityLevel} · Fahndung ${record.id}`
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

// Fahndungsrecords bleiben relational; der Name wird nur für die Anzeige aufgelöst.
function formatNpcName(npc) {
    if (!npc) return "Person nicht auflösbar";

    return `${npc.firstName} ${npc.lastName}`;
}

// ##### Record Details
// -----> Löst die gewählte Record-ID erst beim Anzeigen gegen die relationale Datenbank auf.
function RecordDetails({ criminalDatabase, officialRegistry, selection, onSelect }) {
    if (!selection) {
        return (
            <div className="flex min-h-0 items-center justify-center overflow-y-auto p-8">
                <ListMessage
                    title="Kein Datensatz ausgewählt"
                    text="Wähle links einen Treffer aus, um die verfügbaren Behördenangaben zu öffnen."
                />
            </div>
        );
    }

    if (selection.kind === "registryVehicle") {
        const vehicle = officialRegistry.vehiclesById?.[selection.id];
        const owner = officialRegistry.peopleById?.[vehicle?.registeredOwnerNpcId];

        return (
            <VehicleDetails
                vehicle={vehicle}
                owner={owner}
                onSelectOwner={() => {
                    if (!owner) return;

                    const kind = criminalDatabase.npcsById?.[owner.npcId]
                        ? "person"
                        : "registryPerson";
                    onSelect({ kind, id: owner.npcId });
                }}
            />
        );
    }

    if (selection.kind === "insurancePolicy") {
        const policy = officialRegistry.insurancePoliciesById?.[selection.id];
        const vehicle = officialRegistry.vehiclesById?.[policy?.vehicleId];
        const holder = officialRegistry.peopleById?.[policy?.policyHolderNpcId];

        return (
            <InsuranceDetails
                policy={policy}
                vehicle={vehicle}
                holder={holder}
            />
        );
    }

    if (selection.kind === "registryPerson") {
        const policeNpc = criminalDatabase.npcsById?.[selection.id];

        if (policeNpc) {
            return (
                <PersonDetails
                    criminalDatabase={criminalDatabase}
                    officialRegistry={officialRegistry}
                    npc={policeNpc}
                    onSelect={onSelect}
                />
            );
        }

        const officialPerson = officialRegistry.peopleById?.[selection.id];
        const license = Object.values(officialRegistry.driverLicensesByNumber ?? {})
            .find((record) => record.npcId === selection.id);

        return (
            <OfficialPersonDetails
                person={officialPerson}
                license={license}
                vehicles={getOfficialVehiclesForNpc(officialRegistry, selection.id)}
                onSelectVehicle={(vehicleId) => {
                    onSelect({ kind: "registryVehicle", id: vehicleId });
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

    return (
        <PersonDetails
            criminalDatabase={criminalDatabase}
            officialRegistry={officialRegistry}
            npc={npc}
            onSelect={onSelect}
        />
    );
}

// Zeigt Personenstammdaten und alle daran referenzierten Polizeirecords.
function PersonDetails({ criminalDatabase, officialRegistry, npc, onSelect }) {
    if (!npc) return <MissingRecord />;

    const crimes = getCrimeRecordsForNpc(criminalDatabase, npc);
    const vehicles = getOfficialVehiclesForNpc(officialRegistry, npc.npcId);
    const wantedRecord = getActiveWantedRecordForNpc(criminalDatabase, npc.npcId);

    return (
        <DetailLayout title="Personenakte" recordId={npc.npcId}>
            <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 sm:flex-row">
                <BaseImage
                    data={npc.npcImage}
                    alt={`${npc.firstName} ${npc.lastName}`}
                    className="h-36 w-28 rounded object-cover"
                    fieldId="registryPerson.photo"
                    recordId={npc.npcId}
                    selectionValue={getNpcPhotoComparisonValue(npc.npcImage)}
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
                        <DataField label="Vorname" value={npc.firstName} fieldId="registryPerson.firstName" recordId={npc.npcId} />
                        <DataField label="Nachname" value={npc.lastName} fieldId="registryPerson.lastName" recordId={npc.npcId} />
                        <DataField label="Adresse" value={npc.address} fieldId="registryPerson.address" recordId={npc.npcId} />
                        <DataField label="Geburtsdatum" value={formatDateForDisplay(npc.birthDate)} selectionValue={npc.birthDate} fieldId="registryPerson.birthDate" recordId={npc.npcId} />
                        <DataField label="Alter" value={`${npc.age} Jahre`} />
                        <DataField label="Geschlecht" value={formatSex(npc.sex)} />
                        <DataField label="Größe" value={npc.height ? `${npc.height} cm` : "Nicht erfasst"} />
                        <DataField label="Haarfarbe" value={npc.hairColor} fieldId="registryPerson.hairColor" recordId={npc.npcId} />
                        <DataField label="Augenfarbe" value={npc.eyeColor} fieldId="registryPerson.eyeColor" recordId={npc.npcId} />
                        <DataField
                            label="Besondere Kennzeichen"
                            value={formatDistinguishingMarks(npc.distinguishingMarks)}
                            selectionValue={npc.distinguishingMarks ?? []}
                            fieldId="registryPerson.distinguishingMarks"
                            recordId={npc.npcId}
                        />
                    </dl>
                </div>
            </div>

            <DetailSection title="Führerschein">
                {npc.driversLicense ? (
                    <dl className="grid gap-4 sm:grid-cols-3">
                        <DataField label="Nummer" value={npc.driversLicense.licenseNumber} fieldId="registryLicense.number" recordId={npc.npcId} />
                        <DataField label="Fahrerlaubnis seit" value={formatDateForDisplay(npc.driversLicense.licensedSince)} selectionValue={npc.driversLicense.licensedSince} fieldId="registryLicense.licensedSince" recordId={npc.npcId} />
                        <DataField label="Ausgestellt" value={formatDateForDisplay(npc.driversLicense.issueDate)} selectionValue={npc.driversLicense.issueDate} fieldId="registryLicense.issueDate" recordId={npc.npcId} />
                        <DataField label="Gültig bis" value={formatDateForDisplay(npc.driversLicense.expiryDate)} />
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
                        onClick={() => onSelect({ kind: "registryVehicle", id: vehicle.vehicleId })}
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

function formatDistinguishingMarks(marks = []) {
    if (marks.length === 0) return "Keine erfasst";
    return marks.map((mark) => DISTINGUISHING_MARK_LABELS[mark] ?? mark).join(", ");
}

// Zeigt einen amtlichen Personen- und Fuehrerscheinrecord ohne polizeiliche Erkenntnisse hinzuzufuegen.
function OfficialPersonDetails({ person, license, vehicles, onSelectVehicle }) {
    if (!person) return <MissingRecord />;

    return (
        <DetailLayout title="Amtlicher Personenrecord" recordId={person.npcId}>
            <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 sm:flex-row">
                <BaseImage
                    data={person.npcImage}
                    alt={`${person.firstName} ${person.lastName}`}
                    className="h-36 w-28 rounded object-cover"
                    fieldId="registryPerson.photo"
                    recordId={person.npcId}
                    selectionValue={getNpcPhotoComparisonValue(person.npcImage)}
                />
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase text-zinc-500">
                        Amtlich registriert, keine Personenakte im Polizeibestand
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
                        {person.firstName} {person.lastName}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">{person.address}</p>
                    <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                        <DataField label="Vorname" value={person.firstName} fieldId="registryPerson.firstName" recordId={person.npcId} />
                        <DataField label="Nachname" value={person.lastName} fieldId="registryPerson.lastName" recordId={person.npcId} />
                        <DataField label="Adresse" value={person.address} fieldId="registryPerson.address" recordId={person.npcId} />
                        <DataField label="Geburtsdatum" value={formatDateForDisplay(person.birthDate)} selectionValue={person.birthDate} fieldId="registryPerson.birthDate" recordId={person.npcId} />
                        <DataField label="Alter" value={`${person.age} Jahre`} />
                        <DataField label="Geschlecht" value={formatSex(person.sex)} />
                    </dl>
                </div>
            </div>

            <DetailSection title="Führerscheinregister">
                {license ? (
                    <dl className="grid gap-4 sm:grid-cols-3">
                        <DataField label="Nummer" value={license.licenseNumber} fieldId="registryLicense.number" recordId={person.npcId} />
                        <DataField label="Fahrerlaubnis seit" value={formatDateForDisplay(license.licensedSince)} selectionValue={license.licensedSince} fieldId="registryLicense.licensedSince" recordId={person.npcId} />
                        <DataField label="Ausgestellt" value={formatDateForDisplay(license.issueDate)} selectionValue={license.issueDate} fieldId="registryLicense.issueDate" recordId={person.npcId} />
                        <DataField label="Gültig bis" value={formatDateForDisplay(license.expiryDate)} />
                    </dl>
                ) : (
                    <EmptyInline text="Kein Führerschein im amtlichen Register." />
                )}
            </DetailSection>

            <DetailSection title="Registrierte Fahrzeuge">
                {vehicles.length > 0 ? vehicles.map((vehicle) => (
                    <button
                        key={vehicle.vehicleId}
                        type="button"
                        className="flex w-full items-center justify-between gap-4 border-b border-zinc-100 py-3 text-left last:border-0 hover:text-blue-700"
                        onClick={() => onSelectVehicle(vehicle.vehicleId)}
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
                    <EmptyInline text="Kein Fahrzeug im amtlichen Register." />
                )}
            </DetailSection>
        </DetailLayout>
    );
}

// Zeigt die kanonische Police und ihre Relationen, ohne eine Kriminalakte vorauszusetzen.
function InsuranceDetails({ policy, vehicle, holder }) {
    if (!policy) return <MissingRecord />;

    return (
        <DetailLayout title="Versicherungsregister" recordId={policy.policyId}>
            <div className="border-b border-zinc-200 pb-5">
                <p className="text-xs font-semibold uppercase text-blue-700">
                    Kraftfahrzeug-Haftpflicht
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
                    {policy.policyNumber}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">{policy.provider}</p>
            </div>

            <DetailSection title="Versicherungsschutz">
                <dl className="grid gap-4 sm:grid-cols-3">
                    <DataField label="Status" value={policy.status === "active" ? "Aktiv" : "Abgelaufen"} />
                    <DataField label="Policennummer" value={policy.policyNumber} fieldId="registryInsurance.policyNumber" recordId={policy.policyId} />
                    <DataField label="Gültig ab" value={formatDateForDisplay(policy.validFrom)} />
                    <DataField label="Gültig bis" value={formatDateForDisplay(policy.validUntil)} />
                    <DataField label="Kennzeichen" value={policy.insuredPlateNumber} fieldId="registryInsurance.plateNumber" recordId={policy.policyId} />
                    <DataField
                        label="Fahrzeug"
                        value={vehicle ? `${vehicle.brand} ${vehicle.model}` : "Nicht auflösbar"}
                    />
                    <DataField
                        label="Versicherungsnehmer"
                        value={holder ? `${holder.firstName} ${holder.lastName}` : "Nicht auflösbar"}
                    />
                </dl>
            </DetailSection>
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
                        label="Kennzeichen"
                        value={vehicle.carDocumentsData?.plateNumber}
                        fieldId="registryVehicle.plateNumber"
                        recordId={vehicle.vehicleId}
                    />
                    <DataField
                        label="Zulassungsnummer"
                        value={vehicle.carDocumentsData?.carRegistrationNumber}
                        fieldId="registryVehicle.registrationNumber"
                        recordId={vehicle.vehicleId}
                    />
                    <DataField
                        label="Ausgestellt"
                        value={formatDateForDisplay(vehicle.carDocumentsData?.formattedIssueDate)}
                        selectionValue={vehicle.carDocumentsData?.formattedIssueDate}
                        fieldId="registryVehicle.issueDate"
                        recordId={vehicle.vehicleId}
                    />
                    <DataField label="Hersteller" value={vehicle.brand} fieldId="registryVehicle.brand" recordId={vehicle.vehicleId} />
                    <DataField label="Modell" value={vehicle.model} fieldId="registryVehicle.model" recordId={vehicle.vehicleId} />
                    <DataField label="Baujahr" value={vehicle.yearOfConstruction} fieldId="registryVehicle.yearOfConstruction" recordId={vehicle.vehicleId} />
                    <DataField label="Leistung" value={vehicle.ps ? `${vehicle.ps} PS` : null} selectionValue={vehicle.ps} fieldId="registryVehicle.ps" recordId={vehicle.vehicleId} />
                    <DataField label="Gewicht" value={vehicle.weight ? `${vehicle.weight} kg` : null} selectionValue={vehicle.weight} fieldId="registryVehicle.weight" recordId={vehicle.vehicleId} />
                </dl>
            </DetailSection>

            <DetailSection title="Eingetragener Halter">
                {owner ? (
                    <>
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
                        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                            <DataField label="Halter Vorname" value={owner.firstName} fieldId="registryOwner.firstName" recordId={owner.npcId} />
                            <DataField label="Halter Nachname" value={owner.lastName} fieldId="registryOwner.lastName" recordId={owner.npcId} />
                            <DataField label="Halteradresse" value={owner.address} fieldId="registryOwner.address" recordId={owner.npcId} />
                        </dl>
                    </>
                ) : (
                    <EmptyInline text="Kein Halter im amtlichen Register auflösbar." />
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
                    fieldId="registryPerson.photo"
                    recordId={npc.npcId}
                    selectionValue={getNpcPhotoComparisonValue(npc.npcImage)}
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
                    <DataField label="Ausgestellt am" value={formatDateForDisplay(wantedRecord.issuedAt)} />
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
                                <p className="mt-1 text-xs text-zinc-500">{formatDateForDisplay(crime.committedAt)}</p>
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

// Kleine Definition-List-Zelle fuer Stammdaten und auswählbare Registerwerte.
// Nur konfigurierte Felder reagieren waehrend des aktiven Diskrepanzmodus auf Klicks.
function DataField({
    label,
    value,
    fieldId,
    recordId,
    selectionValue = value
}) {
    const {
        isInteractive,
        isSelected,
        isCompatible,
        selectField
    } = useInspectionFieldInteraction(fieldId, recordId);
    const content = (
        <>
            <span className="block text-xs text-zinc-500">{label}</span>
            <span className="mt-1 block text-sm font-medium text-zinc-900">
                {value || "Nicht erfasst"}
            </span>
        </>
    );

    if (isInteractive) {
        return (
            <div>
                <button
                    type="button"
                    className={`w-full rounded px-2 py-1.5 text-left transition ${
                        isSelected
                            ? "bg-blue-700 text-white ring-2 ring-blue-300 [&_span]:text-white"
                            : isCompatible
                                ? "hover:bg-blue-100 hover:ring-2 hover:ring-blue-500"
                                : "opacity-45 hover:opacity-75"
                    }`}
                    aria-pressed={isSelected}
                    onClick={() => selectField(selectionValue)}
                >
                    {content}
                </button>
            </div>
        );
    }

    return (
        <div>
            {content}
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
