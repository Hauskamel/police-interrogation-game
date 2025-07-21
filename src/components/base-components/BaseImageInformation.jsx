// Used in the wanted list component
import { gameStates, useGameStore } from "../../store"


export const BaseImageInformation = ({persona}) => {
    const gameState = useGameStore((state) => state.gameState)
    

    function handleClick () {
        if (gameState !== gameStates.DISCREPANCY) return
        console.log(persona)
    }


    return (
        <div
            className="flex mb-5"
            onClick={handleClick}>
            <img src={`/images/driver/${persona.driverProfile.licenceImage}`} className="w-20 h-20"/>
            <div>
                    <p className="text-gray-500 text-xs">{persona.driverProfile.firstName} {persona.driverProfile.lastName}</p>
                    <p className="text-gray-500 text-xs">Größe: {persona.driverProfile.height}</p>
                </div>
        </div>
    )
    
}