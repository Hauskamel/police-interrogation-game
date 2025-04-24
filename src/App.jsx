import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei"
import {createRef, useEffect, useRef, useState} from "react";
import {useCarStore} from "./store";


import { streetbayEntry } from './utils/streetbayEntries/streetbayEntries.js'


import {Road} from "./components/Road";
import {Car} from "./components/Car";
import {Policeman} from "./components/Policeman";
import {Streetbay} from "./components/Streetbay.jsx";

import './App.css'
import {generateUUID, randInt} from "three/src/math/MathUtils.js";
import {generateCarAndDriverProfile} from "./utils/generateCarAndDriverProfile.js";

import {Startmenu} from "./components/Startmenu.jsx";
import {CarControlTextbox} from "./components/CarControlTextbox.jsx";
import {CarAndDriverProfileTextbox} from "./components/CarAndDriverProfileTextbox.jsx";



function App() {
    // ##################################################
    // ##################### STATES #####################
    const cars = useCarStore((state) => state.cars);
    const addCar = useCarStore((state) => state.addCar);

    const [selectedCar, setSelectedCar] = useState(null);
    const [stoppedCar, setStoppedCar] = useState()


    // const [selectedCarId, setSelectedCarId] = useState(null);
    const [hoveringCar, setHoveringCar] = useState(false);

    
    // ##################################################
    // ################### REFERENCES ###################
    const carRefs = useRef({});

    // function executes when car is selected (onSelect)
    function handleSelectedCar (carObject) {
        setSelectedCar(carObject);
    }

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
        if ((selectedCar.position.x < streetbayEntry.points[0].x) && (selectedCar.id !== stoppedCar?.id)) {
            // resets selected car
            setSelectedCar(null);
        }
    }, [cars, selectedCar, stoppedCar]);



    // ##################################################
    // ############# RENDERED HTML COMPONENT ############
    return (
        <div className={`h-full ${hoveringCar ? 'cursor-pointer' : ''}` }>
            <Canvas camera={{position: [7, 14, -16], fov: 70}}>
                {/* GAME COMPONENTS */}
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
                    // NOTE: Stimmt dieser Kommentar?
                    if (!carRefs.current[car.id]) {
                        carRefs.current[car.id] = createRef();
                    }

                    return (
                        <Car
                            key={car.id}
                            ref={carRefs.current[car.id]}

                            car={car}
                            onSelect={handleSelectedCar}
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

                    {/* NOTE: -3 ist die Z-Koordinate des Autos, wenn es hält (siehe 'CatmullRomCurve3' in Car.jsx) */}
                    {stoppedCar && stoppedCar.position.z === -3 && (
                        <CarAndDriverProfileTextbox
                        selectedCar={selectedCar}
                        stoppedCar={cars.find(car => car.stopped)}
                    />
                    )}


                </>
            )}
        </div>
    )
}

export default App;
