import { generateDriverProfile } from "../utils/generateDriverProfile";
import { generateCarProfile } from "./generateCarProfile";




export function generateWantedListProfiles () {
    const criminals = [];

    while (criminals.length < 3) {
        const profile = {
            driverProfile: generateDriverProfile(true),
            carProfile: generateCarProfile(),
            arrested: false
        }
        criminals.push(profile)
    }

    return criminals
}