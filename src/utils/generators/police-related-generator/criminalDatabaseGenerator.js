import { generateDriverProfile } from "../../profileGenerators/driverProfileGenerator"
import { generateCarProfile } from "../../profileGenerators/carProfileGenerator"

export const criminalDatabaseGenerator = () => {

    const criminals = []

    do {
        const profile = {
            driverProfile: generateDriverProfile(false),
            carProfile: generateCarProfile(false),
            arrested: false,

        }
        criminals.push(profile);
        generateDriverProfile(true)
    } while (criminals.length < 30)


}