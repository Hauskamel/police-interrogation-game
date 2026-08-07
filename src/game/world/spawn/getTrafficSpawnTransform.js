import { getTrafficRoute } from "../paths";

// ##### Traffic Spawn Transform
// -----> Berechnet Startposition und Rotation einer TrafficEntity anhand ihrer Spawn-Daten.
// ---> Die Fahrzeugdaten selbst entscheiden nicht, wo ein Fahrzeug in der Welt erscheint.
export function getTrafficSpawnTransform(trafficEntity) {
    if (trafficEntity.spawn?.spawnForDevPurposes) {
        return { position: [0, 0, 0], rotation: [0, 0, 0] };
    }

    const route = getTrafficRoute(trafficEntity.spawn);
    const position = route.getPointAt(0);
    const tangent = route.getTangent(0);

    return {
        position: position.toArray(),
        rotation: [0, Math.atan2(tangent.x, tangent.z), 0]
    };
}
