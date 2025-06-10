import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { entry1Coordinates, streetbayEntry } from "../utils/streetbayEntries/streetbayEntry";

import { useVehicleMovement } from "./useVehicleMovement";

export function useVehicleAnimation(car, carRef, removeCar) {
    const updateCarPosition = useCarStore((state) => state.updateCarPosition);
    const updateStoppedCarPosition = useCarStore((state) => state.updateStoppedCarPosition);
    const previousPositionRef = useRef(null);
    const carIsStopped = car.stopped;



    // FIXME: Hier stimmt was mit dem updateStoppedCarPosition und updateCarPosition - ich versuche diese gerade in dei useVehicleAnimation hook einzubauen


    // distance of driven curve (when entering bay) from 0 to 1 (to policeman)
    const [t, setT] = useState(0);

    useFrame(() => {
        if (!carRef.current) return;

        const currentPositionX = Math.floor(carRef.current.position.x * 100) / 100;
        
        
        if (carIsStopped) {

            const currentPositionZ = Math.floor(carRef.current.position.z * 100) / 100;
            
            if (!previousPositionRef.current || 
                previousPositionRef.current.x !== currentPositionX || 
                previousPositionRef.current.z !== currentPositionZ) 
            {
                updateStoppedCarPosition(car.id, currentPositionX, currentPositionZ);
                previousPositionRef.current = { 
                    x: currentPositionX,
                    z: currentPositionZ 
                };
            }

        } else {
            
            if (!previousPositionRef.current ||
                previousPositionRef.current.x !== currentPositionX) 
            {
                updateCarPosition(car.id, currentPositionX);
                previousPositionRef.current = { 
                    x: currentPositionX
                 };
            }
        }


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


        // Handle car removal
        if (currentPositionX < -40) {
            removeCar(car.id);
        }
    });
}