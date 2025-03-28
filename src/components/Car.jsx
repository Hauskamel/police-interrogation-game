import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Car () {
    const { scene } = useGLTF("/models/car.glb")
    const carRef = useRef();





    useFrame(() => {
        const carPositionX = Math.round(carRef.current.position.x * 100) / 100

        const targetRotation = THREE.MathUtils.degToRad(90);

        // makes car drive forward
        if (carRef.current) {
            carRef.current.position.x -= 0.06;

            if (carPositionX === 6.5) {
                // Smoothly rotate the car to the right (around the Y-axis)
                carRef.current.rotation.y = THREE.MathUtils.lerp(
                    carRef.current.rotation.y,
                    targetRotation,
                    0.05 // Controls smoothness (lower = smoother, higher = faster)
                );
            }

        }

    });

    return (
        <primitive object={ scene } ref={ carRef } position={ [20, 0, 0] } />
    )
}

export { Car }
