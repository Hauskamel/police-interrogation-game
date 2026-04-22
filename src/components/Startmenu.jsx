import { gameStates, useGameStore } from '../store';

import { criminalDatabaseGenerator } from '../utils/generators/criminalDatabaseGenerator';

export const Startmenu = () => {
    const ingameMode = useGameStore((state) => state.ingameMode);
    const gameState = useGameStore((state) => state.gameState);

    return (
        <>
            <div className={`startmenu ${gameState !== gameStates.MENU ? 'startmenu--hidden' : ''}`}>
                <h1>Highway Society</h1>
                <button onClick={() => {
                    ingameMode();

                    console.log("creating criminal database...");
                    criminalDatabaseGenerator();
                }}>Spielen</button>
                <button>Optionen</button>
            </div>
        </>
    )
}