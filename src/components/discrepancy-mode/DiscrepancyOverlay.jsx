import { gameStates, useGameStore } from "../../store"

export const DiscrepancyOverlay =  () => {
    const gameState = useGameStore(state => state.gameState);

    if (gameState !== gameStates.DISCREPANCY) return;

    return (
        <>
            <div
                className="w-screen -z-0 top-0 h-screen bg-blue-400/10 fixed">
            </div>
        </>
    )
}