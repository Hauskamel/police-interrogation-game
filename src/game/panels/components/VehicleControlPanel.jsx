import { BaseControlPanel } from "./BaseControlPanel.jsx";
import { useCarStore, useGuiVisibilityStatesStore } from "@stores";


import { useClosePanel } from "../hooks";


/**
 * ##### Vehicle Control Panel
 * -----> Zeigt die direkten Spieler-Aktionen fuer ein ausgewaehltes NPC-Fahrzeug.
 */
export const VehicleControlPanel = ({
    onClose
}) => {
    const stopCar = useCarStore((state) => state.stopCar);
    const continueCar = useCarStore((state) => state.continueCar);
    const selectedCar = useCarStore(state => state.selectedCar);
    const stoppedCar = useCarStore((state) => state.cars.find(car => car.stopped));

    const setPanelVisibility = useGuiVisibilityStatesStore(state => state.setControlPanelVisibilityState)

    
    return (
        <>
            <BaseControlPanel 
                title="Fahrzeug Optionen" 
                margin="bottom-6" 
                onClose={onClose} 
            >
                <div className="flex gap-2">
                    {!stoppedCar && (
                        <button
                            onClick={() => {
                                stopCar(selectedCar.id);
                            }}
                            className="w-full !bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-800 transition font-semibold shadow-md cursor-pointer"
                        >
                            Anhalten
                        </button>
                    )}

                    {!stoppedCar || selectedCar.id === stoppedCar.id && (
                        <button
                            onClick={() => {
                                useClosePanel(setPanelVisibility, onClose)
                                continueCar(selectedCar.id);
                            }}
                            className="w-full bg-lime-600 text-white py-2 px-4 rounded-xl hover:bg-lime-700 transition font-semibold shadow-md cursor-pointer"
                        >
                            Weiterfahren
                        </button>
                    )}
                    
                </div>

                {!stoppedCar || selectedCar.id === stoppedCar.id && (
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
