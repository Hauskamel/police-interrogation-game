import * as THREE from "three";

// ##### Traffic Spawn Transform
// -----> Berechnet Startposition und Rotation einer TrafficEntity anhand ihrer Spawn-Daten.
// ---> Die Fahrzeugdaten selbst entscheiden nicht, wo ein Fahrzeug in der Welt erscheint.
export function getTrafficSpawnTransform(trafficEntity) {
    const spawn = trafficEntity.spawn;
    if (!spawn) return;

    let position, rotation;

    if (spawn.direction === "left") {
        rotation = new THREE.Euler(0, Math.PI / 2, 0);
        const xy = [70, 0];

        switch (spawn.lane) {
            case 0:
                // Dev-/Kontrollspur: das Fahrzeug wird direkt an der Kontrollstelle platziert.
                position = [0, 0, undefined];
                break;
            case 1:
                position = [...xy, 9];
                break;
            case 2:
                position = [...xy, 14];
                break;
            case 3:
                position = [...xy, 20];
                break;
        }
    } else if (spawn.direction === "right") {
        rotation = new THREE.Euler(0, - Math.PI / 2, 0);
        const xy = [-70, 0];

        switch (spawn.lane) {
            case 1:
                position = [...xy, 30];
                break;
            case 2:
                position = [...xy, 36];
                break;
            case 3:
                position = [...xy, 42];
                break;
        }
    }

    return { position, rotation };
}

