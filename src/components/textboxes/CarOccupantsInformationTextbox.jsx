import {BaseTextbox} from "./BaseTextbox.jsx";

export function CarOccupantsInformationTextbox({selectedCar, stoppedCar}) {
    
    if (stoppedCar?.id !== selectedCar?.id) return;

    return (
        <>
            <BaseTextbox title={"Fahrzeuginsassen"} isCloseable={false}>
                <div className="flex">
                    {!stoppedCar ?
                        <>
                            <img src={`/images/driver/driver-unknown.jpg`} className="w-16 h-16 rounded-full"/>
                            <p className="text-gray-500 text-xs">unknown</p>
                        </>
                        :
                        <>
                            <img src={`/images/driver/${stoppedCar.driverProfile.driverImage}`} className="w-16 h-16 rounded-full"/>
                            <p className="text-gray-500 text-xs">{stoppedCar.driverProfile.firstName} {stoppedCar.driverProfile.lastName}</p>
                        </>
                        
                    }
                </div>
            </BaseTextbox>
        </>
    )
}