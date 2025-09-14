// Used in the wanted list component
import { gameStates, useGameStore } from "../../store"


export const BaseImageInformation = ({entity}) => {
    const gameState = useGameStore((state) => state.gameState)

    let carProfile = entity.carProfile.realProfile;
    if (entity.carProfile.fakeProfile) carProfile = entity.carProfile.fakeProfile;
    
    let driverProfile = entity.driverProfile.realProfile;
    if (entity.driverProfile.fakeProfile) driverProfile = entity.driverProfile.fakeProfile;

    function handleClick () {
        if (gameState !== gameStates.DISCREPANCY) return
    }

    return (
        <div
            className="flex mb-5"
            onClick={handleClick}>
            <img src={`/images/driver/${driverProfile.driverImage}`} className="w-20 h-20"/>
            <div>
                    <p className="text-gray-500 text-xs">{driverProfile.firstName} {driverProfile.lastName}</p>
                    <p className="text-gray-500 text-xs">Größe: {driverProfile.height}</p>
                </div>
        </div>
    )
    
}