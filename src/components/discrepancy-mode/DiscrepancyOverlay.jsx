import { gameStates, useGameStore } from "../../store"

export const DiscrepancyOverlay =  () => {
    const gameState = useGameStore(state => state.gameState);

    if (gameState !== gameStates.DISCREPANCY && gameState !== gameStates.COMPARE) return

    // TODO: das bitte nochmal schöner schreiben
    if (gameState === gameStates.DISCREPANCY) {
        return (
            <>
                <div
                    className="w-screen -z-0 top-0 h-screen bg-blue-400/10 fixed">
                </div>
            </>
        )
    }

    if (gameState === gameStates.COMPARE) {
        return (
            <>
                <div
                    className="w-screen -z-0 top-0 h-screen bg-blue-800/10 fixed">
                </div>
            </>
        )
    }

   
}