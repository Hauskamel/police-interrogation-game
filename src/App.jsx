import { Canvas } from "@react-three/fiber";
import {KeyboardControls, OrbitControls} from "@react-three/drei"

import { Road } from "./components/Road";
import { Car } from "./components/Car";
import { Policeman } from "./components/Policeman";

import './App.css'
import {Streetbay} from "./components/Streetbay.jsx";
import {useEffect, useState,} from "react";
import {generateUUID, randInt} from "three/src/math/MathUtils.js";

import { useCarStore } from "./store";
import {Startmenu} from "./components/Startmenu.jsx";
import {CarControlTextbox} from "./components/CarControlTextbox.jsx";


function App() {
    const cars = useCarStore((state) => state.cars);
    const addCar = useCarStore((state) => state.addCar);
    const [selectedCarId, setSelectedCarId] = useState(null);

    useEffect(() => {
        let respawnTime = randInt(2000, 3000);

        const intervalId = setInterval(() => {
            const newCar = {
                id: generateUUID(),
                stopped: false,
            };
            addCar(newCar);
        }, respawnTime);

        return () => clearInterval(intervalId);
    }, [addCar]);

    return (
        <>
            <Canvas camera={ {position: [7, 14, -16], fov: 70} } >
                <ambientLight />
                <directionalLight position={ [5,5,5] } />
                <OrbitControls />

                <Road />
                {cars.map((car) => (
                    <Car key={car.id} car={car} onSelect={setSelectedCarId} />
                ))}
                <Streetbay />
                <Policeman />

            </Canvas>
            <Startmenu />

            {selectedCarId && (
                <CarControlTextbox
                    carId={selectedCarId}
                    onClose={() => setSelectedCarId(null)}
                />
            )}
        </>
    )
}

export default App;
