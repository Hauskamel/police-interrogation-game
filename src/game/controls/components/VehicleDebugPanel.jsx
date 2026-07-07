import { useCarStore } from "../../../stores";
import { BaseControlPanel } from "./BaseControlPanel.jsx";

/**
 * ##### Vehicle Debug Panel
 * -----> Temporäres Entwickler-Panel fuer Fahrer- und Fahrzeugdaten.
 */
export const VehicleDebugPanel = ({ stoppedCar }) => {
    const selectedCar = useCarStore(state => state.selectedCar);

            // check if no car has been stopped OR user clicked on a car that is not the stopped car
    if (!stoppedCar || stoppedCar.id !== selectedCar?.id) return;
    
    return (
        <>
            <BaseControlPanel title={"Fahrer- & Fahrzeugprofil"} margin="bottom-60" isCloseable={false}>
            <p className="text-gray-500 text-xs">id: {selectedCar.id}</p>
                <p className="text-gray-500 text-xs">Fahrername: {selectedCar.driverProfile.firstName} {selectedCar.driverProfile.lastName}</p>

                <p className="text-gray-500 text-xs">Fahrer betrunken: {selectedCar.driverProfile.drunk ? "true" : "false"}</p>
                <p className="text-gray-500 text-xs">{selectedCar.driverProfile.drunk ? "Alkoholpegel: " + selectedCar.driverProfile.alcoholLevel : ""}</p>
                
                <p className="text-gray-500 text-xs">Fahrer high: {selectedCar.driverProfile.high ? "true" : "false"}</p>
                <p className="text-gray-500 text-xs">Fahrer gesucht: {selectedCar.driverProfile.wanted ? "true" : "false"}</p>
            </BaseControlPanel>
        </>
    )
}
