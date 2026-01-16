import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { streetbayEntry } from "../utils/streetbayEntry";
import { STREETBAY_ENTRY_1 } from "../config/positions";
import { useCarStore } from "../store";

/**
 * Animates vehicle, either driving straight or following a curve into a parking bay
 * @param {object} car - Car data. (id, stopped, driverProfile,...)
 * @param {object} carRef - Ref to the THREE.Object3D class for car
 * @param {function} removeCar - Callback to remove car from scene
 */

export function useVehicleAnimation(car, carRef) {
    const removeCar = useCarStore((state) => state.removeCar);

    // get store action to update car position
    const carPosition = useCarStore((state) => state.carPosition)

    // track the last position sent to store (to update only when position actually changed)
    const previousPositionRef = useRef({x: null, z: null});

    // Animation progress [0, 1] for curve, only advances while following curve into bay
    const [t, setT] = useState(0);

    useFrame(() => {
        // early exit if ref is not attached
        if (!carRef.current) return;
        
        // tracks current car position (x, z)
        const curX = Math.floor(carRef.current.position.x * 100) / 100;
        const curZ = Math.floor(carRef.current.position.z * 100) / 100;

        // only update when position actually changed
        function updateCarPosition (x, z) {
            const prev = previousPositionRef.current;
            if (prev.x !== x || (typeof z === "number" && prev.z !== z)) {
                carPosition(car.id, x, z);
                previousPositionRef.current = {x, z}
            }
        }

        // decide if entering bay (curve path) or just following straight path
        if (car.stopped) {
            updateCarPosition(curX, curZ);
        } else {
            updateCarPosition(curX, undefined)
        }

        // check if stopped car passed first entry point of bay
        if (curX < STREETBAY_ENTRY_1[0] && car.stopped) {
            // track driven distance of entry
            setT(prevT => Math.min(prevT + 0.009, 1))
    
            // Animation along curve
            const position = streetbayEntry.getPoint(t); // Get the position at t
            const tangent = streetbayEntry.getTangent(t);
            const lookAtTarget = position.clone().add(tangent);
    
            carRef.current.position.copy(position);
            carRef.current.lookAt(lookAtTarget);
        } else {
            // NOTE: The car velocity in -x direction (original value: 0.1) does vary from device to device due to performance differences
            // NOTE: on windows its 0.05
            // NOTE: on Mac/Linux its 0.1

            if (car.spawn.direction === "left") {
                carRef.current.position.z += 0.05; // car driving on road straight in -x direction
            } else {
                carRef.current.position.z -= 0.05; // car driving on road straight in -x direction
            }


        }

        // Handle offscreen car removal
        if (curX < -40) {
            removeCar(car.id);
        }
    });
}