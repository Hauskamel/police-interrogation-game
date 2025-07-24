import { useGameStore, gameStates, useDiscrepandancyCompareStore } from "../store";

import { useEffect } from "react";


export const useOverlaySetter = () => {
    const gameState = useGameStore(state => state.gameState);
    const compareMode = useGameStore(state => state.compareMode);
    const discrepancyMode = useGameStore(state => state.discrepancyMode);

    const compareArray = useDiscrepandancyCompareStore(state => state.compareArray)


    useEffect(() => {

        console.log(compareArray);
        


        if (compareArray.length === 2) {
            compareMode();
            return
        }

        if (compareArray.length === 1 && gameState === gameStates.COMPARE) {
            discrepancyMode();
        }
    }, [compareArray])
}