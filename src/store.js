import { create } from "zustand";

export const gameStates = {
    MENU: "MENU",
    GAME: "GAME",
}

export const useGameStore = create((set) => ({
    gameState: gameStates.MENU,
    startGame: () => {
        set({
            gameState: gameStates.GAME,
        });
    },
}));

export const useCarStore = create((set) => ({
    cars: [],
    addCar: (newCar) =>
        set((state) => ({
            cars: [...state.cars, newCar],
        })
    ),
    removeCar: (id) =>
        set((state) => ({
            cars: state.cars.filter((car) => car.id !== id),
        })
    ),
    stopCar: (id) =>
        set((state) => ({
            cars: state.cars.map((car) => car.id === id ? {...car, stopped: true } : car)
        })
    ),
    continueCar: (id) =>
        set((state) => ({
            cars: state.cars.map((car) => car.id === id ? {...car, stopped: false } : car)
        })
    ),
    updateCarPosition: (id, x) =>
        set((state) => ({
            cars: state.cars.map((car) => car.id === id ? { ...car, position: {x: x} } : car)
        })
    ),
    updateStoppedCarPosition: (id, x, z) =>
        set((state) => ({
            cars: state.cars.map((car) => car.id === id ? { ...car, position: {x: x, z: z} } : car)
        })
    ),

    setVisibilityStatusDriversLicense: (id, status) => 
        set((state) => ({
            cars: state.cars.map((car) => car.id === id ? { ...car, handedOutDriversLicense: status } : car)
        })
    ),

    setVisibilityStatusVehicleDocuments: (id, status) => 
        set((state) => ({
            cars: state.cars.map((car) => car.id === id ? { ...car, handedOutVehicleDocuments: status } : car)
        })
    ),

}));