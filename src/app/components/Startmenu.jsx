import { useCallback } from "react";

import { generateCriminalDatabase } from "@game/crimes/generators";
import {
    gameStates,
    useGameStore,
    useInspectionStore,
    useNpcStore,
    usePoliceLaptopStore,
    useWorldTruthStore
} from "@stores";

export const Startmenu = () => {
    const ingameMode = useGameStore((state) => state.ingameMode);
    const gameState = useGameStore((state) => state.gameState);

    const setCriminalDatabase = useNpcStore((state) => state.setCriminalDatabase);
    const resetWorldTruthDatabase = useWorldTruthStore(
        (state) => state.resetWorldTruthDatabase
    );
    const resetInspectionState = useInspectionStore(
        (state) => state.resetInspectionState
    );
    const resetPoliceLaptopState = usePoliceLaptopStore(
        (state) => state.resetPoliceLaptopState
    );

    // -----> Baut die kriminelle NPC-Datenbank einmalig beim Spielstart auf.
    const generateDatabase = useCallback(() => {
        setCriminalDatabase(generateCriminalDatabase({
            criminalNpcCount: 10,
            wantedNpcCount: 4
        }));
    }, [setCriminalDatabase]);

    // -----> Initialisiert die Datenbank und wechselt anschließend in den Spielmodus.
    const handleStartGame = () => {
        resetWorldTruthDatabase();
        resetInspectionState();
        resetPoliceLaptopState();
        generateDatabase();
        ingameMode();
    };

    return (
        <>
            <div className={`startmenu ${gameState !== gameStates.MENU ? 'startmenu--hidden' : ''}`}>
                <h1>Highway Society</h1>
                <button onClick={handleStartGame}>Spielen</button>
                <button>Optionen</button>
            </div>
        </>
    )
}
