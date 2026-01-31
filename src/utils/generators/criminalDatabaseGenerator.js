import { generateDriverProfile } from "./entityProfileGenerators/driverProfileGenerator.js"
import { crimes } from '../../data/crimes.js';
import { basicEntityProfile } from "./entityProfileGenerators/basicEntityProfileGenerator.js";

export const criminalDatabaseGenerator = () => {
    const criminals = []

    do {
        const crime = crimes.severity[Math.floor(Math.random() * crimes.severity.length)]
        const levelOfCrime = crime.level
        const crimeCase = crime.cases[Math.floor(Math.random() * crime.cases.length)]
        
        const basicProfile = Object(basicEntityProfile());

        const firstName = basicProfile.driverProfile.realProfile.firstName
        const lastName = basicProfile.driverProfile.realProfile.lastName

        const profile = {
            driverProfile: {
                ...basicProfile.driverProfile,
                crimeData: {
                    levelOfCrime : levelOfCrime,
                    crimeCase: crimeCase,
                    searchKeyWords: [firstName, lastName]
                }
            },
            carProfile: basicProfile.carProfile,
            id: basicProfile.id,
        }
        criminals.push(profile);
        generateDriverProfile();
    } while (criminals.length < 100);

    return criminals
}