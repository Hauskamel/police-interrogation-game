// This component is used in the drivers licence and car documents

import { useEffect, useState } from "react"
import { gameStates, useGameStore, useDiscrepandancyCompareStore } from "../../store"

// NOTE: noch einbauen: oneliner kann auf true gestellt werden, damit key und value in einer Zeile stehen
export const BaseHeadlineWithText = ({ useCase, headline, data, id, individualWidth }) => {
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

    // Reset select status to sync with empty 'compareArray'
    useEffect(() => {
        if (gameState === gameStates.GAME) {
            setIsSelected(false);
        }
    }, [compareArray, gameState]);

    // Handling click event when comparing
    const handleClick = () => {
        if (isSelected) clearLastClickedUseCase();

        // checks whether 'BaseHeadlineWithText' can be clicked to compare
        // disables possiblity to check two datasets from the same document) return;
        if (((gameState !== gameStates.DISCREPANCY) || compareArray.length > 1) && !isSelected || (!isSelected && lastClickedUseCase === useCase)) return;

        // check if Headline/Text was already selected (already in compareArray)...
        if (!isSelected) {
            // ... if not save set it to 'isSelected', add the information to the 'compareArray'
            setIsSelected(prev => !prev);
            setInformationToCompareArray({
                id: id,
                useCase: useCase,
                headline: headline,
                data: data
            })
            setLastClickedUseCase(useCase)
            return
        }

        // finds the clicked object by searching the useCase (e.g. 'driversLicence') and the id
        // const obj = compareArray.find(item => item.useCase === useCase && item.id === id);
        // if (obj) removeInformationFromCompareArray(obj.useCase, obj.id);


        if (isSelected) removeInformationFromCompareArray(obj.useCase, obj.id);
        setIsSelected(prev => !prev); // switches between true and false
        return // return so not set again to compareArray
    }

    return (
        <>
            <div className={` ${isSelected ? "text-orange-400" : ""} ${individualWidth === "" ? "w-1/2" : "w-1/1"} `} onClick={handleClick}>
                <strong>{headline}</strong>
                {
                    Array.isArray(data) ? (
                        <div className="flex">
                            {data.map((p, idx) => (
                                <p className={idx > 0 ? "ml-3" : ""} key={idx}>{p}</p>
                            ))}
                        </div>
                    ) : (
                        <p>{data}</p>
                    )
                }
            </div>
        </>
    )
}