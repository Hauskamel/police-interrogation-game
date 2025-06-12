import {BaseTextbox} from "./BaseTextbox.jsx";

export function CarOccupantsInformationTextbox({selectedCar, stoppedCar}) {
    
    if (stoppedCar?.id !== selectedCar?.id) return;


    return (
        <>
            <BaseTextbox title={"Fahrzeuginsassen"} isCloseable={false}>
                <div className="flex">
                    {!stoppedCar ?
                        // TODO: Stand jetzt wird beim anklicken eines 2. Fahrzeugs noch das Bild des vorgängers angezeigt
                        <img src={`/images/driver/driver-unknown.jpg`} className="w-12 h-12 rounded-full"/>
                        :
                        <img src={`/images/driver/${stoppedCar.profileInformation.driverImage}`} className="w-12 h-12 rounded-full"/>
                    }
                    <p className="text-gray-500 text-xs">unknown</p>
                </div>
            </BaseTextbox>
        </>
    )
}