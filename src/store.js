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

// TODO: useNpcStore verwenden, um Informationen jedes NPCs betreffend aktuell zu halten
// TODO: Betrifft alle NPCs, mit denen interagiert wird
//      - wantedList
//      - vllt sowas wie 'steht ein verhafteter NPC zur Abholung bereit?'
//      - verhafteter NPC Profile
export const useNpcStore = create ((set) => ({
    wantedList: [],
    arrestedNpcs: [],
    setWantedList: (array) =>
        set({
            wantedList: array
        }
    ),
}))


export const useCarStore = create((set) => ({
    cars: [],
    selectedCar: undefined,
    stoppedCar: undefined,
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
            cars: state.cars.map((car) => car.id === id ? {...car, stopped: true} : car)
        })
    ),
    // TODO: bitte nachschauen, wie das mit dem stoppedCar global gelöst werden soll
    setStoppedCar: (car) =>
        set({
            stoppedCar: car
        }
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
    carPosition: (id, x, z) =>
        set((state) => ({
            cars: state.cars.map((car) => car.id === id ? { ...car, position: {x: x, z: z} } : car)
        })
    )
}));