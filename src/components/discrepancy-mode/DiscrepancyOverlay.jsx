import { gameStates, useGameStore } from "../../store"

export const DiscrepancyOverlay =  () => {
    const gameState = useGameStore(state => state.gameState);

    if (gameState !== gameStates.DISCREPANCY && gameState !== gameStates.COMPARE) return

    const overlayColor = gameState === gameStates.DISCREPANCY ? "bg-blue-400/10" : "bg-blue-800/30"

    if (gameState === gameStates.DISCREPANCY) {
        return (
            <>
                <div
                    className={` ${overlayColor} w-screen -z-0 top-0 h-screen fixed`}>
                </div>
            </>
        )
    }

    if (gameState === gameStates.COMPARE) {
        return (
            <>
                <div
                    className="w-screen -z-0 top-0 h-screen bg-blue-800/30 fixed">
                </div>
            </>
        )
    }

   
}