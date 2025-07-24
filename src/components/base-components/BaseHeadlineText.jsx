// This component is used in the drivers licence and car documents

import { useEffect, useState } from "react"
import { gameStates, useGameStore, useDiscrepandancyCompareStore } from "../../store"


// NOTE: noch einbauen: oneliner kann auf true gestellt werden, damit key und value in einer Zeile stehen
export const BaseHeadlineText = ({useCase, headline, data, id}) => {
    const [isSelected, setIsSelected] = useState(false)

    const gameState = useGameStore(state => state.gameState);

    const compareArray = useDiscrepandancyCompareStore(state => state.compareArray)
    const setInformationToCompareArray = useDiscrepandancyCompareStore(state => state.setInformationToCompareArray)
    const removeInformationFromCompareArray = useDiscrepandancyCompareStore(state => state. removeInformationFromCompareArray)
    


    // reset select status to sync with empty 'compareArray'
    useEffect(() => {
        if (gameState === gameStates.GAME) {
            setIsSelected(false)
        }
    }, [compareArray])


    // handling click event when comparing
    const handleClick = () => {
        // checks wether 'BaseHeadlineText' can be clicked on to compare 
        // by checking the current gameState and the 'compareArray' length
        if (((gameState !== gameStates.DISCREPANCY) || compareArray.length > 1) && !isSelected) return // . !isSelected is important to know wether this box is already in the compareArray or not
        
        // check if Headline/Text was already selected (already in compareArray)...
        if (!isSelected) {
            // ... if not safe set it to 'isSelected' the information to the 'compareArray'
            setIsSelected(prev => !prev)
            setInformationToCompareArray({
                id: id,
                useCase: useCase,
                headline: headline,
                data: data
            })
            return;
        }

        // finds the clicked object by searchin the useCase f.e. 'driversLicence' and the id
        const obj = compareArray.find(item => item.useCase === useCase && item.id === id)        
        if (obj) removeInformationFromCompareArray(obj.useCase, obj.id)
        setIsSelected(prev => !prev) // switches between true and false
        return // return so not set again to compareArray
    }

    


    return (
        <>
            <div className={isSelected ? "text-orange-400" : ""} onClick={handleClick}>
                <strong>{headline}</strong>
                {
                    Array.isArray(data) ? (
                        <>
                            <div className="flex">
                                {data.map((p, idx) => (
                                    <p className={idx > 0 ? "ml-3" : ""} key={idx}>{p}</p>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p>{data}</p>
                    )
                }
            </div>
        </>
    )

}