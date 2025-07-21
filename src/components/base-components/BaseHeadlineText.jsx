// This component is used in the drivers licence and car documents

import { useEffect, useState } from "react"
import { gameStates, useGameStore, useDiscrepandancyCompareStore } from "../../store"
import { generateUUID } from "three/src/math/MathUtils.js"

// NOTE: noch einbauen: oneliner kann auf true gestellt werden, damit key und value in einer Zeile stehen
export const BaseHeadlineText = ({headline, data}) => {
    const [selected, setSelected] = useState(false)
    const gameState = useGameStore(state => state.gameState)

    const setInformationToCompareArray = useDiscrepandancyCompareStore(state => state.setInformationToCompareArray)
    const compareArray = useDiscrepandancyCompareStore(state => state.compareArray)


    const handleClick = () => {
        if (gameState !== gameStates.DISCREPANCY || compareArray.length > 1) return
        
        // check if Headline/Text was already selected (already in compareArray)
        if (selected) {
            // removeInformationFromCompareArray(compareInformation)
            setSelected(prev => !prev) // switches between true and false
            return // return so not set again to compareArray
        }
        setSelected(prev => !prev)
        setInformationToCompareArray({
            headline: headline,
            data: data
        })
    }

    useEffect(() => {
        console.log(compareArray);
        console.log("headline selected: ", selected);
        
    }, [selected, compareArray])


    return (
        <>
            <div onClick={handleClick}>
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