import { create } from "zustand";

export const gameStates = {
    MENU: "MENU",
    INGAME: "INGAME",
    COMPARE: "COMPARE",
    LAPTOP: "LAPTOP"
}

export const useGameStore = create((set) => ({
    gameState: gameStates.MENU,
    ingameMode: () => {
        set({
            gameState: gameStates.INGAME
        });
    },
    compareMode: () => {
        set({
            gameState: gameStates.COMPARE
        })
    },
    laptopMode: () => {
        set({
            gameState: gameStates.LAPTOP
        })
    }
}));


//  useNpcStore verwenden, um Informationen jedes NPCs betreffend aktuell zu halten
// Betrifft alle NPCs, mit denen interagiert wird
//      - wantedList
//      - vllt sowas wie 'steht ein verhafteter NPC zur Abholung bereit?'
//      - verhafteter NPC Profile
export const useNpcStore = create ((set) => ({
    criminalNpcIds: [], // speichert IDs der vor dem Spiel generierten NPCs, die in der Datenbank stehen
    wantedList: [], // TODO: muss noch definiert werden -> wahrscheinlich werden hier 3-5 NPC IDs aus 'criminalDatabaseNpcs' genommen
    arrestedNpcs: [],
    setCriminalNpcIds: (array) =>
        set({
            criminalNpcIds: array
        }
    ),
    setWantedList: (array) =>
        set({
            wantedList: array
        }
    )
}))







export const useCarStore = create((set) => ({
    playersPoliceCar: undefined,
    setPlayersPoliceCar: (car) =>
        set({
            playersPoliceCar: car
        })
    ,
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
    setCarPosition: (id, y, z) =>
        set((state) => ({
            cars: state.cars.map((car) => car.id === id ? { ...car, position: {y: y, z: z} } : car)
        })
    )
}));


export const useGuiVisibilityStatesStore = create(set => ({
    textboxesVisible: false,
    documentsVisible: false,
    setTextboxVisibilityState: (state => {
        set({
            textboxesVisible: state
        })
    }),
    setDocumentVisibilityState: (state => {
        set({
            documentsVisible: state
        })
    })
}))


export const useDiscrepandancyCompareStore = create(set => ({
    lastClickedUseCase: "",
    setLastClickedUseCase: (useCase) => set({
        lastClickedUseCase: useCase
    }),
    clearLastClickedUseCase: () => set({
        lastClickedUseCase: ""
    }),
    compareArray: [],
    setInformationToCompareArray: (information) => set((state) => ({
        compareArray: [...state.compareArray, information]
    })),
    removeInformationFromCompareArray: (useCase, documentDataField) => set((state) => ({
        compareArray: state.compareArray.filter((information) => !(information.useCase === useCase && information.documentDataField === documentDataField))
    })),
    clearCompareArray: () => set((state) => ({
        compareArray: state.compareArray.splice(0, state.compareArray.lenght)
    }))
}));