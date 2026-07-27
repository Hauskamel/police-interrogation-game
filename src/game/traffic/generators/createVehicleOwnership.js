import { generateNpcProfile } from "@game/npcs/generators";

// ##### Vehicle Ownership Generator
// -----> Entscheidet, ob der Fahrer zugleich eingetragener Fahrzeughalter ist.
// ---> Bei abweichendem Halter wird eine eigenständige NPC-Identität für Register und Dokumente erzeugt.
export function createVehicleOwnership(driverProfile, options = {}) {
    const driverIsRegisteredOwner = options.forcedDriverIsRegisteredOwner
        ?? Math.random() < 0.7;
    const vehicleOwnerProfile = driverIsRegisteredOwner
        ? driverProfile
        : generateNpcProfile({ minimumAge: 18 });

    return {
        vehicleOwnerProfile,
        ownership: {
            registeredOwnerNpcId: vehicleOwnerProfile.real.npcId,
            driverIsRegisteredOwner
        }
    };
}
