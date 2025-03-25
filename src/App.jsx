import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"

import { Road } from "./components/Road"
import { Car } from "./components/Car"

import { useEffect } from "react";

import './App.css'


function CameraHelper () {
    const camera = new PerspectiveCamera(60, 10, 10, 20);

    return (
        <cameraHelper args={[camera]} />
    )

}




function CameraLogger () {
    const { camera } = useThree();

    useEffect(() => {
        window.alert(camera.position)
    }, [camera]);

    return null;
}


function App() {

    return (
        <Canvas >
            <ambientLight />
            <directionalLight position={ [5,5,5] } />
            <OrbitControls />

            <CameraHelper />
            <CameraLogger />

            <Road />
            <Car />
        </Canvas>
    )
}

export default App;
