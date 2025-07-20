import { create } from "zustand";

export const gameStates = {
    MENU: "MENU",
    GAME: "GAME",
    DISCREPENDANCY: "DISCREPENDANCY"
}

export const useGameStore = create((set) => ({
    gameState: gameStates.MENU,

    gameMode: () => {
        set({
            gameState: gameStates.GAME
        });
    },
    discrepancyMode: () => {
        set({
            gameState: gameStates.DISCREPENDANCY
        })
    }

}));

//  useNpcStore verwenden, um Informationen jedes NPCs betreffend aktuell zu halten
// Betrifft alle NPCs, mit denen interagiert wird
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



export const useTextboxStore = create(set => ({
    textboxesVisible: false,
    setTextboxVisibilityState: (state => {
        set({
            textboxesVisible: state
        })
    })
}))



export const useDiscrepandancyComparisonStore = create(set => ({
    compareArray: []
}))