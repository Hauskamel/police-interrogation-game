import { useGLTF } from "@react-three/drei";
import {useMemo, useRef, useState} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { useCarStore } from "../store";

function Car ({ car }) {
    const gltf = useGLTF("/models/car.glb");
    const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
    const carRef = useRef();

    const [t, setT] = useState(0);

    const { id, stopped } = car;

    const removeCar = useCarStore((state) => state.removeCar);
    const stopCar = useCarStore((state) => state.stopCar);




    // Define points to follow
    const pathPoints = [
        new THREE.Vector3(5, 0, 0),
        new THREE.Vector3(3, 0, 0),
        new THREE.Vector3(2.5, 0, -1),
        new THREE.Vector3(0, 0, -1.8),
        new THREE.Vector3(-2.2, 0, -2),
    ];

    // Create a CatmullRomCurve3 with the points
    const curve = new THREE.CatmullRomCurve3(pathPoints);




    useFrame(() => {
        
        const carPositionX = Math.floor(carRef.current.position.x * 100) / 100

            if (!stopped) {
                carRef.current.position.x -= 0.03;

                // TODO: coordinate needs to be more specific (for now hardcoded '5' is ok)
                if (carPositionX < 5) {
                    console.log("entering streetbay...");
                    setT((prevT) => (prevT + .005) % 1); // loop animation

                    if (carRef.current) {
                        const position = curve.getPoint(t); // Get the position at t
                        carRef.current.position.set(position.x, position.y, position.z);
                    }
                }



                const carPositionZ = Math.floor(carRef.current.position.z * 100) / 100;
                console.log("Car position Z: " + carPositionZ);
                console.log("Car position X: " + carPositionX);


                // TODO: rework - this is not clean code - 
                // car stops according to z-axis
                if (carPositionX < -1.9) {
                    console.log(carRef.current.position.x);
                    
                    stopCar(id);
                    console.log("this statement now executes");
                    
                }



                if (carRef.current.position.x < -45) {
                    removeCar(id);
                }
            }


    });

    return (
        <primitive object={ scene } ref={ carRef } position={ [10, 0, 0] } />
    )
}

export { Car }
