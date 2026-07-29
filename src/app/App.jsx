import { useState } from "react";

import {
    selectSelectedTrafficEntity,
    selectSelectedVehicle,
    useGameStore,
    useTrafficStore
} from "@stores";
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
    const playerPoliceVehicle = useTrafficStore(state => state.playerPoliceVehicle);

    const setSelectedVehicleId = useTrafficStore(state => state.setSelectedVehicleId);
    const selectedVehicle = useTrafficStore(selectSelectedVehicle);
    const selectedTrafficEntity = useTrafficStore(selectSelectedTrafficEntity);
    const stoppedTrafficEntity = useTrafficStore(state => state.trafficEntities.find(entity => entity.stopped));

    const gameState = useGameStore(state => state.gameState);
    const ingameMode = useGameStore(state => state.ingameMode);
    const [hoveringCar, setHoveringCar] = useState(false);

    useLilGuiSetup();

    return (
        <div className={`h-full ${hoveringCar ? 'cursor-pointer' : ''}`}>
            <Gamecanvas playersPoliceVehicle={playerPoliceVehicle} setHoveringCar={setHoveringCar} />

            <Startmenu />

        {selectedVehicle && (
            playerPoliceVehicle?.id === selectedVehicle.id ? (
                <PoliceCarControlPanel
                    onClose={() => {
                        setSelectedVehicleId(null)
                        ingameMode()
                    }}
                />
            ) : (
                <VehicleControlPanel
                    onClose={() => setSelectedVehicleId(null)}
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

            <VehicleDebugPanel stoppedCar={stoppedTrafficEntity} />

            {stoppedTrafficEntity && stoppedTrafficEntity.id === selectedTrafficEntity?.id && (
                <>
                    <DocumentManager />
                </>
            )}
        </div>
    )
}

export default App;
