import { generateDriverProfile } from "../profileGenerators/driverProfileGenerator.js"
import { generateCarProfile } from "../profileGenerators/carProfileGenerator"
import { crimes } from '../../data/crimes.js';
import { basicNpcProfile } from "./basicNpcProfileGenerator.js";

export const criminalDatabaseGenerator = () => {
    // const setCriminalDatabase = useNpcStore(state => state.setCriminalDatabase);
    const criminals = []

    do {
        const crime = crimes.severity[Math.floor(Math.random() * crimes.severity.length)]
        const levelOfCrime = crime.level
        const crimeCase = crime.cases[Math.floor(Math.random() * crime.cases.length)]
        
        const basicProfile = basicNpcProfile();
        const firstName = basicProfile.driverProfile.realProfile.firstName
        const lastName = basicProfile.driverProfile.realProfile.lastName

        const profile = {
            driverProfile: basicProfile.driverProfile,
            carProfile: basicProfile.carProfile,
            carProfile: generateCarProfile(), // TODO: bitte hier die Funktion anpassen (Parameter wie in 'generateDriverProfile')
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