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
export function getKnownOffenderNpcIds(criminalDatabase) {
    const wantedNpcIds = new Set(
        getActiveWantedRecords(criminalDatabase).map(({ npcId }) => npcId)
    );

    return (criminalDatabase?.knownOffenderNpcIds ?? criminalDatabase?.criminalNpcIds ?? [])
        .filter((npcId) => !wantedNpcIds.has(npcId))
        .filter((npcId) => Boolean(criminalDatabase?.npcsById?.[npcId]));
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
