import { useEffect, useState } from "react";

import {
    selectSelectedTrafficEntity,
    gameStates,
    useGameStore,
    useInspectionStore,
    useTrafficStore
} from "@stores";
import { Startmenu } from "@app/components/Startmenu";
import { GameDateDisplay } from "@app/components/GameDateDisplay";
import { ShiftStatusPanel } from "@game/shifts";
import {
    PoliceServiceToolsPanel,
    VehicleControlPanel,
} from "@game/panels/components";
import { DocumentManager } from "@game/documents/manager";
import { LaptopScreen } from "@game/police/components";
import {
    InspectionFieldInteractionProvider,
    InspectionWorkspace
} from "@game/inspections";
import { Gamecanvas } from "@game/world/components";
import { useLilGuiSetup } from "@devtools/useLilGuiSetup";
import { VehicleDebugPanel } from "@devtools/panels/VehicleDebugPanel";

import "@styles/App.css";


function App() {
    const playerPoliceVehicle = useTrafficStore(state => state.playerPoliceVehicle);

    const setSelectedVehicleId = useTrafficStore(state => state.setSelectedVehicleId);
    const selectedTrafficEntity = useTrafficStore(selectSelectedTrafficEntity);
    const stoppedTrafficEntity = useTrafficStore(state => state.trafficEntities.find(entity => entity.stopped));
    const activeInspection = useInspectionStore((state) => state.activeInspection);
    const cancelActiveInspection = useInspectionStore(
        (state) => state.cancelActiveInspection
    );

    const gameState = useGameStore(state => state.gameState);
    const [hoveringCar, setHoveringCar] = useState(false);
    const inspectionTrafficEntity = useTrafficStore((state) => {
        return state.trafficEntities.find(
            (entity) => entity.id === activeInspection?.trafficEntityId
        );
    });
    const controlPanelTrafficEntity = inspectionTrafficEntity
        ?? stoppedTrafficEntity
        ?? selectedTrafficEntity;
    const controlPanelIsPinned = Boolean(
        inspectionTrafficEntity || stoppedTrafficEntity
    );

    useLilGuiSetup();

    // Eine Session kann nicht aktiv bleiben, wenn ihre TrafficEntity entfernt oder freigegeben wurde.
    useEffect(() => {
        if (!activeInspection) return;

        const controlledEntityStillExists = stoppedTrafficEntity?.id
            === activeInspection.trafficEntityId;

        if (!controlledEntityStillExists) {
            cancelActiveInspection();
        }
    }, [
        activeInspection,
        cancelActiveInspection,
        stoppedTrafficEntity
    ]);

    return (
        <div className={`h-full ${hoveringCar ? 'cursor-pointer' : ''}`}>
            <Gamecanvas playersPoliceVehicle={playerPoliceVehicle} setHoveringCar={setHoveringCar} />

            <Startmenu />

        {gameState !== gameStates.MENU && (
            <>
                <PoliceServiceToolsPanel />
                <ShiftStatusPanel />

                {gameState !== gameStates.LAPTOP && (
                    <GameDateDisplay />
                )}
            </>
        )}

        {gameState !== gameStates.LAPTOP && controlPanelTrafficEntity && (
            <VehicleControlPanel
                trafficEntity={controlPanelTrafficEntity}
                isPinned={controlPanelIsPinned}
                onClose={() => setSelectedVehicleId(null)}
            />
        )}

            <InspectionFieldInteractionProvider>
                {gameState === gameStates.LAPTOP && (
                    <LaptopScreen />
                )}

                {activeInspection && inspectionTrafficEntity && (
                    <DocumentManager />
                )}
            </InspectionFieldInteractionProvider>

            <VehicleDebugPanel stoppedCar={stoppedTrafficEntity} />

            <InspectionWorkspace />
        </div>
    )
}

export default App;
