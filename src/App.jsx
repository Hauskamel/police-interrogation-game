import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei"
import {createRef, useEffect, useRef, useState} from "react";

import {useCarStore} from "./store";
import {entry1Coordinates} from './utils/streetbayEntries/streetbayEntry.js'

import {Road} from "./components/Road";
import {Car} from "./components/Car";
import {Policeman} from "./components/Policeman";
import {Streetbay} from "./components/Streetbay";
import {DocumentManager} from "./components/manager/DocumentManager";
import { Notebook } from "./components/manager/Notebook.jsx";

import './../assets/css/App.css'
import {generateUUID, randInt} from "three/src/math/MathUtils.js";
import {generateCarAndDriverProfile} from "./utils/generateCarAndDriverProfile.js";

import {Startmenu} from "./components/Startmenu";
import {CarControlTextbox} from "./components/textboxes/CarControlTextbox";
import {CarAndDriverProfileTextbox} from "./components/textboxes/CarAndDriverProfileTextbox";


function App() {
    // ##################################################
    // ##################### STATES #####################
    const cars = useCarStore((state) => state.cars);
    const addCar = useCarStore((state) => state.addCar);

    const setSelectedCar = useCarStore((state) => state.setSelectedCar)
    const selectedCar = useCarStore((state) => state.selectedCar)
    
    const [stoppedCar, setStoppedCar] = useState();
    const [hoveringCar, setHoveringCar] = useState(false);


    // ##################################################
    // ################### REFERENCES ###################
    const carRefs = useRef({});


    // spawns new car
    useEffect(() => {
        let respawnTime = randInt(2000, 5000);

        // respawn interval
        const intervalId = setInterval(() => {
            // car object
            const newCar = {
                id: generateUUID(),
                stopped: false,
                profileInformation: generateCarAndDriverProfile()
            };
            addCar(newCar);
        }, respawnTime);
        return () => clearInterval(intervalId);
    }, [addCar]);

    // effect for making car (not) selectable
    useEffect(() => {
        if (!selectedCar) return;

        if (cars.find(car => car.stopped)) setStoppedCar(cars.find(car => car.stopped))

        // check if car has passed first bay entry point AND the selected Car is NOT the stopped car to make the stopped car still clickable
        if ((selectedCar.position.x < entry1Coordinates[0]) && (selectedCar.id !== stoppedCar?.id)) {
            // resets selected car
            selectedCar(null);
        }
    }, [cars, selectedCar, stoppedCar]);


    // ##################################################
    // ############# RENDERED HTML COMPONENT ############
    return (
        <div className={`h-full ${hoveringCar ? 'cursor-pointer' : ''}` }>
            <Canvas camera={{position: [7, 14, -16], fov: 70}}>
                {/* UTIL COMPONENTS */}
                <axesHelper/>
                <OrbitControls/>

                {/* LIHGTS */}
                <ambientLight/>
                <directionalLight position={[5, 5, 5]}/>

                {/* GAME COMPONENTS */}
                <Road />
                <Streetbay />
                <Policeman position={[8,.5,-4]} />

                {cars.map((car) => {
                    // if no refference on a car id in the "cars" store (store.js) exists, create a new reference to that id
                    if (!carRefs.current[car.id]) {
                        carRefs.current[car.id] = createRef();
                    }

                    return (
                        <Car
                            key={car.id}
                            ref={carRefs.current[car.id]}
                            car={car}
                            onHoverChange={(hovering) => setHoveringCar(hovering ? car.id : null)}
                        />
                    );
                })}

            </Canvas>
            <Startmenu />

            {/* Todo: Textbox fade-out animation onClose after car reaches police checkpoint */}
            {selectedCar && (
                <>
                    <CarControlTextbox
                        selectedCar={selectedCar}
                        onClose={() => setSelectedCar(null)}
                    />
                    

                    {/* TODO: -3 ist die z-Position vom Policeman, müsste ausgelagert werden in eine Config Datei */}
                    {/* NOTE: -3 ist die Z-Koordinate des Autos, wenn es hält (siehe 'CatmullRomCurve3' in Car.jsx) */}
                    {/* Junge, was jez */}
                    {stoppedCar && stoppedCar.position.z === -3 && (
                        <>
                            {/* TODO: Brauchen wir diese Box in Zukunft? Soll sich der Spieler die Infos merken? */}
                            <CarAndDriverProfileTextbox
                                selectedCar={selectedCar}
                                stoppedCar={cars.find(car => car.stopped)}
                            />

                            <DocumentManager selectedCar={selectedCar} />
                            <Notebook />

                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default App;