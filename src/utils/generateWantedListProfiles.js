import { generateDriverProfile } from "./profiles_real/generateDriverProfile";
import { generateCarProfile } from "./profiles_real/generateCarProfile";





export function generateWantedListProfiles () {
    const criminals = [];

    while (criminals.length < 3) {
        const profile = {
            stopped: false,
            driverProfile: generateDriverProfile(true),
            carProfile: generateCarProfile(),
            arrested: false
        }
        criminals.push(profile)
    }

    return criminals
}