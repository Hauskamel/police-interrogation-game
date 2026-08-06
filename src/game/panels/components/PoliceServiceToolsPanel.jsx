import { FaLaptop } from "react-icons/fa6";

import { BaseControlPanel } from "./BaseControlPanel.jsx";
import { Notebook } from "@game/police/components";
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
                            className="flex w-full items-center justify-center gap-2 !bg-blue-500 px-4 py-2 text-white rounded-xl hover:!bg-blue-600 transition font-semibold shadow-md cursor-pointer"
                        >
                            <FaLaptop aria-hidden="true" />
                            Laptop öffnen
                        </button>

                        <div>
                            <Notebook />
                        </div>
                    </>
                )}
            </BaseControlPanel>
        </>
    );
};
