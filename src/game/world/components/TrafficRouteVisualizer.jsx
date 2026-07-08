import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

import { createStreetbayPullOverRoute, getTrafficRoute, getTrafficRoutes } from "@game/world/paths";

const ROUTE_Y_OFFSET = 0.08;
const ROUTE_POINTS = 48;

const STATUS_ROUTE_STYLES = {
    driving: {
        color: "#38bdf8",
        lineWidth: 2,
        opacity: 0.72,
    },
    queued: {
        color: "#facc15",
        lineWidth: 3,
        opacity: 0.86,
    },
    stopped: {
        color: "#ef4444",
        lineWidth: 3,
        opacity: 0.9,
    },
    pullingOver: {
        color: "#a855f7",
        lineWidth: 4,
        opacity: 0.95,
    },
};

const DIRECTION_ROUTE_STYLES = {
    left: {
        color: "#22c55e",
        lineWidth: 1,
        opacity: 0.28,
    },
    right: {
        color: "#f97316",
        lineWidth: 1,
        opacity: 0.28,
    },
};

function getRoutePoints(route) {
    return route.getPoints(ROUTE_POINTS).map((point) => [point.x, point.y + ROUTE_Y_OFFSET, point.z]);
}

function getVehicleStatus(car) {
    if (car.status) return car.status;
    if (car.stopped) return "pullingOver";
    return "driving";
}

function getCarPositionVector(car) {
    if (!car.position) return null;

    return new THREE.Vector3(car.position.y, 0, car.position.z);
}

function createVehicleRoute(car) {
    const status = getVehicleStatus(car);

    if (status === "pullingOver" || status === "stopped") {
        const currentPosition = getCarPositionVector(car);
        return currentPosition ? createStreetbayPullOverRoute(currentPosition) : getTrafficRoute(car.spawn);
    }

    return getTrafficRoute(car.spawn);
}

export function TrafficRouteVisualizer({ cars }) {
    const baseRoutes = useMemo(() => (
        getTrafficRoutes().map(({ direction, lane, route }) => ({
            id: `${direction}-${lane}`,
            style: DIRECTION_ROUTE_STYLES[direction],
            points: getRoutePoints(route),
        }))
    ), []);

    const vehicleRoutes = useMemo(() => (
        cars
            .filter((car) => car.spawn)
            .map((car) => {
                const status = getVehicleStatus(car);
                const route = createVehicleRoute(car);

                return {
                    id: car.id,
                    style: STATUS_ROUTE_STYLES[status] ?? STATUS_ROUTE_STYLES.driving,
                    points: getRoutePoints(route),
                };
            })
    ), [cars]);

    return (
        <group>
            {baseRoutes.map(({ id, points, style }) => (
                <Line
                    key={id}
                    points={points}
                    color={style.color}
                    lineWidth={style.lineWidth}
                    transparent
                    opacity={style.opacity}
                    depthWrite={false}
                />
            ))}

            {vehicleRoutes.map(({ id, points, style }) => (
                <Line
                    key={id}
                    points={points}
                    color={style.color}
                    lineWidth={style.lineWidth}
                    transparent
                    opacity={style.opacity}
                    depthWrite={false}
                />
            ))}
        </group>
    );
}
