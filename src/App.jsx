import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei"

import {Road} from "./components/Road";
import {Car} from "./components/Car";
import {Policeman} from "./components/Policeman";

import './App.css'
import {Streetbay} from "./components/Streetbay.jsx";
import {useEffect,} from "react";
import {generateUUID} from "three/src/math/MathUtils.js";

import {useCarStore } from "./store";


function App() {
    const cars = useCarStore((state) => state.cars);
    const addCar = useCarStore((state) => state.addCar);

    // spawns new car
    useEffect(() => {
        const newCar = {
            id: generateUUID(),
            stopped: false,
        };
        addCar(newCar);
    }, []);

    return (
        <Canvas camera={{position: [7, 14, -16], fov: 70}}>
            <ambientLight/>
            <directionalLight position={[5, 5, 5]}/>
            <OrbitControls/>

            <Road/>
            {cars.map((car) => (
                <Car key={car.id} car={car}/>
            ))}
            <Streetbay/>
            <Policeman/>

        </Canvas>
    )
}

export default App;
