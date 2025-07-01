import { generateDriverProfile } from "../utils/generateDriverProfile";
import { generateCarProfile } from "./generateCarProfile";

import { generateUUID } from "three/src/math/MathUtils.js";



export function generateWantedListProfiles () {
    const criminals = [];

    while (criminals.length < 3) {
        const profile = {
            id :generateUUID(), 
            stopped: false,
            driverProfile: generateDriverProfile(true),
            carProfile: generateCarProfile(),
            arrested: false
        }
        criminals.push(profile)
    }

    return criminals
}