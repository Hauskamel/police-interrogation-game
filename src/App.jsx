import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"

import { Road } from "./components/Road";
import { Car } from "./components/Car";
import { Policeman } from "./components/Policeman";

import './App.css'
import { Streetbay } from "./components/Streetbay.jsx";
import { useEffect } from "react";
import { generateUUID, randInt } from "three/src/math/MathUtils.js";

import { useCarStore } from "./store";



function App() {
    const cars = useCarStore((state) => state.cars);
    const addCar = useCarStore((state) => state.addCar);








    function CameraController () {
        const { camera } = useThree();

        useEffect(() => {
            camera.position.set(7, 12, -16);
            // camera.lookAt(Policeman);
        }, [camera]);
        return null;
    }









    useEffect(() => {
        let respawnTime = randInt(10000, 18000);

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
        <Canvas >
            <CameraController />
            <ambientLight />
            <directionalLight position={ [5,5,5] } />
            <OrbitControls />

            <Road />
            {cars.map((car) => (
                <Car key={car.id} car={car} />
            ))}
            <Streetbay />
            <Policeman />

        </Canvas>
    )
}

export default App;
