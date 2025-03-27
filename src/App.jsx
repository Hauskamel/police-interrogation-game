import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"

import { Road } from "./components/Road"
import { Car } from "./components/Car"

import './App.css'
import {Streetbay} from "./components/Streetbay.jsx";


//
// function CameraHelper () {
//     const camera = new PerspectiveCamera(60, 1, 1, 1)
//     console.log(camera)
//     return <cameraHelper args={[camera]} />;
// }



function App() {
    return (
        <Canvas camera={ {position: [2, 2, 2], fov: 90} } >
            <ambientLight />
            <directionalLight position={ [5,5,5] } />
            <OrbitControls />

            <Road />
            <Car />
            <Streetbay />

            {/* Camera */}
            {/*<CameraHelper />*/}


        </Canvas>
    )
}

export default App;
