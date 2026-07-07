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
    discrepancyMode: () => {
        set({
            gameState: gameStates.DISCREPANCY
        })
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


// ##### NPC Store
// -----> Hält NPC-Daten, die während einer Session spielrelevant sind.
// ---> criminalDatabase imitiert eine kleine relationale Datenbank im Frontend:
// ---> NPCs, Straftaten und Dokumente sind getrennt gespeichert und per ID verknüpft.
export const useNpcStore = create ((set) => ({
    criminalNpcIds: [], // speichert IDs der vor dem Spiel generierten NPCs, die in der Datenbank stehen
    wantedList: [],
    arrestedNpcs: [],
    criminalDatabase: {
        npcsById: {},
        crimeRecordsById: {},
        documentsById: {},
        criminalNpcIds: [],
        wantedList: []
    },
    // -----> Schreibt die komplette fake database und hält die alten Listen parallel aktuell.
    setCriminalDatabase: (database) =>
        set({
            criminalDatabase: database,
            criminalNpcIds: database.criminalNpcIds,
            wantedList: database.wantedList
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
