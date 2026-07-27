import { createEntityId } from "@game/shared";

// ##### Traffic Entity Factory
// -----> Baut die aktive Welt-Instanz aus NPC, Fahrzeug, Wahrheit und Polizeiwissen.
// ---> Eine TrafficEntity ist nicht der NPC selbst, sondern "dieser NPC fährt gerade mit diesem Fahrzeug".
export function createTrafficEntity({
    driverProfile,
    vehicleOwnerProfile,
    vehicleProfile,
    ownership,
    trafficType,
    truth,
    police,
    documentState,
    inspectionProfile
}) {
    // Gemeinsame ID für diese konkrete Spawn-/Kontrollsituation.
    const trafficEntityId = createEntityId("traffic");

    // Stabile Referenzen auf die echte Person und das konkrete Fahrzeug.
    const npcId = driverProfile.real.npcId;
    const vehicleId = createEntityId("vehicle");

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
        vehicleOwnerProfile,
        vehicleProfile: vehicleProfileWithId,
        ownership,
        truth,
        police,
        documentState,
        inspectionProfile,
        stopped: false
    };
}
