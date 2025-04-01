import { useGLTF } from "@react-three/drei";
import {useMemo, useRef} from "react";
import { useFrame } from "@react-three/fiber";
import { useCarStore } from "../store";

function Car ({ car, streetBayEnteringCoordinates }) {
    const gltf = useGLTF("/models/car.glb");
    const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
    const carRef = useRef();

    const { id, stopped, status } = car;

    const removeCar = useCarStore((state) => state.removeCar);
    const stopCar = useCarStore((state) => state.stopCar);

    useFrame(() => {
        if (!carRef.current) return

        switch (status) {

            case "entering":

            default:
                console.log(carRef.current.position)
                if (!stopped) {
                    carRef.current.position.x -= 0.03;
                    if (carRef.current.position.x < -4) {
                        stopCar(id);
                    }
                    if (carRef.current.position.x < -45) {
                        removeCar(id);
                    }
                }

                if (status === "entering") {

                }
        }

    });

    return (
        <primitive object={ scene } ref={ carRef } position={ [20, 0, 0] } />
    )
}

export { Car }
