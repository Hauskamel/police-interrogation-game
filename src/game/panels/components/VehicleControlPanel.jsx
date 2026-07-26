import { BaseControlPanel } from "./BaseControlPanel.jsx";
import { useGuiVisibilityStatesStore, useTrafficStore } from "@stores";


import { useClosePanel } from "../hooks";


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

    const setPanelVisibility = useGuiVisibilityStatesStore(state => state.setControlPanelVisibilityState)

    
    return (
        <>
            <BaseControlPanel 
                title="Fahrzeug Optionen" 
                margin="bottom-6" 
                onClose={onClose} 
            >
                <div className="flex gap-2">
                    {!stoppedTrafficEntity && (
                        <button
                            onClick={() => {
                                stopTrafficEntity(selectedTrafficEntity.id);
                            }}
                            className="w-full !bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-800 transition font-semibold shadow-md cursor-pointer"
                        >
                            Anhalten
                        </button>
                    )}

                    {(!stoppedTrafficEntity || selectedTrafficEntity.id === stoppedTrafficEntity.id) && (
                        <button
                            onClick={() => {
                                useClosePanel(setPanelVisibility, onClose)
                                continueTrafficEntity(selectedTrafficEntity.id);
                            }}
                            className="w-full bg-lime-600 text-white py-2 px-4 rounded-xl hover:bg-lime-700 transition font-semibold shadow-md cursor-pointer"
                        >
                            Weiterfahren
                        </button>
                    )}
                    
                </div>

                {(!stoppedTrafficEntity || selectedTrafficEntity.id === stoppedTrafficEntity.id) && (
                    <div className="flex gap-2">
                        <button 
                            className="w-full bg-sky-600 text-white py-2 px-4 rounded-xl hover:bg-sky-700 transition font-semibold shadow-md cursor-pointer"
                        >
                            Verhaften
                        </button>
                    </div>
                )}
            </BaseControlPanel>
        </>
    );
};
