import { generateDriverProfile } from "./profileGenerators/driverProfileGenerator.js";
import { generateCarProfile } from "./profileGenerators/carProfileGenerator.js"


export function generateWantedListProfiles () {
    const criminals = [];

    while (criminals.length < 3) {
        const profile = {
            driverProfile: generateDriverProfile(true),
            carProfile: generateCarProfile(true),
            arrested: false
        }
        
        criminals.push(profile)
    }

    return criminals
}