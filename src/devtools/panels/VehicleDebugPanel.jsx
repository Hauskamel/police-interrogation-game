import { useTrafficStore } from "@stores";
import { BaseControlPanel } from "@game/panels/components/BaseControlPanel.jsx";

/**
 * Temporäres Entwickler-Panel für Fahrer- und Fahrzeugdaten.
 * Gehört nicht ins finale Spiel — nur für Dev/Debug-Zwecke.
 */
export const VehicleDebugPanel = ({ stoppedCar }) => {
    const selectedTrafficEntity = useTrafficStore(state => state.selectedTrafficEntity);

    if (!stoppedCar || stoppedCar.id !== selectedTrafficEntity?.id) return;

    return (
        <>
            <BaseControlPanel title={"Fahrer- & Fahrzeugprofil"} margin="bottom-60" isCloseable={false}>
                <p className="text-gray-500 text-xs">trafficEntityId: {selectedTrafficEntity.trafficEntityId ?? selectedTrafficEntity.id}</p>
                <p className="text-gray-500 text-xs">npcId: {selectedTrafficEntity.npcId}</p>
                <p className="text-gray-500 text-xs">vehicleId: {selectedTrafficEntity.vehicleId}</p>
                <p className="text-gray-500 text-xs">Traffic-Typ: {selectedTrafficEntity.trafficType}</p>
                <p className="text-gray-500 text-xs">Polizeistatus: {selectedTrafficEntity.police?.status}</p>
                <p className="text-gray-500 text-xs">Prüfkomplexität: {selectedTrafficEntity.inspectionProfile?.complexityLevel}</p>
                <p className="text-gray-500 text-xs">Täuschungsrisiko: {selectedTrafficEntity.inspectionProfile?.deceptionRisk}</p>
                <p className="text-gray-500 text-xs">Fahrername: {selectedTrafficEntity.driverProfile.presented.firstName} {selectedTrafficEntity.driverProfile.presented.lastName}</p>

                <p className="text-gray-500 text-xs">Fahrer betrunken: {selectedTrafficEntity.driverProfile.presented.drunk ? "true" : "false"}</p>
                <p className="text-gray-500 text-xs">{selectedTrafficEntity.driverProfile.presented.drunk ? "Alkoholpegel: " + selectedTrafficEntity.driverProfile.presented.alcoholLevel : ""}</p>

                <p className="text-gray-500 text-xs">Fahrer high: {selectedTrafficEntity.driverProfile.presented.high ? "true" : "false"}</p>
                <p className="text-gray-500 text-xs">Fahrer gesucht: {selectedTrafficEntity.police?.status === "wanted" ? "true" : "false"}</p>
            </BaseControlPanel>
        </>
    )
}
