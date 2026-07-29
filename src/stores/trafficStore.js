import { create } from "zustand";

// ##### Traffic Store
// -----> Hält alle aktiven TrafficEntities, die gerade in der Welt unterwegs sind.
// ---> Eine TrafficEntity besteht aus Spawnzustand, Fahrzeug, Fahrer und Polizeiwissen.
export const useTrafficStore = create((set) => ({
    playerPoliceVehicle: undefined,
    setPlayerPoliceVehicle: (vehicle) =>
        set({
            playerPoliceVehicle: vehicle
        }),

    trafficEntities: [],
    selectedVehicleId: null,
    revealedDriverIdentityByTrafficEntityId: {},

    // -----> Speichert eine bereits vorbereitete TrafficEntity im aktiven Weltzustand.
    // ---> World-Truth-Registrierung erfolgt vorher ausdrücklich am Spawn-Commit.
    addTrafficEntity: (trafficEntity) => {
        if (trafficEntity.worldTruthRecords) {
            throw new Error(
                "TrafficEntity must register worldTruthRecords before addTrafficEntity."
            );
        }

        let storedTrafficEntity = trafficEntity;

        set((state) => {
            // Auch direkte Store-Aufrufe dürfen keine zweite angehaltene Entity erzeugen.
            if (trafficEntity.stopped && hasOtherStoppedEntity(state, trafficEntity.id)) {
                storedTrafficEntity = {
                    ...trafficEntity,
                    stopped: false
                };
            }

            return {
                trafficEntities: [...state.trafficEntities, storedTrafficEntity],
            };
        });

        return storedTrafficEntity;
    },

    // -----> Aktualisiert eine TrafficEntity und dieselbe Referenz in der aktuellen Auswahl.
    // ---> Devtools nutzen diese Funktion, damit Weltzustand und Debug-Panel sofort dieselben Daten sehen.
    updateTrafficEntity: (entityId, updater) =>
        set((state) => {
            const currentEntity = state.trafficEntities.find((entity) => entity.id === entityId);
            if (!currentEntity) return state;

            const updatedEntity = typeof updater === "function"
                ? updater(currentEntity)
                : { ...currentEntity, ...updater };

            if (updatedEntity.stopped && hasOtherStoppedEntity(state, entityId)) {
                return state;
            }

            return {
                trafficEntities: state.trafficEntities.map((entity) =>
                    entity.id === entityId ? updatedEntity : entity
                )
            };
        }),

    removeTrafficEntity: (entityId) =>
        set((state) => {
            const {
                [entityId]: removedIdentity,
                ...remainingRevealedIdentities
            } = state.revealedDriverIdentityByTrafficEntityId;

            return {
                trafficEntities: state.trafficEntities.filter((entity) => entity.id !== entityId),
                selectedVehicleId: state.selectedVehicleId === entityId
                    ? null
                    : state.selectedVehicleId,
                revealedDriverIdentityByTrafficEntityId: removedIdentity
                    ? remainingRevealedIdentities
                    : state.revealedDriverIdentityByTrafficEntityId
            };
        }),

    stopTrafficEntity: (entityId) =>
        set((state) => {
            if (hasOtherStoppedEntity(state, entityId)) {
                return state;
            }

            const stoppedEntity = state.trafficEntities
                .find((entity) => entity.id === entityId);
            const updatedStoppedEntity = stoppedEntity
                ? { ...stoppedEntity, stopped: true }
                : null;

            return {
                trafficEntities: state.trafficEntities.map((entity) =>
                    entity.id === entityId ? updatedStoppedEntity : entity
                )
            };
        }),

    continueTrafficEntity: (entityId) =>
        set((state) => {
            const continuedEntity = state.trafficEntities
                .find((entity) => entity.id === entityId);
            const updatedContinuedEntity = continuedEntity
                ? { ...continuedEntity, stopped: false }
                : null;

            return {
                trafficEntities: state.trafficEntities.map((entity) =>
                    entity.id === entityId ? updatedContinuedEntity : entity
                )
            };
        }),

    setSelectedVehicleId: (vehicleId) =>
        set({
            selectedVehicleId: vehicleId
        }),

    // -----> Merkt sich, welche Fahreridentitaet der Spieler in dieser Kontrolle bereits gesehen hat.
    // ---> Die npcId verhindert, dass Wissen nach einem Dev-Austausch auf eine andere Person uebertragen wird.
    revealDriverIdentity: (entityId, npcId) =>
        set((state) => ({
            revealedDriverIdentityByTrafficEntityId: {
                ...state.revealedDriverIdentityByTrafficEntityId,
                [entityId]: npcId
            }
        })),

    setTrafficEntityPosition: (entityId, y, z) =>
        set((state) => {
            const position = { y, z };

            return {
                trafficEntities: state.trafficEntities.map((entity) =>
                    entity.id === entityId
                        ? { ...entity, position }
                        : entity
                )
            };
        })
}));

// ##### Selected Traffic Entity Selector
// -----> Leitet die ausgewählte TrafficEntity aus ID und kanonischer Entity-Liste ab.
// ---> Dadurch wird das vollständige Objekt nicht mehr als zweite Zustandskopie gespeichert.
export function selectSelectedTrafficEntity(state) {
    return state.trafficEntities.find(
        (entity) => entity.id === state.selectedVehicleId
    );
}

// ##### Selected Vehicle Selector
// -----> Löst sowohl TrafficEntities als auch das eigene Polizeifahrzeug aus derselben Auswahl-ID auf.
export function selectSelectedVehicle(state) {
    if (state.playerPoliceVehicle?.id === state.selectedVehicleId) {
        return state.playerPoliceVehicle;
    }

    return selectSelectedTrafficEntity(state);
}

// ##### Stopped Traffic Guard
// -----> Prüft, ob bereits eine andere TrafficEntity kontrolliert wird.
// ---> Store-Aktionen verwenden den Guard als letzte Invariante unterhalb der UI.
function hasOtherStoppedEntity(state, entityId) {
    return state.trafficEntities.some(
        (entity) => entity.id !== entityId && entity.stopped
    );
}
