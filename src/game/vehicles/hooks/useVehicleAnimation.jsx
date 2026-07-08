import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { VEHICLE_VELOCITY } from "@game/world/config";
import { createStreetbayPullOverRoute, getTrafficRoute } from "@game/world/paths";
import { useCarStore } from "@stores";


/**
 * ##### Vehicle Animation Hook
 * -----> Animiert Fahrzeuge auf der Strasse oder entlang der Einfahrtskurve.
 * @param {object} car - Car data. (id, stopped, driverProfile,...)
 * @param {object} carRef - Ref to the THREE.Object3D class for car
 */

export function useVehicleAnimation(car, carRef) {
    const removeCar = useCarStore((state) => state.removeCar);
    const setCarPosition = useCarStore((state) => state.setCarPosition)

    const drivingRouteRef = useRef(getTrafficRoute(car.spawn));
    const drivingDistanceRef = useRef(0);
    const pullOverRouteRef = useRef(null);
    const pullOverDistanceRef = useRef(0);
    const pullOverCompletedRef = useRef(false);
    const previousPositionRef = useRef({y: null, z: null});

    useFrame((_, delta) => {
        if (!carRef.current) return;

        function updateCarPosition () {
            const x = Math.floor(carRef.current.position.x * 100) / 100;
            const z = Math.floor(carRef.current.position.z * 100) / 100;
            const prev = previousPositionRef.current;

            if (prev.y !== x || prev.z !== z) {
                setCarPosition(car.id, x, z);
                previousPositionRef.current = {y: x, z};
            }
        }

        function moveOnRoute(route, distanceRef, speed) {
            const routeLength = route.getLength();
            distanceRef.current = Math.min(distanceRef.current + speed * delta, routeLength);

            const progress = routeLength === 0 ? 1 : distanceRef.current / routeLength;
            const position = route.getPointAt(progress);
            const tangent = route.getTangent(progress);
            const lookAtTarget = position.clone().add(tangent);

            carRef.current.position.copy(position);
            carRef.current.lookAt(lookAtTarget);
            updateCarPosition();

            return progress >= 1;
        }

        if (car.stopped) {
            if (!pullOverRouteRef.current) {
                pullOverRouteRef.current = createStreetbayPullOverRoute(carRef.current.position);
                pullOverDistanceRef.current = 0;
                pullOverCompletedRef.current = false;
            }

            if (!pullOverCompletedRef.current) {
                pullOverCompletedRef.current = moveOnRoute(
                    pullOverRouteRef.current,
                    pullOverDistanceRef,
                    VEHICLE_VELOCITY * 0.7,
                );
            }

            return;
        }

        if (pullOverRouteRef.current && !pullOverCompletedRef.current) {
            pullOverCompletedRef.current = moveOnRoute(
                pullOverRouteRef.current,
                pullOverDistanceRef,
                VEHICLE_VELOCITY * 0.7,
            );
            return;
        }

        if (pullOverCompletedRef.current) {
            removeCar(car.id);
            return;
        }

        const completedRoute = moveOnRoute(drivingRouteRef.current, drivingDistanceRef, VEHICLE_VELOCITY);
        if (completedRoute) {
            removeCar(car.id);
        }
    });
}
