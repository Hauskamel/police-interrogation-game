import { generateUUID } from "three/src/math/MathUtils.js"
import { generateDriverProfile } from "./driverProfileGenerator.js"
import { generateCarProfile } from "./carProfileGenerator"


// rename to: basicEntityProfileGenerator
export const basicEntityProfile = () => {
    const profile = {
        driverProfile: generateDriverProfile(),
        carProfile: generateCarProfile(),
        id: generateUUID()
    }
    return profile
}