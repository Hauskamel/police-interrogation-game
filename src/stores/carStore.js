import { create } from "zustand";

// ##### Car Store
// -----> Hält Fahrzeuge, Polizeiauto und aktuell ausgewähltes Fahrzeug.
export const useCarStore = create((set) => ({
    playersPoliceCar: undefined,
    setPlayersPoliceCar: (car) =>
        set({
            playersPoliceCar: car
        }),
    cars: [],
    selectedCar: undefined,
    addCar: (newCar) =>
        set((state) => ({
            cars: [...state.cars, newCar],
        })),
    removeCar: (id) =>
        set((state) => ({
            cars: state.cars.filter((car) => car.id !== id),
        })),
    stopCar: (id) =>
        set((state) => ({
            cars: state.cars.map((car) => car.id === id ? {...car, stopped: true} : car)
        })),
    continueCar: (id) =>
        set((state) => ({
            cars: state.cars.map((car) => car.id === id ? {...car, stopped: false } : car)
        })),
    setSelectedCar: (car) =>
        set({
            selectedCar: car
        }),
    setCarPosition: (id, y, z) =>
        set((state) => ({
            cars: state.cars.map((car) => car.id === id ? { ...car, position: {y: y, z: z} } : car)
        }))
}));
