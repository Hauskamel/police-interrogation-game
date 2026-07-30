// ##### Police Database Search
// -----> Enthält die reinen Such- und Relationsfunktionen des spielbaren Laptops.
// ---> Die Funktionen erhalten ausschließlich criminalDatabase und kennen keine World-Truth-Daten.

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
export function searchDriverLicenses(criminalDatabase, query) {
    if (!query.trim()) return [];

    return (criminalDatabase.criminalNpcIds ?? [])
        .map((npcId) => criminalDatabase.npcsById[npcId])
        .filter((npc) => npc?.driversLicense)
        .filter((npc) => {
            return matchesQuery(query, [npc.driversLicense.licenseNumber]);
        });
}

// Sucht registrierte Fahrzeuge anhand von Kennzeichen oder Zulassungsnummer.
export function searchVehicles(criminalDatabase, query) {
    if (!query.trim()) return [];

    return (criminalDatabase.vehicleIds ?? [])
        .map((vehicleId) => criminalDatabase.vehiclesById?.[vehicleId])
        .filter(Boolean)
        .filter((vehicle) => {
            return matchesQuery(query, [
                vehicle.carDocumentsData?.plateNumber,
                vehicle.carDocumentsData?.carRegistrationNumber
            ]);
        });
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

// Ermittelt die aktive Fahndung einer Person, ohne den NPC-Record zu duplizieren.
export function getActiveWantedRecordForNpc(criminalDatabase, npcId) {
    return getActiveWantedRecords(criminalDatabase)
        .find((wantedRecord) => wantedRecord.npcId === npcId);
}
