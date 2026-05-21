import { gameStates, useGameStore } from '../store';

import { useCriminalDatabaseGenerator } from '../hooks/useCriminalDatabaseGenerator';

import { useCallback, useEffect } from 'react';

import { useNpcStore } from '../store';

export const Startmenu = () => {
    const ingameMode = useGameStore((state) => state.ingameMode);
    const gameState = useGameStore((state) => state.gameState);

    const setCriminalNpcIds = useNpcStore(state => state.setCriminalNpcIds);
    const criminalNpcIds = useNpcStore(state => state.criminalNpcIds);

    const generateDatabase = useCallback(() => {
        useCriminalDatabaseGenerator(setCriminalNpcIds);
    })

    const handleCriminalDatabase = useEffect(() => {
        console.log(criminalNpcIds);
    }, [criminalNpcIds, setCriminalNpcIds]);

    return (
        <>
            <div className={`startmenu ${gameState !== gameStates.MENU ? 'startmenu--hidden' : ''}`}>
                <h1>Highway Society</h1>
                <button onClick={() => {
                    ingameMode();

                    console.log("Datenbank wird in Kürze erstellt!");
                    generateDatabase();
                    console.log("Datenbank wurde erfolgreich erstellt.");
                }}>Spielen</button>
                <button>Optionen</button>
            </div>
        </>
    )
}