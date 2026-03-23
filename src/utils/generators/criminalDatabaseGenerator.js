// import { generateDriverProfile } from "./entityProfileGenerators/driverProfileGenerator.js"
import { basicEntityProfile } from "./entityProfileGenerators/basicEntityProfileGenerator.js";

export const criminalDatabaseGenerator = () => {
    const criminals = []

    do {
    
        const basicProfile = Object(basicEntityProfile());

        const firstName = basicProfile.driverProfile.realProfile.firstName
        const lastName = basicProfile.driverProfile.realProfile.lastName

        const profile = {
            driverProfile: {
                ...basicProfile.driverProfile,
                crimeData: {
                    searchKeyWords: [firstName, lastName]
                }
            },
            carProfile: basicProfile.carProfile,
            id: basicProfile.id,
        }
        criminals.push(profile);
        // generateDriverProfile();
    } while (criminals.length < 100);

    return criminals
}