import {useEffect, useState} from "react";

import {useCarStore, useGameStore, useNpcStore} from "./stores";

import { Startmenu } from "./components/Startmenu";

import { Notebook } from "./components/Notebook.jsx";
import {
    PoliceCarControlPanel,
    VehicleControlPanel,
    VehicleDebugPanel
} from "./game/controls/components";
import { DocumentManager } from "./game/documents/manager";
import { LaptopScreen, PoliceRadio } from "./game/police/components";

import { useLilGuiSetup } from "./hooks/useLilGuiSetup.jsx";

import './../assets/css/App.css'
import { Gamecanvas } from "./game/world/components";


function App() {
    // ##################################################
    // ##################### STATES #####################
    // cars
    const cars = useCarStore((state) => state.cars);
    const policeCar = useCarStore(state => state.playersPolicecar);
    
    const setSelectedCar = useCarStore(state => state.setSelectedCar);
    const playersPoliceCar = useCarStore(state => state.playersPoliceCar);
    const selectedCar = useCarStore(state => state.selectedCar);
    const stoppedCar = useCarStore(state => state.cars.find(car => car.stopped));

    const gameState = useGameStore(state => state.gameState);
    const ingameMode = useGameStore(state => state.ingameMode);
    const [hoveringCar, setHoveringCar] = useState(false);


    // #################################################
    // ##################### HOOKS #####################
    useLilGuiSetup();


    // ##################################################
    // ############# RENDERED HTML COMPONENT ############
    return (
        <div className={`h-full ${hoveringCar ? 'cursor-pointer' : ''}`}>
            <Gamecanvas playersPoliceCar={policeCar} setHoveringCar={setHoveringCar} />

            <Startmenu />

        {selectedCar && (
            playersPoliceCar?.id === selectedCar?.id ? ( // check wether to show police car options
                <PoliceCarControlPanel
                    onClose={() => {
                        setSelectedCar(null)
                        ingameMode()
                    }}
                />
            ) : (
                <VehicleControlPanel // or default npc car options
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
                    {/* NOTE: THIS BOX IS FOR DEVELOPING PURPOSES ONLY ----> SHOULD NOT BE IN THE INGAME */}
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
