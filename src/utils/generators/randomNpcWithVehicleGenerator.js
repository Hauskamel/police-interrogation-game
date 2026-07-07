// Diese Funktion erstellt einen random NPC und ein random Vehicle.
// Sie wird genutzt, um während dem laufenden Spiel NPCs mit Autos zu spawnen, die nicht im Zusammenhang mit einer Story stehen.


import { generateUUID } from "three/src/math/MathUtils.js"
import { generateNpcProfile } from "./npc/npcProfileGenerator"

import { generateVehicleProfile } from "./vehicle/vehicleProfileGenerator"

export const randomNpcWithVehicleGenerator = () => {
    const profile = {
        driverProfile: generateNpcProfile(),
        carProfile: generateVehicleProfile(),
        id: generateUUID()
    }


    console.log(profile);
    
    
    return profile
}