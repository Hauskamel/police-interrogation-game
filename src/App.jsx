import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei"

import {Road} from "./components/Road";
import {Car} from "./components/Car";
import {Policeman} from "./components/Policeman";

import './App.css'
import {Streetbay} from "./components/Streetbay.jsx";
import {createRef, useEffect, useRef, useState} from "react";
import {generateUUID, randInt} from "three/src/math/MathUtils.js";
import {generateCarStatus} from "./utils/generateCarStatus.js";

import {useCarStore} from "./store";
import {Startmenu} from "./components/Startmenu.jsx";
import {CarControlTextbox} from "./components/CarControlTextbox.jsx";
import {CarStatusTextbox} from "./components/CarStatusTextbox.jsx";


function App() {
    const cars = useCarStore((state) => state.cars);
    const addCar = useCarStore((state) => state.addCar);
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [hoveringCar, setHoveringCar] = useState(false);

    // TODO: VARIABLENNAMEN NOCH UMBENENNEN
    const [status, setStatus] = useState()

    const carRefs = useRef({});


    // spawns new car
    useEffect(() => {


        window.alert("es müssen jetzt die Textboxen individuell gestyled (positioniert) werden, damit sie nicht übereinander liegen, wie Stand jetzt.")


        let respawnTime = randInt(2000, 5000);

        const intervalId = setInterval(() => {
            const newCar = {
                id: generateUUID(),
                stopped: false,
                status: generateCarStatus()
            };
            setStatus(newCar.status)
            addCar(newCar);
        }, respawnTime);

        return () => clearInterval(intervalId);
    }, [addCar]);

    useEffect(() => {
        if (!selectedCarId) return;

        const selectedCar = cars.find(car => car.id === selectedCarId);
        if (selectedCar && selectedCar.positionX < 15) {
            setSelectedCarId(null);
        }
    }, [cars, selectedCarId]);

    return (
        <div className={`h-full ${hoveringCar ? 'cursor-pointer' : ''}` }>
            <Canvas camera={{position: [7, 14, -16], fov: 70}}>
                <axesHelper/>
                <ambientLight/>
                <directionalLight position={[5, 5, 5]}/>
                <OrbitControls/>

                <Road />

                {cars.map((car) => {
                    if (!carRefs.current[car.id]) {
                        carRefs.current[car.id] = createRef();
                    }

                    return (
                        <Car
                            key={car.id}
                            car={car}
                            ref={carRefs.current[car.id]}
                            onSelect={setSelectedCarId}
                            onHoverChange={(hovering) => setHoveringCar(hovering ? car.id : null)}
                        />
                    );
                })}

                <Streetbay />
                <Policeman />

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
                        status={status}
                        onClose={() => setSelectedCarId(null)}
                        carId={selectedCarId}
                    />
                </>
            )}
        </div>
    )
}

export default App;
