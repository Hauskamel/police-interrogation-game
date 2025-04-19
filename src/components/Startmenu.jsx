import { gameStates, useGameStore } from '../store';

export const Startmenu = () => {

    const startGame = useGameStore((state) => state.startGame);
    const gameState = useGameStore((state) => state.gameState);

    return (
        <>
            <div className={`startmenu ${gameState !== gameStates.MENU ? 'startmenu--hidden' : ''}`}>
                <h1>LSPD: Traffic Ops</h1>
                <button onClick={() => startGame()}>Spielen</button>
                <button>Optionen</button>
            </div>
        </>
    )
}