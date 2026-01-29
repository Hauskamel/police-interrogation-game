import {gameStates, useGameStore, useNpcStore} from "../store.js";
import { useEffect } from "react";
import { generateWantedListProfiles } from "../utils/generators/wantedListProfilesGenerator.js";

export function useSetWantedList () {
    const gameState = useGameStore((state) => state.gameState)
    const setWantedList = useNpcStore((state) => state.setWantedList)
    

    // creates wanted list profiles
    useEffect(() => {
        if (gameState === gameStates.MENU) {
            setWantedList(generateWantedListProfiles());
        }
    }, [gameState, setWantedList])
    
}