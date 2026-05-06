import { gameStates, useGameStore } from '../store';

import { useCriminalDatabaseGenerator } from '../hooks/useCriminalDatabaseGenerator';

export const Startmenu = () => {
    const ingameMode = useGameStore((state) => state.ingameMode);
    const gameState = useGameStore((state) => state.gameState);


    const generateCriminalDatabse = useCriminalDatabaseGenerator();
    

    return (
        <>
            <div className={`startmenu ${gameState !== gameStates.MENU ? 'startmenu--hidden' : ''}`}>
                <h1>Highway Society</h1>
                <button onClick={() => {
                    ingameMode();

                    console.log("Datenbank wird in Kürze erstellt!");
                    generateCriminalDatabse();
                    console.log("Datenbank wurde erfolgreich erstellt.");
                }}>Spielen</button>
                <button>Optionen</button>
            </div>
        </>
    )
}