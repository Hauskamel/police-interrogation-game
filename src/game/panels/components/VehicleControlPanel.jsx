import { BaseControlPanel } from "./BaseControlPanel.jsx";
import { VehicleOccupantsPanel } from "./VehicleOccupantsPanel.jsx";
import { useGuiVisibilityStatesStore, useTrafficStore } from "@stores";


import { closePanel } from "../hooks";


/**
 * ##### Vehicle Control Panel
 * -----> Zeigt die direkten Spieler-Aktionen fuer ein ausgewaehltes NPC-Fahrzeug.
 */
export const VehicleControlPanel = ({
    onClose
}) => {
    const stopTrafficEntity = useTrafficStore((state) => state.stopTrafficEntity);
    const continueTrafficEntity = useTrafficStore((state) => state.continueTrafficEntity);
    const selectedTrafficEntity = useTrafficStore(state => state.selectedTrafficEntity);
    const stoppedTrafficEntity = useTrafficStore((state) => state.trafficEntities.find(entity => entity.stopped));
    const revealedDriverNpcId = useTrafficStore((state) =>
        state.revealedDriverIdentityByTrafficEntityId[selectedTrafficEntity?.id]
    );

    const setPanelVisibility = useGuiVisibilityStatesStore(state => state.setControlPanelVisibilityState)
    const selectedEntityIsStopped = Boolean(
        selectedTrafficEntity?.stopped
        && selectedTrafficEntity.id === stoppedTrafficEntity?.id
    );
    const anotherEntityIsStopped = Boolean(
        stoppedTrafficEntity
        && stoppedTrafficEntity.id !== selectedTrafficEntity?.id
    );
    const driverIdentityIsKnown = Boolean(
        selectedEntityIsStopped
        && revealedDriverNpcId === selectedTrafficEntity?.npcId
    );

    
    return (
        <>
            <BaseControlPanel 
                title="Fahrzeug Optionen" 
                margin="bottom-6" 
                onClose={onClose} 
            >
                <VehicleOccupantsPanel
                    trafficEntity={selectedTrafficEntity}
                    showDriverIdentity={driverIdentityIsKnown}
                />

                <div className="flex gap-2">
                    {!stoppedTrafficEntity && !selectedEntityIsStopped && (
                        <button
                            onClick={() => {
                                stopTrafficEntity(selectedTrafficEntity.id);
                            }}
                            className="w-full !bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-800 transition font-semibold shadow-md cursor-pointer"
                        >
                            Anhalten
                        </button>
                    )}

                    {selectedEntityIsStopped && (
                        <button
                            onClick={() => {
                                closePanel(setPanelVisibility, onClose)
                                continueTrafficEntity(selectedTrafficEntity.id);
                            }}
                            className="w-full bg-lime-600 text-white py-2 px-4 rounded-xl hover:bg-lime-700 transition font-semibold shadow-md cursor-pointer"
                        >
                            Weiterfahren
                        </button>
                    )}
                    
                </div>

                {selectedEntityIsStopped && (
                    <div className="flex gap-2">
                        <button 
                            className="w-full bg-sky-600 text-white py-2 px-4 rounded-xl hover:bg-sky-700 transition font-semibold shadow-md cursor-pointer"
                        >
                            Verhaften
                        </button>
                    </div>
                )}

                {anotherEntityIsStopped && (
                    <p className="rounded bg-amber-50 px-3 py-2 text-xs text-amber-800">
                        Es wird bereits ein anderes Fahrzeug kontrolliert.
                    </p>
                )}
            </BaseControlPanel>
        </>
    );
};
