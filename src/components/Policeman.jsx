import {useGLTF} from "@react-three/drei";
import { useRef } from "react"

function Policeman ({ position }) {
    const { scene } = useGLTF("/models/policeman.glb")
    const policemanRef = useRef();

    const positionX = position[0]
    const positionY = position[1];
    const positionZ = position[2];
    
    return (
        <primitive object={ scene } ref={policemanRef} position={ [ positionX, positionY, positionZ] } />
    )
}

export { Policeman }