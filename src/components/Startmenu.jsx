import { gameStates, useGameStore } from '../store';

// import { criminalDatabaseGenerator } from '../utils/generators/criminalDatabaseGenerator';
import { useCriminalDatabaseGenerator } from '../hooks/useCriminalDatabaseGenerator';
import { useEffect } from 'react';

export const Startmenu = () => {
    const ingameMode = useGameStore((state) => state.ingameMode);
    const gameState = useGameStore((state) => state.gameState);


    const criminalDatabseGenerator = useEffect(() => {
        useCriminalDatabaseGenerator();
    }, [])
    

    return (
        <>
            <div className={`startmenu ${gameState !== gameStates.MENU ? 'startmenu--hidden' : ''}`}>
                <h1>Highway Society</h1>
                <button onClick={() => {
                    ingameMode();

                    console.log("creating criminal database...");
                    {criminalDatabaseGenerator} // TODO: HIER WEITERMACHEN (HAB KEINE AHNUNG MEHR VON REACT, SOS!!!!!!!!)
                    console.log("database has been generated.");
                }}>Spielen</button>
                <button>Optionen</button>
            </div>
        </>
    )
}