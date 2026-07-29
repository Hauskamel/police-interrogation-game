import { create } from "zustand";

const emptyWorldTruthDatabase = {
    npcsById: {},
    crimeRecordsById: {}
};

// ##### World Truth Store
// -----> Speichert intern bekannte Tatsachen, die noch kein Polizeiwissen darstellen.
// ---> Unbekannte Täter und ihre Straftaten bleiben dadurch relational per ID auflösbar.
export const useWorldTruthStore = create((set) => ({
    worldTruthDatabase: emptyWorldTruthDatabase,

    // -----> Fügt normalisierte NPC- und Crime-Records hinzu, ohne bestehende Weltwahrheit zu verlieren.
    registerWorldTruthRecords: ({ npcsById = {}, crimeRecordsById = {} } = {}) =>
        set((state) => ({
            worldTruthDatabase: {
                npcsById: {
                    ...state.worldTruthDatabase.npcsById,
                    ...npcsById
                },
                crimeRecordsById: {
                    ...state.worldTruthDatabase.crimeRecordsById,
                    ...crimeRecordsById
                }
            }
        })),

    // -----> Leert die interne Weltwahrheit beim Start einer neuen Spielsitzung.
    resetWorldTruthDatabase: () =>
        set({
            worldTruthDatabase: emptyWorldTruthDatabase
        })
}));

// ##### Traffic World-Truth Commit
// -----> Registriert Generator-Records ausdrücklich vor dem Speichern einer TrafficEntity.
// ---> Die zurückgegebene Entity behält danach nur Foreign Keys in truth.
export function registerTrafficEntityWorldTruth(trafficEntity) {
    const { worldTruthRecords, ...normalizedTrafficEntity } = trafficEntity;

    if (worldTruthRecords) {
        useWorldTruthStore
            .getState()
            .registerWorldTruthRecords(worldTruthRecords);
    }

    return normalizedTrafficEntity;
}
