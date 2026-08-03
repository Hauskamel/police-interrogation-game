import { BaseControlPanel } from "./BaseControlPanel.jsx";
import { useGameStore } from "@stores";


/**
 * ##### Police Service Tools Panel
 * -----> Hält Dienstwerkzeuge unabhängig von einer Fahrzeugauswahl erreichbar.
 */
export const PoliceServiceToolsPanel = () => {
    const gameState =  useGameStore(state => state.gameState);
    const laptopMode = useGameStore(state => state.laptopMode);

    return (
        <>
            <BaseControlPanel 
                title="Dienstwerkzeuge"
                width={240}
                isCloseable={false}
                positionClassName="bottom-4 left-4 sm:bottom-6 sm:left-8"
            >
                {gameState !== "LAPTOP" && (
                    <button
                        onClick={laptopMode}
                        className="w-full !bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-red-800 transition font-semibold shadow-md cursor-pointer"
                    >
                        Laptop öffnen
                    </button>
                )}
                
            </BaseControlPanel>
        </>
    );
};
