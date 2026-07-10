import { useState } from "react";

import { useCarStore, useGameStore } from "@stores";
import { Startmenu } from "@app/components/Startmenu";
import {
    PoliceCarControlPanel,
    VehicleControlPanel,
} from "@game/panels/components";
import { DocumentManager } from "@game/documents/manager";
import { LaptopScreen, Notebook, PoliceRadio } from "@game/police/components";
import { Gamecanvas } from "@game/world/components";
import { useLilGuiSetup } from "@devtools/useLilGuiSetup";
import { VehicleDebugPanel } from "@devtools/panels/VehicleDebugPanel";

import "@styles/App.css";


function App() {
    const cars = useCarStore((state) => state.cars);
    const policeCar = useCarStore(state => state.playersPolicecar);

    const setSelectedCar = useCarStore(state => state.setSelectedCar);
    const playersPoliceCar = useCarStore(state => state.playersPoliceCar);
    const selectedCar = useCarStore(state => state.selectedCar);
    const stoppedCar = useCarStore(state => state.cars.find(car => car.stopped));

    const gameState = useGameStore(state => state.gameState);
    const ingameMode = useGameStore(state => state.ingameMode);
    const [hoveringCar, setHoveringCar] = useState(false);

    useLilGuiSetup();

    return (
        <div className={`h-full ${hoveringCar ? 'cursor-pointer' : ''}`}>
            <Gamecanvas playersPoliceCar={policeCar} setHoveringCar={setHoveringCar} />

            <Startmenu />

        {selectedCar && (
            playersPoliceCar?.id === selectedCar?.id ? (
                <PoliceCarControlPanel
                    onClose={() => {
                        setSelectedCar(null)
                        ingameMode()
                    }}
                />
            ) : (
                <VehicleControlPanel
                    onClose={() => setSelectedCar(null)}
                />
            )
        )}

        {gameState == "LAPTOP" && (
            <LaptopScreen />
        )}

            <div className="fixed bottom-5 right-50 flex gap-2">
                <>
                    <Notebook />
                    <PoliceRadio />
                </>
            </div>

            {stoppedCar && stoppedCar.id === selectedCar?.id && (
                <>
                    <VehicleDebugPanel
                        stoppedCar={cars.find(car => car.stopped)}
                    />
                    <DocumentManager />
                </>
            )}
        </div>
    )
}

export default App;
