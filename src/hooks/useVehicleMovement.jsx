import { useState } from "react";
import { entry1Coordinates, streetbayEntry } from "../utils/streetbayEntries/streetbayEntry";

export function useVehicleMovement (carRef, carIsStopped) {
    // distance of driven curve (when entering bay) from 0 to 1
    const [t, setT] = useState(0);

    const currentPositionX = Math.floor(carRef.current.position.x * 100) / 100;

    // check if car passed first entry point of bay
    if (currentPositionX < entry1Coordinates[0] && carIsStopped) {
        // track driven distance of entry
        setT((prevT) => {
            const nextT = prevT + 0.009;
            return nextT > 1 ? 1 : nextT;
        });

        const position = streetbayEntry.getPoint(t); // Get the position at t
        const tangent = streetbayEntry.getTangent(t);
        const lookAtTarget = position.clone().add(tangent);

        carRef.current.position.copy(position);
        carRef.current.lookAt(lookAtTarget);

    } else {
        carRef.current.position.x -= 0.1; // car driving on road
    }
}