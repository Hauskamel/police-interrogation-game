import { gameStates, useGameStore } from '../stores';

import { generateCriminalDatabase } from '../game/crimes/generators';

import { useCallback, useEffect } from 'react';

import { useNpcStore } from '../stores';

export const Startmenu = () => {
    const ingameMode = useGameStore((state) => state.ingameMode);
    const gameState = useGameStore((state) => state.gameState);

    const setCriminalDatabase = useNpcStore(state => state.setCriminalDatabase);
    const criminalNpcIds = useNpcStore(state => state.criminalNpcIds);

    // -----> Baut die kriminelle NPC-Datenbank einmalig beim Spielstart auf.
    const generateDatabase = useCallback(() => {
        setCriminalDatabase(generateCriminalDatabase({
            criminalNpcCount: 10,
            wantedNpcCount: 4
        }));
    }, [setCriminalDatabase])

    useEffect(() => {
        console.log(criminalNpcIds);
    }, [criminalNpcIds]);

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
