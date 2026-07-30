import { create } from "zustand";

// ##### NPC Store
// -----> Hält NPC-Daten, die während einer Session spielrelevant sind.
// ---> NPCs, Straftaten und Dokumente sind getrennt gespeichert und per ID verknüpft.
export const useNpcStore = create((set) => ({
    arrestedNpcs: [],

    // criminalDatabase imitiert eine kleine relationale Datenbank im Frontend.
    criminalDatabase: {
        npcsById: {},
        crimeRecordsById: {},
        wantedRecordsById: {},
        vehiclesById: {},
        criminalNpcIds: [],
        knownOffenderNpcIds: [],
        wantedRecordIds: [],
        vehicleIds: []
    },
    // -----> Ersetzt die komplette relationale Spieldatenbank.
    // ---> Indizes wie criminalNpcIds liegen ausschließlich innerhalb dieser Datenbank.
    setCriminalDatabase: (database) =>
        set({
            criminalDatabase: database
        }
    )
}));
