import {useEffect, useState} from "react";

import {gameStates, useGameStore, useCarStore, useNpcStore} from "./store";

import { DocumentManager } from "./components/manager/DocumentManager";
import { Notebook } from "./components/manager/Notebook.jsx";
import { Policeradio } from "./components/manager/Policeradio/Policeradio.jsx";
import { useCarSpawner } from "./hooks/useCarSpawner.jsx"

import { Startmenu } from "./components/Startmenu";
import { CarControlTextbox } from "./components/textboxes/CarControlTextbox";
import { CarAndDriverProfileTextbox } from "./components/textboxes/CarAndDriverProfileTextbox";

import { useSetWantedList } from "./hooks/useSetWantedList.jsx";

import './../assets/css/App.css'
import { useCarRefs } from "./hooks/useCarRefs.jsx";
import { Gamecanvas } from "./components/Gamecanvas.jsx";
import { POLICE_CHECKPOINT } from "./config/positions.js";





function App() {
    // ##################################################
    // ##################### STATES #####################
    const gameState = useGameStore((state) => state.gameState)

    // cars
    const cars = useCarStore((state) => state.cars);
    const setSelectedCar = useCarStore(state => state.setSelectedCar)
    const selectedCar = useCarStore(state => state.selectedCar)
    const stoppedCar = useCarStore(state => state.cars.find(car => car.stopped))

    // NOTE: das ist ein local State - deshalb kein store.js nötig
    const [hoveringCar, setHoveringCar] = useState(false);

    
    // #################################################
    // ##################### HOOKS #####################
    const carRefs = useCarRefs(cars);
    useSetWantedList()

    
    useCarSpawner();
    

    
    // ##################################################
    // ############# RENDERED HTML COMPONENT ############
    return (
        <div className={`h-full ${hoveringCar ? 'cursor-pointer' : ''}` }>
            <Gamecanvas cars={cars} carRefs={carRefs} setHoveringCar={setHoveringCar} />

            <Startmenu />
            {gameState === gameStates.GAME && 
                <>
                    <Notebook />
                    <Policeradio />
                </>
            }
            {/* Todo: Textbox fade-out animation onClose after car reaches police checkpoint */}
            {selectedCar && (
                <>
                    <CarControlTextbox
                        selectedCar={selectedCar}
                        onClose={() => setSelectedCar(null)}
                    />
                    
                    {stoppedCar && stoppedCar?.position.z === POLICE_CHECKPOINT && (
                        <>
                            {/* TODO: Brauchen wir diese Box in Zukunft? Soll sich der Spieler die Infos merken? */}
                            <CarAndDriverProfileTextbox
                                selectedCar={selectedCar}
                                stoppedCar={cars.find(car => car.stopped)}
                            />
                            <DocumentManager selectedCar={selectedCar} />
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default App;