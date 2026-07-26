import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { STREETBAY_ENTRY_1, VEHICLE_VELOCITY, DESPAWN_POSITION_X } from "@game/world/config";
import { streetbayEntryCoordinates } from "@game/world/paths";
import { useTrafficStore } from "@stores";


/**
 * ##### Vehicle Animation Hook
 * -----> Animiert Fahrzeuge auf der Strasse oder entlang der Einfahrtskurve.
 * @param {object} car - Car data. (id, stopped, driverProfile,...)
 * @param {object} carRef - Ref to the THREE.Object3D class for car
 */

export function useVehicleAnimation(car, carRef) {
    const removeTrafficEntity = useTrafficStore((state) => state.removeTrafficEntity);
    const setTrafficEntityPosition = useTrafficStore((state) => state.setTrafficEntityPosition)

    // track the last position sent to store (to update only when position actually changed)
    const previousPositionRef = useRef({y: null, z: null});

    // Animation progress [0, 1] for curve, only advances while following curve into bay
    const [t, setT] = useState(0);

    useFrame(() => {
        // early exit if ref is not attached
        if (!carRef.current) return;
        
        // tracks current car position (y, z)
        const curX = Math.floor(carRef.current.position.x * 100) / 100;        
        const curY = Math.floor(carRef.current.position.y * 100) / 100;        
        const curZ = Math.floor(carRef.current.position.z * 100) / 100;

        // only update when position actually changed
        function updateCarPosition (y, z) {
            const prev = previousPositionRef.current;
            if (prev.y !== y || (typeof z === "number" && prev.z !== z)) {
                
                setTrafficEntityPosition(car.id, y, z);
                previousPositionRef.current = {y, z};
            }
        }

        // decide if entering bay (curve path) or just following straight path
        if (car.stopped) {
            updateCarPosition(curY, curZ);
        } else {
            updateCarPosition(curY, undefined)
        }

        // check if stopped car passed first entry point of bay
        if (curY < STREETBAY_ENTRY_1[0] && car.stopped) {
            // track driven distance of entry
            setT(prevT => Math.min(prevT + 0.009, 1))
    
            // Animation along curve
            const position = streetbayEntryCoordinates.getPoint(t); // Get the position at t
            const tangent = streetbayEntryCoordinates.getTangent(t);
            const lookAtTarget = position.clone().add(tangent);
    
            carRef.current.position.copy(position);
            carRef.current.lookAt(lookAtTarget);
        } else {
            moveTrafficEntityStraight(car, carRef);

            if (hasTrafficEntityLeftWorld(car, curX)) {
                removeTrafficEntity(car.id);
            }

        }

    });
}

// ##### Straight Traffic Movement
// -----> Bewegt eine TrafficEntity auf ihrer Spur geradeaus.
// ---> Dev-Spawns an der Kontrollstelle bleiben stehen, damit sie direkt inspiziert werden können.
function moveTrafficEntityStraight(trafficEntity, carRef) {
    if (trafficEntity.spawn.spawnForDevPurposes) {
        carRef.current.position.z = 0;
        return;
    }

    if (trafficEntity.spawn.direction === "left") {
        carRef.current.position.x -= VEHICLE_VELOCITY;
        return;
    }

    carRef.current.position.x += VEHICLE_VELOCITY;
}

// ##### Traffic Despawn Check
// -----> Entfernt Fahrzeuge, sobald sie die sichtbare Welt verlassen haben.
// ---> Die Richtung entscheidet, auf welcher Seite der Weltgrenze despawned wird.
function hasTrafficEntityLeftWorld(trafficEntity, curX) {
    if (trafficEntity.spawn.spawnForDevPurposes) return false;

    if (trafficEntity.spawn.direction === "left") {
        return curX < -DESPAWN_POSITION_X;
    }

    return curX > DESPAWN_POSITION_X;
}
