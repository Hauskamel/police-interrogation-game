import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"

import { Road } from "./components/Road"
import { Car } from "./components/Car"

import './App.css'

function App() {

    return (
        <Canvas >
            <ambientLight />
            <directionalLight position={ [5,5,5] } />
            <OrbitControls />

            <Road />
            <Car />
        </Canvas>
    )
}

export default App;
