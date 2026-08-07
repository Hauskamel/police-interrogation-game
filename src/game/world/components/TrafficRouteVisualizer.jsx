import { Line } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

import {
    createStreetbayPullOverRoute,
    getTrafficRoute
} from "../paths";

const DRIVING_COLOR = "#2f7dff";
const STOPPED_COLOR = "#35d04f";

export function TrafficRouteVisualizer({ trafficEntities }) {
    return trafficEntities.map((trafficEntity) => (
        <TrafficEntityRoute
            key={`route-${trafficEntity.id}`}
            trafficEntity={trafficEntity}
        />
    ));
}

function TrafficEntityRoute({ trafficEntity }) {
    const points = useMemo(() => {
        const route = getVisibleRoute(trafficEntity);

        return route.getPoints(64).map((point) => (
            point.clone().setY(point.y + 0.06)
        ));
    }, [trafficEntity]);

    const isStopped = trafficEntity.stopped;

    return (
        <Line
            points={points}
            color={isStopped ? STOPPED_COLOR : DRIVING_COLOR}
            lineWidth={isStopped ? 3 : 1.5}
            transparent
            opacity={isStopped ? 0.9 : 0.22}
            depthWrite={false}
        />
    );
}

function getVisibleRoute(trafficEntity) {
    if (!trafficEntity.stopped || !trafficEntity.position) {
        return getTrafficRoute(trafficEntity.spawn);
    }

    const currentPosition = new THREE.Vector3(
        trafficEntity.position.y,
        0,
        trafficEntity.position.z
    );

    return createStreetbayPullOverRoute(currentPosition);
}
