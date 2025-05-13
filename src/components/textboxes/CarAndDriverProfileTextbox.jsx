import {BaseTextbox} from "./BaseTextbox.jsx";

// component is only visible on stopped car since no information about driver or vehicle is known or relevant
export function CarAndDriverProfileTextbox ( {selectedCar, stoppedCar} ) {

    // check if no car has been stopped OR user clicked on a car that is not the stopped car
    if (!stoppedCar || stoppedCar.id !== selectedCar.id) return;

    return (
        <>
            <BaseTextbox title={"Fahrer- & Fahrzeugprofil"} className="car-and-driver-profile-textbox">
                {/* // TODO: Fahrernamen generieren lassen  */}
                <p className="text-gray-500 text-xs">Fahrername: {selectedCar.id}</p>

                <p className="text-gray-500 text-xs">Fahrer betrunken: {selectedCar.profileInformation.drunk ? "true" : "false"}</p>
                <p className="text-gray-500 text-xs">{selectedCar.profileInformation.drunk ? "Alkoholpegel: " + selectedCar.profileInformation.alcoholLevel : ""}</p>
                
                <p className="text-gray-500 text-xs">Fahrer high: {selectedCar.profileInformation.high ? "true" : "false"}</p>
                <p className="text-gray-500 text-xs">Fahrer gesucht: {selectedCar.profileInformation.wanted ? "true" : "false"}</p>
            </BaseTextbox>
        </>
    )
}