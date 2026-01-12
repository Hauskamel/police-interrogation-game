import { generateDriverProfile } from "../profileGenerators/driverProfileGenerator.js"
import { generateCarProfile } from "../profileGenerators/carProfileGenerator"
import { crimes } from '../../data/crimes.js';
import { basicNpcProfile } from "./basicNpcProfileGenerator.js";

export const criminalDatabaseGenerator = () => {
    const criminals = []

    do {
        const crime = crimes.severity[Math.floor(Math.random() * crimes.severity.length)]
        const levelOfCrime = crime.level
        const crimeCase = crime.cases[Math.floor(Math.random() * crime.cases.length)]
        
        const basicProfile = Object(basicNpcProfile());

        const firstName = basicProfile.driverProfile.realProfile.firstName
        const lastName = basicProfile.driverProfile.realProfile.lastName

        const profile = {
            driverProfile: basicProfile.driverProfile,
            carProfile: basicProfile.carProfile,
            id: basicProfile.id,
            arrested: false,
            levelOfCrime : levelOfCrime,
            crimeCase: crimeCase,
            searchKeyWords: [firstName, lastName]
        }
        criminals.push(profile);
        generateDriverProfile();
    } while (criminals.length < 5);

    return criminals
}