import {useEffect, useState} from "react";

import {useCarStore, useGameStore, useNpcStore} from "./store";

import { Startmenu } from "./components/Startmenu";

import { DocumentManager } from "./components/manager/DocumentManager";
import { Notebook } from "./components/Notebook.jsx";
import { Policeradio } from "./components/police-components/police-radio/PoliceRadio.jsx";

import { PolicecarControlTextbox } from "./components/textboxes/PolicecarControlTextbox.jsx"
import { CarControlTextbox } from "./components/textboxes/CarControlTextbox";
import { CarAndDriverProfileTextbox } from "./components/textboxes/CarAndDriverProfileTextbox";

import { useLilGuiSetup } from "./hooks/useLilGuiSetup.jsx";

import './../assets/css/App.css'
import { Gamecanvas } from "./components/Gamecanvas.jsx";

import { LaptopScreen } from "./components/police-components/police-laptop/LaptopScreen.jsx";


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


    // spawndirection, spawnlane
    // useVehicleEntityGenerator("left", 1);

    // useVehicleEntityGenerator("right", 1);
    
    

    // ##################################################
    // ############# RENDERED HTML COMPONENT ############
    return (
        <div className={`h-full ${hoveringCar ? 'cursor-pointer' : ''}`}>
            <Gamecanvas playersPoliceCar={policeCar} setHoveringCar={setHoveringCar} />

            <Startmenu />

        {selectedCar && (
            playersPoliceCar?.id === selectedCar?.id ? ( // check wether to show police car options
                <PolicecarControlTextbox
                    onClose={() => {
                        setSelectedCar(null)
                        ingameMode()
                    }}
                />
            ) : (
                <CarControlTextbox // or default npc car options
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
                    <Policeradio />
                </>
            </div>
            
            {stoppedCar && stoppedCar.id === selectedCar?.id && (
                <>
                    {/* NOTE: THIS BOX IS FOR DEVELOPING PURPOSES ONLY ----> SHOULD NOT BE IN THE INGAME */}
                    <CarAndDriverProfileTextbox
                        stoppedCar={cars.find(car => car.stopped)}
                    />
                    <DocumentManager />
                </>
            )}
        </div>
    )
}

export default App;