import {useState} from "react";

import {useCarStore} from "./store";

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
    // cars
    const cars = useCarStore((state) => state.cars);
    const setSelectedCar = useCarStore(state => state.setSelectedCar)
    const selectedCar = useCarStore(state => state.selectedCar)
    const stoppedCar = useCarStore(state => state.cars.find(car => car.stopped))

    const [hoveringCar, setHoveringCar] = useState(false);



    console.log(selectedCar);
    


    
    // #################################################
    // ##################### HOOKS #####################
    const carRefs = useCarRefs(cars);
    useSetWantedList();
    useCarSpawner();
    

    // ##################################################
    // ############# RENDERED HTML COMPONENT ############
    return (
        <div className={`h-full ${hoveringCar ? 'cursor-pointer' : ''}` }>
            <Gamecanvas cars={cars} carRefs={carRefs} setHoveringCar={setHoveringCar} />
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
                </>
            )}


        </div>
    )
}

export default App;