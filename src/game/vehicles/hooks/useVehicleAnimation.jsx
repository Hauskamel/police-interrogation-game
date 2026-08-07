import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { useTrafficStore } from "@stores";
import { VEHICLE_VELOCITY } from "@game/world/config";
import { createStreetbayPullOverRoute, getTrafficRoute } from "@game/world/paths";

/**
 * Moves ambient traffic on a straight lane and a stopped vehicle along its
 * dedicated pull-over path to the police position at the world origin.
 */
export function useVehicleAnimation(trafficEntity, carRef) {
    const removeTrafficEntity = useTrafficStore((state) => state.removeTrafficEntity);
    const setTrafficEntityPosition = useTrafficStore((state) => state.setTrafficEntityPosition);
    const drivingRouteRef = useRef(getTrafficRoute(trafficEntity.spawn));
    const drivingDistanceRef = useRef(0);
    const pullOverRouteRef = useRef(null);
    const pullOverDistanceRef = useRef(0);
    const reachedPoliceRef = useRef(false);
    const previousPositionRef = useRef({ x: null, z: null });

    useFrame((_, delta) => {
        if (!carRef.current || reachedPoliceRef.current) return;

        if (trafficEntity.spawn?.spawnForDevPurposes) {
            updateStoredPosition();
            return;
        }

        if (trafficEntity.stopped) {
            if (!pullOverRouteRef.current) {
                pullOverRouteRef.current = createStreetbayPullOverRoute(
                    carRef.current.position
                );
            }

            reachedPoliceRef.current = moveOnRoute(
                pullOverRouteRef.current,
                pullOverDistanceRef,
                VEHICLE_VELOCITY * 0.7,
                delta
            );
            return;
        }

        const completedRoute = moveOnRoute(
            drivingRouteRef.current,
            drivingDistanceRef,
            VEHICLE_VELOCITY,
            delta
        );

        if (completedRoute) removeTrafficEntity(trafficEntity.id);
    });

    function moveOnRoute(route, distanceRef, speed, delta) {
        const routeLength = route.getLength();
        distanceRef.current = Math.min(
            distanceRef.current + speed * delta,
            routeLength
        );

        const progress = routeLength === 0 ? 1 : distanceRef.current / routeLength;
        const position = route.getPointAt(progress);
        const tangent = route.getTangent(progress);

        carRef.current.position.copy(position);
        carRef.current.lookAt(position.clone().add(tangent));
        updateStoredPosition();

        return progress >= 1;
    }

    function updateStoredPosition() {
        const x = Math.round(carRef.current.position.x * 100) / 100;
        const z = Math.round(carRef.current.position.z * 100) / 100;
        const previous = previousPositionRef.current;

        if (previous.x === x && previous.z === z) return;

        setTrafficEntityPosition(trafficEntity.id, x, z);
        previousPositionRef.current = { x, z };
    }
}
