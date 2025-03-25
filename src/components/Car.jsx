import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function Car () {
    const { scene } = useGLTF("/models/car.glb")
    const carRef = useRef();

    useFrame(() => {
        if (carRef.current) {
            carRef.current.position.x -= 0.03;
        }
    });

    return (
        <primitive object={ scene } ref={ carRef } position={ [ 20, 0, 0] } />
    )
}


export { Car }
