import { create } from "zustand";

// ##### NPC Store
// -----> Hält NPC-Daten, die während einer Session spielrelevant sind.
// ---> NPCs, Straftaten und Dokumente sind getrennt gespeichert und per ID verknüpft.
export const useNpcStore = create((set) => ({
    criminalNpcIds: [],
    knownOffenderNpcIds: [],
    wantedRecordIds: [],
    arrestedNpcs: [],

    // criminalDatabase imitiert eine kleine relationale Datenbank im Frontend.
    criminalDatabase: {
        npcsById: {},
        crimeRecordsById: {},
        documentsById: {},
        wantedRecordsById: {},
        criminalNpcIds: [],
        knownOffenderNpcIds: [],
        wantedRecordIds: []
    },
    // -----> Schreibt die komplette fake database und hält die alten Listen parallel aktuell.
    setCriminalDatabase: (database) =>
        set({
            criminalDatabase: database,
            criminalNpcIds: database.criminalNpcIds,
            knownOffenderNpcIds: database.knownOffenderNpcIds,
            wantedRecordIds: database.wantedRecordIds
        }
    )
}));
