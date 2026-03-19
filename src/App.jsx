import {useEffect, useState} from "react";

import {useCarStore, useGameStore, useNpcStore} from "./store";

import { Startmenu } from "./components/Startmenu";
import { DiscrepancyOverlay } from "./components/discrepancy-mode/DiscrepancyOverlay.jsx";
import { DiscrepancyButton } from "./components/discrepancy-mode/DiscrepancyButton.jsx";

import { DocumentManager } from "./components/manager/DocumentManager";
import { Notebook } from "./components/Notebook.jsx";
import { Policeradio } from "./components/police-components/police-radio/PoliceRadio.jsx";
import { useVehicleEntityGenerator } from "./hooks/useVehicleEntityGenerator.jsx"

import { PolicecarControlTextbox } from "./components/textboxes/PolicecarControlTextbox.jsx"
import { CarControlTextbox } from "./components/textboxes/CarControlTextbox";
import { CarAndDriverProfileTextbox } from "./components/textboxes/CarAndDriverProfileTextbox";

import { useSetWantedList } from "./hooks/useSetWantedList.jsx";
import { useOverlaySetter } from "./hooks/useOverlaySetter.jsx";
import { useLilGuiSetup } from "./hooks/useLilGuiSetup.jsx";

import './../assets/css/App.css'
import { Gamecanvas } from "./components/Gamecanvas.jsx";

import { criminalDatabaseGenerator } from "./utils/generators/criminalDatabaseGenerator.js";
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
    const setCriminalDatabase = useNpcStore(state => state.setCriminalDatabase);
    const gameState = useGameStore(state => state.gameState);
    const gameMode = useGameStore(state => state.gameMode);
    const [hoveringCar, setHoveringCar] = useState(false);


    // #################################################
    // ##################### HOOKS #####################

    // sets overlay dependant of the current game mode
    useOverlaySetter();

    

    useSetWantedList();
    useLilGuiSetup();

    useEffect(() => {
        console.log("setting criminal database...");
        
        setCriminalDatabase(criminalDatabaseGenerator());
    }, [])

    

    // spawndirection, spawnlane
    useVehicleEntityGenerator("left", 1);

    useVehicleEntityGenerator("right", 1);
    
    

    // ##################################################
    // ############# RENDERED HTML COMPONENT ############
    return (
        <div className={`h-full ${hoveringCar ? 'cursor-pointer' : ''}`}>
            <Gamecanvas playersPoliceCar={policeCar} setHoveringCar={setHoveringCar} />
            <DiscrepancyOverlay />
            <Startmenu />

        {selectedCar && (
            playersPoliceCar?.id === selectedCar?.id ? ( // check wether to show police car options
                <PolicecarControlTextbox
                    onClose={() => {
                        setSelectedCar(null)
                        gameMode()
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
                    {/* NOTE: THIS BOX IS FOR DEVELOPING PURPOSES ONLY ----> SHOULD NOT BE IN THE GAME */}
                    <CarAndDriverProfileTextbox
                        stoppedCar={cars.find(car => car.stopped)}
                    />
                    <DocumentManager />

                    <DiscrepancyButton />
                </>
            )}
        </div>
    )
}

export default App;