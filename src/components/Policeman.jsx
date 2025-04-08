import {useGLTF} from "@react-three/drei";
import { useRef } from "react"

function Policeman () {
    const { scene } = useGLTF("/models/policeman.glb")
    const policemanRef = useRef();

    
    return (
        <primitive object={ scene } ref={policemanRef} position={ [ 8, .5, -4] } />
    )
}

export { Policeman }