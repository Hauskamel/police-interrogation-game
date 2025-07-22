// This component is used in the drivers licence and car documents

import { useEffect, useState } from "react"
import { gameStates, useGameStore, useDiscrepandancyCompareStore } from "../../store"


// NOTE: noch einbauen: oneliner kann auf true gestellt werden, damit key und value in einer Zeile stehen
export const BaseHeadlineText = ({headline, data}) => {
    const [isSelected, setIsSelected] = useState(false)
    const gameState = useGameStore(state => state.gameState)

    const compareArray = useDiscrepandancyCompareStore(state => state.compareArray)
    const setInformationToCompareArray = useDiscrepandancyCompareStore(state => state.setInformationToCompareArray)
    const removeInformationFromCompareArray = useDiscrepandancyCompareStore(state => state. removeInformationFromCompareArray)
    


    const handleClick = () => {
        if (((gameState !== gameStates.DISCREPANCY) || compareArray.length > 1) && !isSelected) return
        
        // check if Headline/Text was already isSelected (already in compareArray)
        if (!isSelected) {
            setIsSelected(prev => !prev)
            setInformationToCompareArray({
                id: compareArray[0] ? 2 : 1,
                headline: headline,
                data: data
            })
        }

        removeInformationFromCompareArray()
        setIsSelected(prev => !prev) // switches between true and false
        return // return so not set again to compareArray
        
    }

    useEffect(() => {
        console.log(compareArray);
        console.log("headline isSelected: ", isSelected);
    }, [isSelected, compareArray])


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