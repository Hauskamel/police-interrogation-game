import {BaseTextbox} from "./BaseTextbox.jsx";

// component is only visible on stopped car since no information about driver or vehicle is known or relevant
export const CarAndDriverProfileTextbox = ({
    selectedCar,
    stoppedCar
}) => {

    // check if no car has been stopped OR user clicked on a car that is not the stopped car
    if (!stoppedCar || stoppedCar.id !== selectedCar?.id) return;

    console.log(selectedCar);
    

    return (
        <>
            <BaseTextbox title={"Fahrer- & Fahrzeugprofil"} margin="bottom-60" isCloseable={false}>
            <p className="text-gray-500 text-xs">id: {selectedCar.id}</p>
                <p className="text-gray-500 text-xs">Fahrername: {selectedCar.driverProfile.firstName} {selectedCar.driverProfile.lastName}</p>

                <p className="text-gray-500 text-xs">Fahrer betrunken: {selectedCar.driverProfile.drunk ? "true" : "false"}</p>
                <p className="text-gray-500 text-xs">{selectedCar.driverProfile.drunk ? "Alkoholpegel: " + selectedCar.driverProfile.alcoholLevel : ""}</p>
                
                <p className="text-gray-500 text-xs">Fahrer high: {selectedCar.driverProfile.high ? "true" : "false"}</p>
                <p className="text-gray-500 text-xs">Fahrer gesucht: {selectedCar.driverProfile.wanted ? "true" : "false"}</p>
            </BaseTextbox>
        </>
    )
}