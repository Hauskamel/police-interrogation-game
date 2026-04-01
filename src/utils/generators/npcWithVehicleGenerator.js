import { generateUUID } from "three/src/math/MathUtils.js"
import { generateNpcProfile } from "./npc/npcProfileGenerator"

import { generateVehicleProfile } from "./vehicle/vehicleProfileGenerator"

export const npcWithVehicleGenerator = () => {
    const profile = {
        driverProfile: generateNpcProfile(),
        carProfile: generateVehicleProfile(),
        id: generateUUID()
    }
    return profile
}