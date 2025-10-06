import { gameStates, useGameStore } from '../store';

export const Startmenu = () => {
    const gameMode = useGameStore((state) => state.gameMode);
    const gameState = useGameStore((state) => state.gameState);

    return (
        <>
            <div className={`startmenu ${gameState !== gameStates.MENU ? 'startmenu--hidden' : ''}`}>
                <h1>Highway Society</h1>
                <button onClick={() => gameMode()}>Spielen</button>
                <button>Optionen</button>
            </div>
        </>
    )
}