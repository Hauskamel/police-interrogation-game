import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "../../../assets/css/blink.css";

import { useDocumentClickHandler } from "../../hooks/useDocumentClickHandler";

import { useGameStore, useDiscrepandancyCompareStore, gameStates } from "../../store";

export function BaseImage ({ useCase, data }) {
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

    const comparedData = compareArray.map(field => field.data);
    const dataValuesAreEqual = comparedData.every(data => data === comparedData[0]);

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
            <div className={`inline-block ${dataValuesAreEqual ? "" : "blink-border"} ${isSelected ? "border-4 border-blue-700" : ""}`} onClick={handleClick}>
                <img src={`/images/driver/${data}`} className="w-20" alt="" />
            </div>
        </>
    )

}