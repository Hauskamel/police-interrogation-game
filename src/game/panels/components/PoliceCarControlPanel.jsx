import { BaseControlPanel } from "./BaseControlPanel.jsx";
import { useGameStore, useTrafficStore } from "@stores";


/**
 * ##### Police Car Control Panel
 * -----> Zeigt Aktionen fuer das eigene Polizeifahrzeug, z.B. Laptop oeffnen/schliessen.
 */
export const PoliceCarControlPanel = ({
    onClose
}) => {
    const selectedTrafficEntity = useTrafficStore(state => state.selectedTrafficEntity);
    const playerPoliceVehicle = useTrafficStore(state => state.playerPoliceVehicle);

    const gameState =  useGameStore(state => state.gameState);
    const ingameMode = useGameStore(state => state.ingameMode);
    const laptopMode = useGameStore(state => state.laptopMode);

    if (selectedTrafficEntity?.id !== playerPoliceVehicle?.id) return;

    return (
        <>
            <BaseControlPanel 
                title="Polizeifahrzeug Optionen" 
                margin="bottom-6" 
                onClose={onClose} 
            >
                {gameState === "LAPTOP" ?
                    <button
                        onClick={() => {
                            ingameMode()
                    }}
                        className="w-full !bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-red-800 transition font-semibold shadow-md cursor-pointer"
                    >
                        Laptop schließen
                    </button>
                :
                    <button
                        onClick={() => {
                            laptopMode()
                    }}
                        className="w-full !bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-red-800 transition font-semibold shadow-md cursor-pointer"
                    >
                        Laptop öffnen
                    </button>
                }
                
            </BaseControlPanel>
        </>
    )

}
