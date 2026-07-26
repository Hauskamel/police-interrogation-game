import { create } from "zustand";

export const gameStates = {
    MENU: "MENU",
    INGAME: "INGAME",
    DISCREPANCY: "DISCREPANCY",
    COMPARE: "COMPARE",
    LAPTOP: "LAPTOP"
}

// ##### Game Store
// -----> Hält den groben Modus, in dem sich das Spiel gerade befindet.
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
