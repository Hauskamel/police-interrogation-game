import { gameStates ,useDiscrepandancyCompareStore,useGameStore } from "../../store";

export function DiscrepancyButton () {
    const gameState = useGameStore(state => state.gameState);
    const discrepancyMode = useGameStore((state) => state.discrepancyMode);
    const gameMode = useGameStore(state => state.gameMode);

    const compareArray = useDiscrepandancyCompareStore(state => state.compareArray);
    const clearCompareArray = useDiscrepandancyCompareStore(state => state.clearCompareArray);

    return (
        <>

            <div
                className="fixed bottom-5 right-200 flex gap-2 bg-sky-600 p-2 rounded-xl shadow-lg"
                onClick={() => {
                    if (gameState === gameStates.GAME) {
                        discrepancyMode()
                    } else {
                        gameMode()
                        clearCompareArray();
                    }
                }}>
                    {gameState === gameStates.GAME ? "Diskrepanz entdeckt" : "Zurück zur Befragung"}
            </div>
        </>
    );
}