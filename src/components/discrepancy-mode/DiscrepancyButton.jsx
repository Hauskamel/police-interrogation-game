import { gameStates ,useGameStore } from "../../store";

export function DiscrepancyButton () {
    const gameState = useGameStore(state => state.gameState);
    const discrepandancyMode = useGameStore((state) => state.discrepancyMode);
    const gameMode = useGameStore(state => state.gameMode)

    return (
        <>
            <div
                className="fixed bottom-5 right-200 flex gap-2 bg-sky-600 p-2 rounded-xl shadow-lg"
                onClick={() => gameState === gameStates.GAME ? discrepandancyMode() : gameMode()}>
                    {gameState === gameStates.GAME ? "Diskrepanz entdeckt" : "Zurück zur Befragung"}
            </div>
        </>
    )
}