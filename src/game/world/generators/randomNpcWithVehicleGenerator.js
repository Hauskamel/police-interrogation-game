// ##### Random NPC With Vehicle Generator
// -----> Erstellt eine neutrale NPC/Fahrzeug-Entity für normale Spawns während des Spiels.
// ---> Diese Entity ist unabhängig von Story-, Wanted-List- oder Criminal-Database-NPCs.
import { generateUUID } from "three/src/math/MathUtils.js";

import { generateNpcProfile } from "@game/npcs/generators";
import { generateVehicleProfile } from "@game/vehicles/generators";

export const randomNpcWithVehicleGenerator = () => {
    const profile = {
        driverProfile: generateNpcProfile(),
        carProfile: generateVehicleProfile(),
        id: generateUUID()
    };

    return profile;
}
