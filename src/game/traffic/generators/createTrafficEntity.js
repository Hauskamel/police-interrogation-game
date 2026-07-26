import { generateUUID } from "three/src/math/MathUtils.js";

// ##### Traffic Entity Factory
// -----> Baut die aktive Welt-Instanz aus NPC, Fahrzeug, Wahrheit und Polizeiwissen.
// ---> Eine TrafficEntity ist nicht der NPC selbst, sondern "dieser NPC fährt gerade mit diesem Fahrzeug".
export function createTrafficEntity({
    driverProfile,
    vehicleProfile,
    trafficType,
    truth,
    police,
    documentState,
    inspectionProfile,
    source
}) {
    // Gemeinsame ID für diese konkrete Spawn-/Kontrollsituation.
    const trafficEntityId = `traffic--${generateUUID()}`;

    // Stabile Referenzen auf die echte Person und das konkrete Fahrzeug.
    const npcId = driverProfile.real.npcUuid;
    const vehicleId = `vehicle--${generateUUID()}`;

    // vehicleId wird in real und presented gespiegelt, damit Wahrheit und Dokumentansicht dieselbe Fahrzeug-Referenz kennen.
    const vehicleProfileWithId = {
        real: {
            ...vehicleProfile.real,
            vehicleId
        },
        presented: {
            ...vehicleProfile.presented,
            vehicleId
        }
    };

    return {
        id: trafficEntityId,
        trafficEntityId,
        npcId,
        vehicleId,
        trafficType,
        driverProfile,
        vehicleProfile: vehicleProfileWithId,
        truth,
        police,
        documentState,
        inspectionProfile,
        source,
        stopped: false
    };
}
