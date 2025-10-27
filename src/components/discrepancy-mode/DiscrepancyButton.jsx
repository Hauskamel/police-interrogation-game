import { gameStates ,useDiscrepandancyCompareStore,useGameStore } from "../../store";

export function DiscrepancyButton () {
    const gameState = useGameStore(state => state.gameState);
    const discrepancyMode = useGameStore((state) => state.discrepancyMode);
    const gameMode = useGameStore(state => state.gameMode);
    
    const clearCompareArray = useDiscrepandancyCompareStore(state => state.clearCompareArray);
    const clearLastClickedUseCase = useDiscrepandancyCompareStore(state => state.clearLastClickedUseCase);

    return (
        <>
            <div
                className="fixed bottom-5 z-2 right-200 flex gap-2 bg-sky-600 p-2 rounded-xl shadow-lg"
                onClick={() => {
                    if (gameState === gameStates.GAME) {
                        discrepancyMode()
                    } else {
                        gameMode()
                        clearLastClickedUseCase();
                        clearCompareArray();
                    }
                }}>
                    {gameState === gameStates.GAME ? "Diskrepanz entdeckt" : "Zurück zur Befragung"}
            </div>
        </>
    );
}