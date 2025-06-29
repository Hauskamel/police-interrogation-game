import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { streetbayEntry } from "../utils/streetbayEntries/streetbayEntry";
import { STREETBAY_ENTRY_1 } from "../config/positions";
import { useCarStore } from "../store";

export function useVehicleAnimation(car, carRef, removeCar) {
    const carPosition = useCarStore((state) => state.carPosition);
    const previousPositionRef = useRef(null);
    const carIsStopped = car.stopped;


    // distance of driven curve (when entering bay) from 0 to 1 (to policeman)
    const [t, setT] = useState(0);

    useFrame(() => {
        if (!carRef.current) return;

        const currentPositionX = Math.floor(carRef.current.position.x * 100) / 100;
        
        if (carIsStopped) {
            const currentPositionZ = Math.floor(carRef.current.position.z * 100) / 100;
            
            if (!previousPositionRef.current || previousPositionRef.current.x !== currentPositionX || previousPositionRef.current.z !== currentPositionZ) {
                carPosition(car.id, currentPositionX, currentPositionZ);
                previousPositionRef.current = { 
                    x: currentPositionX,
                    z: currentPositionZ 
                };
            }

        } else {
            if (!previousPositionRef.current || previousPositionRef.current.x !== currentPositionX) {
                    carPosition(car.id, currentPositionX);
                    previousPositionRef.current = { 
                        x: currentPositionX
                    };
                }
        }


        // check if car passed first entry point of bay
        if (currentPositionX < STREETBAY_ENTRY_1[0] && carIsStopped) {
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