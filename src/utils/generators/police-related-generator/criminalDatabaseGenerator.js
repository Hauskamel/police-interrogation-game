import { generateDriverProfile } from "../../profileGenerators/driverProfileGenerator"


export const criminalDatabaseGenerator = () => {

    const criminals = []

    do {
        generateDriverProfile(true)
    } while (criminals.length < 30)


}