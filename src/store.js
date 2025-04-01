import {create} from "zustand";

export const useCarStore = create((set) => ({
    cars: [],
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
}));
