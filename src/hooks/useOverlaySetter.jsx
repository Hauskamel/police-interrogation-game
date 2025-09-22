import { useGameStore, gameStates, useDiscrepandancyCompareStore } from "../store";

import { useEffect } from "react";


export const useOverlaySetter = () => {
    const gameState = useGameStore(state => state.gameState);
    const compareMode = useGameStore(state => state.compareMode);
    const discrepancyMode = useGameStore(state => state.discrepancyMode);

    const compareArray = useDiscrepandancyCompareStore(state => state.compareArray)


    useEffect(() => {
        if (compareArray.length === 2) {
            compareMode(); // mode when two key-value pairs from two individual documents have been selected
            return
        }

        if (compareArray.length === 1 && gameState === gameStates.COMPARE) {
            discrepancyMode();
        }
    }, [compareArray])
}