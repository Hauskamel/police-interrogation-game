import { BaseControlPanel } from "./BaseControlPanel.jsx";
import { Notebook, PoliceRadio } from "@game/police/components";
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
                    <>
                        <button
                            onClick={laptopMode}
                            className="w-full !bg-blue-500 text-white py-2 px-4 rounded-xl hover:!bg-blue-600 transition font-semibold shadow-md cursor-pointer"
                        >
                            Laptop öffnen
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                            <Notebook />
                            <PoliceRadio />
                        </div>
                    </>
                )}
            </BaseControlPanel>
        </>
    );
};
