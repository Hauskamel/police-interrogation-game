import { React, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useDocumentClickHandler } from "../../hooks/useDocumentClickHandler";

import { useGameStore, useDiscrepandancyCompareStore, gameStates } from "../../store";

export function BaseImage ({ useCase, data, stoppedCar }) {
    const [isSelected, setIsSelected] = useState(false);
    const gameState = useGameStore(state => state.gameState);

    // ###########
    // compare array states
    // for storing the clicked document information (in descrepancy mode) when comparing documents
    // ###########
    const compareArray = useDiscrepandancyCompareStore(state => state.compareArray);
    const setInformationToCompareArray = useDiscrepandancyCompareStore(state => state.setInformationToCompareArray);
    const removeInformationFromCompareArray = useDiscrepandancyCompareStore(state => state.removeInformationFromCompareArray);
    const lastClickedUseCase = useDiscrepandancyCompareStore(state => state.lastClickedUseCase);
    const setLastClickedUseCase = useDiscrepandancyCompareStore(state => state.setLastClickedUseCase);
    const clearLastClickedUseCase = useDiscrepandancyCompareStore(state => state.clearLastClickedUseCase);

    // Reset select status to sync with empty 'compareArray'
    useEffect(() => {
        if (gameState === gameStates.GAME) {
            setIsSelected(false);
        }
    }, [compareArray, gameState]);

    // Handling click event when comparing
    const handleClick = () => {
        useDocumentClickHandler({
            useCase,
            data,
            setInformationToCompareArray,
            removeInformationFromCompareArray,
            lastClickedUseCase,
            setLastClickedUseCase,
            clearLastClickedUseCase,
            isSelected,
            setIsSelected,
            gameState,
            compareArray
        });
    }

    return (
        <>
            <AnimatePresence>   
                {/* {React.Children.map(children, (child) =>
                        child ? ( */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full h-full"
                                style={{
                                    position: 'relative',
                                    left: "32px",
                                    top: "32px",
                                    cursor: 'move'
                                }}
                            >
                                <div className={`${isSelected ? "border-20 border-blue-700" : ""}`} onClick={handleClick}>
                                    <img src={`/images/driver/${data}`} className="w-20"/>
                                </div>
                            </motion.div>
                        {/* ) : null
                    )}; */}
                
            </AnimatePresence>





















        </>
    )

}