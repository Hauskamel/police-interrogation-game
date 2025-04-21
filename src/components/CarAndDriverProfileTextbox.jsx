import { useEffect } from "react";
import {BaseTextbox} from "./BaseTextbox.jsx";


export function CarAndDriverProfileTextbox ( {selectedCarId, stoppedCar, carAndDriverProfile} ) {

    // check if no car has been stopped OR user clicked on a car that is not the stopped car
    if (!stoppedCar || stoppedCar.id !== selectedCarId) return;

    return (
        <>
            <BaseTextbox title={"Fahrer- & Fahrzeugprofil"}>
            
                {/* // TODO: Fahrernamen generieren lassen  */}
                <p className="text-gray-500 text-xs">Fahrername: {selectedCarId}</p>

                <p className="text-gray-500 text-xs">Fahrer betrunken: {carAndDriverProfile.drunk ? "true" : "false"}</p>
                <p className="text-gray-500 text-xs">{carAndDriverProfile.drunk ? "Alkoholpegel: " + carAndDriverProfile.alcoholLevel : ""}</p>
                
                <p className="text-gray-500 text-xs">Fahrer high: {carAndDriverProfile.high ? "true" : "false"}</p>
                <p className="text-gray-500 text-xs">Fahrer gesucht: {carAndDriverProfile.wanted ? "true" : "false"}</p>
            </BaseTextbox>
        </>
    )
}