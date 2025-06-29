import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { streetbayEntry } from "../utils/streetbayEntry";
import { STREETBAY_ENTRY_1 } from "../config/positions";
import { useCarStore } from "../store";

/**
 * @param {object} car - Car data. (id, stopped, driverProfile,...)
 * @param {object} carRef - Ref to the THREE.Object3D class for car
 * @param {function} removeCar - Callback to remove car from scene
 */

export function useVehicleAnimation(car, carRef, removeCar) {
    const carPosition = useCarStore((state) => state.carPosition);
    const previousPositionRef = useRef({x: null, z: null});

    // distance of driven curve (when entering bay) from 0 to 1 (to policeman)
    const [t, setT] = useState(0);

    useFrame(() => {
        if (!carRef.current) return;
        
        const curX = Math.floor(carRef.current.position.x * 100) / 100;
        const curZ = Math.floor(carRef.current.position.z * 100) / 100;

        // only update when position actually changed
        function updateCarPosition (x, z) {
            const prev = previousPositionRef.current;
            if (prev.x !== x || (typeof z === "number" && prev.z !== z)) {
                carPosition(car.id, x, z);
                previousPositionRef.current = { x, z}
            }
        }

        if (car.stopped) {
            updateCarPosition(curX, curZ);
        } else {
            updateCarPosition(curX, undefined)
        }

        // check if stopped car passed first entry point of bay
        if (curX < STREETBAY_ENTRY_1[0] && car.stopped) {
            // track driven distance of entry
            setT(prevT => Math.min(prevT + 0.009, 1))
    
            const position = streetbayEntry.getPoint(t); // Get the position at t
            const tangent = streetbayEntry.getTangent(t);
            const lookAtTarget = position.clone().add(tangent);
    
            carRef.current.position.copy(position);
            carRef.current.lookAt(lookAtTarget);
        } else {
            carRef.current.position.x -= 0.1; // car driving on road
        }

        // Handle car removal
        if (curX < -40) {
            removeCar(car.id);
        }
    });
}