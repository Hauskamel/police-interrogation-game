import { useCarStore } from "@stores";
import { BaseControlPanel } from "@game/panels/components/BaseControlPanel.jsx";

/**
 * Temporäres Entwickler-Panel für Fahrer- und Fahrzeugdaten.
 * Gehört nicht ins finale Spiel — nur für Dev/Debug-Zwecke.
 */
export const VehicleDebugPanel = ({ stoppedCar }) => {
    const selectedCar = useCarStore(state => state.selectedCar);

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
