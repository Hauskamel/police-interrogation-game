import {useGLTF} from "@react-three/drei";
import { useRef } from "react"

function Policeman ({ policemanX }) {
    const { scene } = useGLTF("/models/policeman.glb")
    const policemanRef = useRef();

    const positionX = 8
    // policemanX(positionX)

    
    return (
        <primitive object={ scene } ref={policemanRef} position={ [ positionX, .5, -4] } />
    )
}

export { Policeman }