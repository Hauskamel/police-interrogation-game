import { generateUUID } from "three/src/math/MathUtils.js"
import { generateNpcProfile } from "./npcProfileGenerator.js"
// import { generateCarProfile } from "./carProfileGenerator"


// rename to: basicEntityProfileGenerator
export const basicEntityProfile = () => {
    const profile = {
        driverProfile: generateNpcProfile(),
        // carProfile: generateCarProfile(),
        id: generateUUID()
    }
    return profile
}