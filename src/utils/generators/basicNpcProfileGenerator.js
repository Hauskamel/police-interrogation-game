import { generateUUID } from "three/src/math/MathUtils.js"
import { generateDriverProfile } from "../profileGenerators/driverProfileGenerator.js"
import { generateCarProfile } from "../profileGenerators/carProfileGenerator"


// rename to: basicEntityProfileGenerator
export const basicNpcProfile = () => {
    const profile = {
        driverProfile: generateDriverProfile(),
        carProfile: generateCarProfile(),
        id: generateUUID()
    }
    return profile
}