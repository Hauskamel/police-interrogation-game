import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei"

import {Road} from "./components/Road";
import {Car} from "./components/Car";
import {Policeman} from "./components/Policeman";

import './App.css'
import {Streetbay} from "./components/Streetbay.jsx";
import {createRef, useEffect, useRef, useState} from "react";
import {generateUUID, randInt} from "three/src/math/MathUtils.js";
import {generateCarAndDriverStatus} from "./utils/generateCarAndDriverStatus.js";

import {useCarStore} from "./store";
import {Startmenu} from "./components/Startmenu.jsx";
import {CarControlTextbox} from "./components/CarControlTextbox.jsx";
import {CarStatusTextbox} from "./components/CarStatusTextbox.jsx";


function App() {
    // ##################################################
    // ##################### STATES #####################
    const cars = useCarStore((state) => state.cars);
    const addCar = useCarStore((state) => state.addCar);
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [hoveringCar, setHoveringCar] = useState(false);
    const [selectedCarDriverAndCarStatus, setSelectedCarDriverAndCarStatus] = useState({})

    
    // ##################################################
    // ################### REFERENCES ###################
    const carRefs = useRef({});
    



    // function executes when car is selected (onSelect)
    function handleSelectedCar (id) {
        setSelectedCarId(id);
        setSelectedCarDriverAndCarStatus(cars.find(carId => carId.id === id).status)          
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
                status: generateCarAndDriverStatus()
            };
            addCar(newCar);
        }, respawnTime);

        return () => clearInterval(intervalId);
    }, [addCar]);

    useEffect(() => {
        if (!selectedCarId) return;

        const selectedCar = cars.find(car => car.id === selectedCarId);
        if (selectedCar && selectedCar.positionX < 15) {
            // reset selected Car Id when Car has passed certain position
            setSelectedCarId(null);
        }
    }, [cars, selectedCarId]);



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
                <Policeman />
                {cars.map((car) => {
                    // if no refference on a car id in the "cars" store (store.js) exists, create a new reference to that id
                    if (!carRefs.current[car.id]) {
                        carRefs.current[car.id] = createRef();
                    }

                    return (
                        <Car
                            key={car.id}
                            car={car}
                            ref={carRefs.current[car.id]}
                            onSelect={handleSelectedCar}
                            onHoverChange={(hovering) => setHoveringCar(hovering ? car.id : null)}
                        />
                    );
                })}

            </Canvas>
            <Startmenu />

            {/* Todo: Textbox fade-out animation onClose after car reaches police checkpoint */}
            {selectedCarId && (
                <>
                    <CarControlTextbox
                        carId={selectedCarId}
                        onClose={() => setSelectedCarId(null)}
                    />
                    <CarStatusTextbox
                        carId={selectedCarId}
                        status={selectedCarDriverAndCarStatus}
                        onClose={() => setSelectedCarId(null)}
                    />
                </>
            )}
        </div>
    )
}

export default App;
