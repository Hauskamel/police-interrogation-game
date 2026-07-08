import * as THREE from "three";

import { getTrafficRoute } from "@game/world/paths";

export function getVehicleSpawnPosition (car) {
    if (!car.spawn?.direction) {
        return;
    }

    const route = getTrafficRoute(car.spawn);
    const start = route.getPoint(0);
    const tangent = route.getTangent(0);
    const rotation = new THREE.Euler(0, Math.atan2(tangent.x, tangent.z), 0);
    const position = [start.x, start.y, start.z];

    return { position, rotation }
}
