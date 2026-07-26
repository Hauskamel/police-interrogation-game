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
    selectedTrafficEntity: undefined,

    addTrafficEntity: (trafficEntity) =>
        set((state) => ({
            trafficEntities: [...state.trafficEntities, trafficEntity],
        })),

    // -----> Aktualisiert eine TrafficEntity und dieselbe Referenz in der aktuellen Auswahl.
    // ---> Devtools nutzen diese Funktion, damit Weltzustand und Debug-Panel sofort dieselben Daten sehen.
    updateTrafficEntity: (trafficEntityId, updater) =>
        set((state) => {
            const currentEntity = state.trafficEntities.find((entity) => entity.id === trafficEntityId);
            if (!currentEntity) return state;

            const updatedEntity = typeof updater === "function"
                ? updater(currentEntity)
                : { ...currentEntity, ...updater };

            return {
                trafficEntities: state.trafficEntities.map((entity) =>
                    entity.id === trafficEntityId ? updatedEntity : entity
                ),
                selectedTrafficEntity: state.selectedTrafficEntity?.id === trafficEntityId
                    ? updatedEntity
                    : state.selectedTrafficEntity
            };
        }),

    removeTrafficEntity: (trafficEntityId) =>
        set((state) => ({
            trafficEntities: state.trafficEntities.filter((entity) => entity.id !== trafficEntityId),
        })),

    stopTrafficEntity: (trafficEntityId) =>
        set((state) => {
            const stoppedEntity = state.trafficEntities
                .find((entity) => entity.id === trafficEntityId);
            const updatedStoppedEntity = stoppedEntity
                ? { ...stoppedEntity, stopped: true }
                : null;

            return {
                trafficEntities: state.trafficEntities.map((entity) =>
                    entity.id === trafficEntityId ? updatedStoppedEntity : entity
                ),
                selectedTrafficEntity: state.selectedTrafficEntity?.id === trafficEntityId
                    ? updatedStoppedEntity
                    : state.selectedTrafficEntity
            };
        }),

    continueTrafficEntity: (trafficEntityId) =>
        set((state) => {
            const continuedEntity = state.trafficEntities
                .find((entity) => entity.id === trafficEntityId);
            const updatedContinuedEntity = continuedEntity
                ? { ...continuedEntity, stopped: false }
                : null;

            return {
                trafficEntities: state.trafficEntities.map((entity) =>
                    entity.id === trafficEntityId ? updatedContinuedEntity : entity
                ),
                selectedTrafficEntity: state.selectedTrafficEntity?.id === trafficEntityId
                    ? updatedContinuedEntity
                    : state.selectedTrafficEntity
            };
        }),

    setSelectedTrafficEntity: (trafficEntity) =>
        set({
            selectedTrafficEntity: trafficEntity
        }),

    setTrafficEntityPosition: (trafficEntityId, y, z) =>
        set((state) => ({
            trafficEntities: state.trafficEntities.map((entity) => entity.id === trafficEntityId ? { ...entity, position: {y: y, z: z} } : entity)
        }))
}));
