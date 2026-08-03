import { WANTED_RECORD_STATUSES } from "@game/crimes";

// ##### Active Wanted Record Reader
// -----> Löst die aktiven Fahndungs-IDs zu eigenständigen Fahndungsrecords auf.
export function getActiveWantedRecords(criminalDatabase) {
    return (criminalDatabase?.wantedRecordIds ?? [])
        .map((recordId) => criminalDatabase.wantedRecordsById?.[recordId])
        .filter((record) => record?.status === WANTED_RECORD_STATUSES.ACTIVE);
}

// ##### Known Offender Candidate Reader
// -----> Liefert polizeibekannte Täter, gegen die aktuell keine aktive Fahndung besteht.
export function getKnownOffenderNpcIds(criminalDatabase, options = {}) {
    const wantedNpcIds = new Set(
        getActiveWantedRecords(criminalDatabase).map(({ npcId }) => npcId)
    );

    return filterUnavailableDatabaseNpcIds(
        criminalDatabase,
        criminalDatabase?.knownOffenderNpcIds ?? criminalDatabase?.criminalNpcIds ?? [],
        options
    )
        .filter((npcId) => !wantedNpcIds.has(npcId))
        .filter((npcId) => Boolean(criminalDatabase?.npcsById?.[npcId]));
}

// ##### Active Database Identity Filter
// -----> Entfernt Personen und deren registrierte Fahrzeuge, die bereits in der Welt aktiv sind.
export function filterUnavailableDatabaseNpcIds(
    criminalDatabase,
    npcIds,
    { excludedNpcIds = [], excludedVehicleIds = [] } = {}
) {
    const excludedNpcIdSet = new Set(excludedNpcIds);
    const excludedVehicleIdSet = new Set(excludedVehicleIds);

    return npcIds.filter((npcId) => {
        const npc = criminalDatabase?.npcsById?.[npcId];
        const registeredVehicleIsActive = (npc?.vehicleIds ?? []).some(
            (vehicleId) => excludedVehicleIdSet.has(vehicleId)
        );

        return !excludedNpcIdSet.has(npcId) && !registeredVehicleIsActive;
    });
}

// ##### Database NPC Candidate Picker
// -----> Nutzt eine konkrete Devtool-Auswahl oder zieht ansonsten zufällig einen gültigen Kandidaten.
// ---> Eine nicht zur Kategorie passende forced ID wird abgelehnt, damit kein falscher Status entsteht.
export function pickDatabaseNpcId(candidateNpcIds, forcedDatabaseNpcId) {
    if (forcedDatabaseNpcId) {
        return candidateNpcIds.includes(forcedDatabaseNpcId)
            ? forcedDatabaseNpcId
            : null;
    }

    if (candidateNpcIds.length === 0) return null;

    return candidateNpcIds[Math.floor(Math.random() * candidateNpcIds.length)];
}
