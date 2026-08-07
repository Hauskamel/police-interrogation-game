import * as THREE from "three";

import { STREETBAY_ENTRY_1, TRAFFIC_DESPAWN_X, TRAFFIC_SPAWN_X } from "../config";

const LEFT_LANE_Z = { 1: 9, 2: 14 };

const RIGHT_LANE_Z = {
    1: 30,
    2: 36,
};

export const TRAFFIC_ROUTE_SPAWNS = [
    { direction: "left", lane: 1 },
    { direction: "left", lane: 2 },
    { direction: "right", lane: 1 },
    { direction: "right", lane: 2 },
];

function createLineRoute(start, end) {
    const route = new THREE.CurvePath();
    route.add(new THREE.LineCurve3(start, end));
    return route;
}

export function getTrafficLaneZ(spawn) {
    if (spawn.direction === "right") {
        return RIGHT_LANE_Z[spawn.lane] ?? RIGHT_LANE_Z[1];
    }

    return LEFT_LANE_Z[spawn.lane] ?? LEFT_LANE_Z[1];
}

export function getTrafficRoute(spawn) {
    const z = getTrafficLaneZ(spawn);

    if (spawn.direction === "right") {
        return createLineRoute(
            new THREE.Vector3(-TRAFFIC_SPAWN_X, 0, z),
            new THREE.Vector3(TRAFFIC_DESPAWN_X, 0, z),
        );
    }

    return createLineRoute(
        new THREE.Vector3(TRAFFIC_SPAWN_X, 0, z),
        new THREE.Vector3(-TRAFFIC_DESPAWN_X, 0, z),
    );
}

export function getTrafficRoutes() {
    return TRAFFIC_ROUTE_SPAWNS.map((spawn) => ({
        ...spawn,
        route: getTrafficRoute(spawn),
    }));
}

export function createStreetbayPullOverRoute(startPosition) {
    const route = new THREE.CurvePath();
    const start = startPosition.clone();
    const entry = new THREE.Vector3(STREETBAY_ENTRY_1[0], STREETBAY_ENTRY_1[1], STREETBAY_ENTRY_1[2]);
    const bayStop = new THREE.Vector3(0, 0, 0);

    route.add(new THREE.CubicBezierCurve3(
        start,
        new THREE.Vector3(start.x - 6, start.y, start.z),
        new THREE.Vector3(entry.x + 4, entry.y, entry.z),
        entry,
    ));

    route.add(new THREE.CubicBezierCurve3(
        entry,
        new THREE.Vector3(entry.x - 2, entry.y, entry.z),
        new THREE.Vector3(bayStop.x + 2, bayStop.y, bayStop.z),
        bayStop,
    ));

    return route;
}
