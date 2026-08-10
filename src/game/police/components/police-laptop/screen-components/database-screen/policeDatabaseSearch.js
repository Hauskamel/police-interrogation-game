// ##### Police Database Search
// -----> Enthält die reinen Such- und Relationsfunktionen des spielbaren Laptops.
// ---> Polizeisuchen und amtliche Registerabfragen bleiben getrennt und kennen keine World-Truth-Daten.

// Normalisiert Suchbegriffe, damit Großschreibung, Leerzeichen und Bindestriche nicht stören.
function normalizeSearchValue(value) {
    return String(value ?? "")
        .toLocaleLowerCase("de-DE")
        .replace(/[\s-]+/g, "");
}

// Prüft, ob mindestens eines der erlaubten Felder den Suchbegriff enthält.
function matchesQuery(query, values) {
    const normalizedQuery = normalizeSearchValue(query);

    return values.some((value) => {
        return normalizeSearchValue(value).includes(normalizedQuery);
    });
}

// Sucht Personen nur anhand von Informationen, die in ihrem Polizeirecord gespeichert sind.
export function searchPeople(criminalDatabase, query) {
    if (!query.trim()) return [];

    return (criminalDatabase.criminalNpcIds ?? [])
        .map((npcId) => criminalDatabase.npcsById[npcId])
        .filter(Boolean)
        .filter((npc) => {
            return matchesQuery(query, [
                npc.npcId,
                npc.firstName,
                npc.lastName,
                `${npc.firstName} ${npc.lastName}`,
                npc.address
            ]);
        });
}

// Sucht Führerscheine und liefert den zugehörigen Personenrecord zurück.
export function searchDriverLicenses(officialRegistry, query) {
    if (!query.trim()) return [];

    return Object.values(officialRegistry.driverLicensesByNumber ?? {})
        .filter((license) => matchesQuery(query, [license.licenseNumber]))
        .map((license) => {
            const person = officialRegistry.peopleById?.[license.npcId];

            return person
                ? { ...person, driversLicense: license }
                : null;
        })
        .filter(Boolean);
}

// Sucht registrierte Fahrzeuge anhand von Kennzeichen oder Zulassungsnummer.
export function searchVehicles(officialRegistry, query) {
    if (!query.trim()) return [];

    return Object.values(officialRegistry.vehiclesById ?? {})
        .filter(Boolean)
        .filter((vehicle) => {
            return matchesQuery(query, [
                vehicle.carDocumentsData?.plateNumber,
                vehicle.carDocumentsData?.carRegistrationNumber
            ]);
        });
}

// Sucht eine konkrete Versicherungspolice anhand ihrer vorgelegten Policennummer.
export function searchInsurancePolicies(officialRegistry, query) {
    if (!query.trim()) return [];

    return Object.values(officialRegistry.insurancePoliciesById ?? {})
        .filter((policy) => matchesQuery(query, [policy.policyNumber]));
}

// Löst alle aktiven Fahndungen aus der eigenständigen Fahndungstabelle auf.
export function getActiveWantedRecords(criminalDatabase) {
    return (criminalDatabase.wantedRecordIds ?? [])
        .map((recordId) => criminalDatabase.wantedRecordsById[recordId])
        .filter((record) => record?.status === "active");
}

// Liefert die zur Person gespeicherten Straftaten in derselben Reihenfolge wie ihre IDs.
export function getCrimeRecordsForNpc(criminalDatabase, npc) {
    return (npc?.crimeRecordIds ?? [])
        .map((crimeRecordId) => criminalDatabase.crimeRecordsById[crimeRecordId])
        .filter(Boolean);
}

// Liefert alle Fahrzeuge, die über ihre IDs auf eine Person registriert sind.
export function getVehiclesForNpc(criminalDatabase, npc) {
    return (npc?.vehicleIds ?? [])
        .map((vehicleId) => criminalDatabase.vehiclesById?.[vehicleId])
        .filter(Boolean);
}

// Amtliche Fahrzeugrelationen werden ueber die Halter-ID statt ueber Polizeirecords aufgeloest.
export function getOfficialVehiclesForNpc(officialRegistry, npcId) {
    return Object.values(officialRegistry.vehiclesById ?? {})
        .filter((vehicle) => vehicle.registeredOwnerNpcId === npcId);
}

// Loest die beiden eigenstaendigen Genehmigungsrecords ueber ihre Halter-ID auf.
// Die Arbeitserlaubnis bleibt zusaetzlich ueber residencePermitId mit dem Aufenthaltstitel verknuepft.
export function getOfficialImmigrationDocumentsForNpc(officialRegistry, npcId) {
    const residencePermit = Object.values(
        officialRegistry.residencePermitsByNumber ?? {}
    ).find((permit) => permit.holderNpcId === npcId) ?? null;
    const workPermit = Object.values(
        officialRegistry.workPermitsByNumber ?? {}
    ).find((permit) => permit.holderNpcId === npcId) ?? null;

    return { residencePermit, workPermit };
}

// Ermittelt die aktive Fahndung einer Person, ohne den NPC-Record zu duplizieren.
export function getActiveWantedRecordForNpc(criminalDatabase, npcId) {
    return getActiveWantedRecords(criminalDatabase)
        .find((wantedRecord) => wantedRecord.npcId === npcId);
}
