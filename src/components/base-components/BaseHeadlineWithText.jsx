// This component is used in the drivers license and car documents
import { useEffect, useState } from "react"
import { gameStates, useGameStore, useDiscrepandancyCompareStore } from "../../store"

import "../../../assets/css/blink.css";

import { useDocumentClickHandler } from "../../hooks/useDocumentClickHandler.jsx"

// NOTE: noch einbauen: oneliner kann auf true gestellt werden, damit key und value in einer Zeile stehen
export const BaseHeadlineWithText = ({ useCase, headline, data, documentDataField, individualWidth }) => {
    const [isSelected, setIsSelected] = useState(false)
    const gameState = useGameStore(state => state.gameState)

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
    console.log(compareArray);
    

    // console.log(comparedData);
    

    const dataValuesAreEqual = comparedData.every((data) => {
        // console.log(data);
        data === comparedData[0]
    });


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
            documentDataField,
            headline,
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

     // ${dataValuesAreEqual ? "" : "blink-text"} 

    return (
        <>
            <div className={` ${!dataValuesAreEqual && isSelected ? "blink-text" : ""}  ${isSelected ? "text-blue-700" : ""} ${individualWidth === "" ? "w-1/2" : "w-1/1"} `} onClick={handleClick}>
                <strong>{headline ? headline : ""}</strong>
                <p>{data}</p>
            </div>
        </>
    )
}