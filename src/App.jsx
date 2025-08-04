import {useState} from "react";

import {useCarStore, useGameStore, gameStates} from "./store";

import { Startmenu } from "./components/Startmenu";
import { DiscrepancyOverlay } from "./components/discrepancy-mode/DiscrepancyOverlay.jsx";
import { DiscrepancyButton } from "./components/discrepancy-mode/DiscrepancyButton.jsx";

import { DocumentManager } from "./components/manager/DocumentManager";
import { Notebook } from "./components/manager/Notebook.jsx";
import { Policeradio } from "./components/manager/Policeradio/Policeradio.jsx";
import { useCarSpawner } from "./hooks/useCarSpawner.jsx"
import { useDiscrepandancyCompareStore } from "./store";

import { useEffect } from "react";

import { CarControlTextbox } from "./components/textboxes/CarControlTextbox";
import { CarAndDriverProfileTextbox } from "./components/textboxes/CarAndDriverProfileTextbox";

import { useSetWantedList } from "./hooks/useSetWantedList.jsx";
import { useOverlaySetter } from "./hooks/useOverlaySetter.jsx";

import './../assets/css/App.css'
import { useCarRefs } from "./hooks/useCarRefs.jsx";
import { Gamecanvas } from "./components/Gamecanvas.jsx";
import { POLICE_CHECKPOINT } from "./config/positions.js";





import { identity } from "./utils/carProfileGenerator.js"






function App() {
    // ##################################################
    // ##################### STATES #####################
    // cars
    const cars = useCarStore((state) => state.cars);
    const setSelectedCar = useCarStore(state => state.setSelectedCar)
    const selectedCar = useCarStore(state => state.selectedCar)
    const stoppedCar = useCarStore(state => state.cars.find(car => car.stopped))

    const [hoveringCar, setHoveringCar] = useState(false);


    
    // #################################################
    // ##################### HOOKS #####################
    const carRefs = useCarRefs(cars);
    useSetWantedList();
    useCarSpawner();

    // sets overlay dependant of the current game mode
    useOverlaySetter();

    
    
    
     

    

    // ##################################################
    // ############# RENDERED HTML COMPONENT ############
    return (
        <div className={`h-full ${hoveringCar ? 'cursor-pointer' : ''}`}>
            <Gamecanvas cars={cars} carRefs={carRefs} setHoveringCar={setHoveringCar} />
            
            <DiscrepancyOverlay />
            <Startmenu />

            {selectedCar && (
                <>
                    <CarControlTextbox
                        selectedCar={selectedCar}
                        onClose={() => setSelectedCar(null)}
                    />
                </>
            )}


            {stoppedCar && stoppedCar.id === selectedCar?.id && stoppedCar?.position.z === POLICE_CHECKPOINT && (
                <>
                    <Notebook />
                    <Policeradio />

                    {/* NOTE: THIS BOX IS FOR DEVELOPING PURPOSES ONLY ----> SHOULD NOT BE IN THE GAME */}
                    <CarAndDriverProfileTextbox
                        selectedCar={selectedCar}
                        stoppedCar={cars.find(car => car.stopped)}
                    />
                    <DocumentManager selectedCar={selectedCar} />

                    <DiscrepancyButton />
                </>
            )}
        </div>
    )
}

export default App;