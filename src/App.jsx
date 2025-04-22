import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei"
import {createRef, useEffect, useRef, useState} from "react";
import {useCarStore} from "./store";

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


// window.alert("es darf immer nur das profil von dem auto, welches kontrolliert wird, angezeigt werden.")


function App() {
    // ##################################################
    // ##################### STATES #####################
    const cars = useCarStore((state) => state.cars);
    const addCar = useCarStore((state) => state.addCar);



    // NOTE: VERSUCH 2 ### AB HIER WIEDER NORMALZUSTAND
    const [selectedCar, setSelectedCar] = useState(null);



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


    
    useEffect(() => {
        if (!selectedCar) return;
        // const selectedCarDummy = cars.find(car => car.id === selectedCar.id);
        const stoppedCar = cars.find(car => car.stopped);
        
        if (selectedCar && selectedCar.positionX < 15 && selectedCar.id !== stoppedCar.id) {
            // reset selected Car Id when Car has passed certain position AND car is not stopped car
            setSelectedCar(null);
        }
    }, [cars, selectedCar]);



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
                            isStoppedCar={cars.find(elem => elem.stopped)}
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

                    <CarAndDriverProfileTextbox
                        selectedCar={selectedCar}
                        stoppedCar={cars.find(car => car.stopped)}
                    />
                </>
            )}
        </div>
    )
}

export default App;
