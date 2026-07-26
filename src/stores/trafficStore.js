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

    removeTrafficEntity: (trafficEntityId) =>
        set((state) => ({
            trafficEntities: state.trafficEntities.filter((entity) => entity.id !== trafficEntityId),
        })),

    stopTrafficEntity: (trafficEntityId) =>
        set((state) => ({
            trafficEntities: state.trafficEntities.map((entity) => entity.id === trafficEntityId ? {...entity, stopped: true} : entity)
        })),

    continueTrafficEntity: (trafficEntityId) =>
        set((state) => ({
            trafficEntities: state.trafficEntities.map((entity) => entity.id === trafficEntityId ? {...entity, stopped: false } : entity)
        })),

    setSelectedTrafficEntity: (trafficEntity) =>
        set({
            selectedTrafficEntity: trafficEntity
        }),

    setTrafficEntityPosition: (trafficEntityId, y, z) =>
        set((state) => ({
            trafficEntities: state.trafficEntities.map((entity) => entity.id === trafficEntityId ? { ...entity, position: {y: y, z: z} } : entity)
        }))
}));
