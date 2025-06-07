import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function useCarAnimation(car, carRef, updateCarPosition, updateStoppedCarPosition, removeCar) {
    const previousPositionRef = useRef(null);

    useFrame(() => {
        if (!carRef.current) return;

        const currentPositionX = Math.floor(carRef.current.position.x * 100) / 100;

        // Avoid redundant updates
        if (car.stopped) {
            const currentPositionZ = Math.floor(carRef.current.position.z * 100) / 100;

            console.log(currentPositionX, currentPositionZ);
            

            if (
                !previousPositionRef.current ||
                previousPositionRef.current.x !== currentPositionX ||
                previousPositionRef.current.z !== currentPositionZ
            ) {
                updateStoppedCarPosition(car.id, currentPositionX, currentPositionZ);
                previousPositionRef.current = { x: currentPositionX, z: currentPositionZ };
            }
        } else {
            if (!previousPositionRef.current || previousPositionRef.current.x !== currentPositionX) {
                updateCarPosition(car.id, currentPositionX);
                previousPositionRef.current = { x: currentPositionX };
            }
        }

        // Handle car removal
        if (currentPositionX < -40) {
            removeCar(car.id);
        }
    });
}