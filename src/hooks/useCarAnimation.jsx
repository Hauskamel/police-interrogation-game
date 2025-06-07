import { useState } from "react";
import { useFrame } from "@react-three/fiber";

import { entry1Coordinates, streetbayEntry } from '../utils/streetbayEntries/streetbayEntry.js';

const MOVEMENT_SPEED = 0.06; // speed at which the car moves

export function useCarAnimation(car, carRef, updateCarPosition, updateStoppedCarPosition, removeCar) {

    const [t, setT] = useState(0);

    // animation loop
    useFrame(() => {
        if (!carRef.current) return;

        const carPositionX = Math.floor(carRef.current.position.x * 100) / 100;

        if (car.stopped) {
            // when car is stopped -> position.z is relevant to trigger 'CarAndDriverProfileTextbox'
            const carPositionZ = Math.floor(carRef.current.position.z * 100) / 100;
            updateStoppedCarPosition(car.id, carPositionX, carPositionZ);
        } else {
            // when car is not stopped -> position.z is not relevant
            updateCarPosition(car.id, carPositionX);
        }

        // check if car passed first entry point of bay
        if (carPositionX < entry1Coordinates[0] && car.stopped) {
            // track driven distance of entry
            setT((prevT) => Math.min(prevT + 0.009, 1));

            const position = streetbayEntry.getPoint(t); // Get the position at t
            const tangent = streetbayEntry.getTangent(t);
            const lookAtTarget = position.clone().add(tangent);

            carRef.current.position.copy(position);
            carRef.current.lookAt(lookAtTarget);

        } else {
            carRef.current.position.x -= MOVEMENT_SPEED; // car driving on road
        }

        if (carRef.current.position.x < -40) {
            removeCar(car.id);
        }
    });
}