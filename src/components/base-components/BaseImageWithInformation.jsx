// Used in the wanted list component



import { useEffect, useState } from "react"

import { gameStates, useGameStore, useDiscrepandancyCompareStore } from "../../store"


export const BaseImageWithInformation = ({stoppedCar}) => {

    const gameState = useGameStore((state) => state.gameState)

    const [isSelected, setIsSelected] = useState(false)

    const compareArray = useDiscrepandancyCompareStore(state => state.compareArray)
    const setInformationToCompareArray = useDiscrepandancyCompareStore(state => state.setInformationToCompareArray)
    const removeInformationFromCompareArray = useDiscrepandancyCompareStore(state => state. removeInformationFromCompareArray)

    let carProfile = stoppedCar.carProfile.realProfile;
    if (stoppedCar.carProfile.fakeProfile) carProfile = stoppedCar.carProfile.fakeProfile;
    
    let driverProfile = stoppedCar.driverProfile.realProfile;
    if (stoppedCar.driverProfile.fakeProfile) driverProfile = stoppedCar.driverProfile.fakeProfile;


    // reset select status to sync with empty 'compareArray'
        useEffect(() => {
            if (gameState === gameStates.GAME) {
                setIsSelected(false)
            }
    }, [compareArray])



    function handleClick () {
        // for furter information read in 'BaseHeadlineWithText.jsx'
        if (((gameState !== gameStates.DISCREPANCY) || compareArray.length > 1) && !isSelected) return // . !isSelected is important to know wether this box is already in the compareArray or not

        // check if Headline/Text was already selected (already in compareArray)...
        if (!isSelected) {
            // ... if not safe set it to 'isSelected' the information to the 'compareArray'
            setIsSelected(prev => !prev)
            setInformationToCompareArray({
                stoppedCar
            })
            return;
        }


        // finds the clicked object by searchin the useCase (f.e. 'driversLicence') and the id
        const obj = compareArray.find(item => item.useCase === useCase && item.id === id)

        if (obj) removeInformationFromCompareArray(obj.useCase, obj.id)
        setIsSelected(prev => !prev) // switches between true and false
        return // return so not set again to compareArray

    }

    return (
        <div
            className="mb-5 flex"
            
            onClick={handleClick}>
            <img src={`/images/driver/${driverProfile.driverImage}`} className="w-20 h-20"/>
            <div>
                    <p className={`${isSelected ? "text-orange-400" : "text-gray-500"} text-xs`}>{driverProfile.firstName} {driverProfile.lastName}</p>
                    <p className={`${isSelected ? "text-orange-400" : "text-gray-500"} text-xs`}>Größe: {driverProfile.height} cm</p>
                </div>
        </div>
    )
    
}


// TODO: Idee:
// um es "realistisch" zu bauen könnte man es so machen, dass der Fahrer mit einer Maske von oben nach unten sichtbar wird, wie als würde er die Scheibe runterfahren lassen
// - dadurch entsteht wieder die Möglichkeit, dass nicht jeder NPC die Scheibe ganz runterfährt und evtl dann einfach gas gibt und weiterfährt was dann wiederrum die Möglichkeit
// eines Fahndungslevel entstehen lässt