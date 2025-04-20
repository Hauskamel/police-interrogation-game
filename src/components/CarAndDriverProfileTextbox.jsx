import { useEffect } from "react";
import {BaseTextbox} from "./BaseTextbox.jsx";


export function CarAndDriverProfileTextbox ( {selectedCarId, stoppedCar, profile} ) {

    console.log(stoppedCar);
    


    if (!stoppedCar.id === selectedCarId) return;

    return (
        <>
            <BaseTextbox title={"Fahrer- & Fahrzeugprofil"}>
            
                {/* // TODO: Fahrernamen generieren lassen  */}
                <p className="text-gray-500 text-xs">Fahrername: {selectedCarId}</p>

                <p className="text-gray-500 text-xs">Fahrer betrunken: {profile.drunk ? "true" : "false"}</p>
                <p className="text-gray-500 text-xs">{profile.drunk ? "Alkoholpegel: " + profile.alcoholLevel : ""}</p>
                
                <p className="text-gray-500 text-xs">Fahrer high: {profile.high ? "true" : "false"}</p>
                <p className="text-gray-500 text-xs">Fahrer gesucht: {profile.wanted ? "true" : "false"}</p>
            </BaseTextbox>
        </>
    )
}