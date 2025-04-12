import { useGLTF } from "@react-three/drei";
import {useMemo, useRef} from "react";
import { useFrame } from "@react-three/fiber";
import { useCarStore } from "../store";

function Car ({ car, onSelect }) {
    const gltf = useGLTF("/models/car.glb");
    const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
    const carRef = useRef();

    const {id, stopped} = car;

    const removeCar = useCarStore((state) => state.removeCar);
    const stopCar = useCarStore((state) => state.stopCar);

    useFrame(() => {

        if (!carRef.current) return;

        if (!stopped) {
            carRef.current.position.x -= 0.05;
            if (carRef.current.position.x < -4) {
                stopCar(id);
            }
            if (carRef.current.position.x < -45) {
                removeCar(id);
            }
        }
    });

    return (
        <primitive
            object={ scene }
            ref={ carRef }
            position={ [20, 0, 0] }
            onClick={(e) => {
                e.stopPropagation();
                onSelect?.(car.id);
            }}
        />
    )
}

export { Car }
