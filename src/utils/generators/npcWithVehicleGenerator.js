import { generateUUID } from "three/src/math/MathUtils.js"
import { generateNpcProfile } from "./profileGenerators/npcProfileGenerator"
// import { generateCarProfile } from "./carProfileGenerator"


export const npcWithVehicleGenerator = () => {
    const profile = {
        driverProfile: generateNpcProfile(),
        // carProfile: generateCarProfile(),
        id: generateUUID()
    }
    return profile
}