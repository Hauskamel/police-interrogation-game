import { create } from "zustand";

// ##### Compare Store
// -----> Hält Informationen, die im Vergleichsmodus gegenübergestellt werden.
export const useDiscrepandancyCompareStore = create((set) => ({
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
    clearCompareArray: () => set({
        compareArray: []
    })
}));
