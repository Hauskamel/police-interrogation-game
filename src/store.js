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

export const useWantedListStore = create((set) => ({
    wantedList: [],
    setWantedList: (array) =>
        set({
            wantedList: array
        }
    ),
}))

export const useCarStore = create((set) => ({
    cars: [],
    selectedCar: undefined,
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
    setSelectedCar: (car) =>
        set({
            selectedCar: car
        }
    ),
    carPosition: (id, x) =>
        set((state) => ({
            cars: state.cars.map((car) => car.id === id ? { ...car, position: {x: x} } : car)
        })
    ),
    stoppedCarPosition: (id, x, z) =>
        set((state) => ({
            cars: state.cars.map((car) => car.id === id ? { ...car, position: {x: x, z: z} } : car)
        })
    )
}));