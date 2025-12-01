import {useEffect, useState} from "react";

import {useCarStore, useGameStore, gameStates} from "./store";

import { Startmenu } from "./components/Startmenu";
import { DiscrepancyOverlay } from "./components/discrepancy-mode/DiscrepancyOverlay.jsx";
import { DiscrepancyButton } from "./components/discrepancy-mode/DiscrepancyButton.jsx";

import { DocumentManager } from "./components/manager/DocumentManager";
import { Notebook } from "./components/Notebook.jsx";
import { Policeradio } from "./components/police-components/police-radio/PoliceRadio.jsx";
import { useCarSpawner } from "./hooks/useCarSpawner.jsx"

import { PolicecarControlTextbox } from "./components/textboxes/PolicecarControlTextbox.jsx"
import { CarControlTextbox } from "./components/textboxes/CarControlTextbox";
import { CarAndDriverProfileTextbox } from "./components/textboxes/CarAndDriverProfileTextbox";

import { useSetWantedList } from "./hooks/useSetWantedList.jsx";
import { useOverlaySetter } from "./hooks/useOverlaySetter.jsx";

import './../assets/css/App.css'
import { useCarRefs } from "./hooks/useCarRefs.jsx";
import { Gamecanvas } from "./components/Gamecanvas.jsx";
import { POLICE_CHECKPOINT } from "./config/positions.js";



import { criminalDatabaseGenerator } from "./utils/generators/police-related-generator/criminalDatabaseGenerator.js";
import { PoliceLaptop } from "./components/police-components/police-laptop/PoliceLaptop.jsx";




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

    const [hoveringCar, setHoveringCar] = useState(false);


    
    // #################################################
    // ##################### HOOKS #####################
    const carRefs = useCarRefs(cars);
    useSetWantedList();
    useCarSpawner();

    // sets overlay dependant of the current game mode
    useOverlaySetter();

    useEffect(() => {
        criminalDatabaseGenerator();
    }, [gameState])
    
    

    // ##################################################
    // ############# RENDERED HTML COMPONENT ############
    return (
        <div className={`h-full ${hoveringCar ? 'cursor-pointer' : ''}`}>
            <Gamecanvas playersPoliceCar={policeCar} cars={cars} carRefs={carRefs} setHoveringCar={setHoveringCar} />
            
            <DiscrepancyOverlay />
            <Startmenu />


        {selectedCar && (
            playersPoliceCar?.id === selectedCar?.id ? ( // check wether to show police car options
                <PolicecarControlTextbox
                    onClose={() => setSelectedCar(null)}
                />
            ) : (
                <CarControlTextbox // or default npc car options
                    onClose={() => setSelectedCar(null)}
                />
            )
        )}

            
            
            <div className="fixed bottom-5 right-50 flex gap-2">
                <>
                    <PoliceLaptop />
                    <Notebook />
                    <Policeradio />
                </>
            </div>
            
            
            

            {stoppedCar && stoppedCar.id === selectedCar?.id && stoppedCar?.position.z === POLICE_CHECKPOINT && (
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