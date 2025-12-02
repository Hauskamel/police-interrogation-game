import { generateDriverProfile } from "../profileGenerators/driverProfileGenerator.js"
import { generateCarProfile } from "../profileGenerators/carProfileGenerator"
import { crimes } from '../../data/crimes.js';

export const criminalDatabaseGenerator = () => {
    // const setCriminalDatabase = useNpcStore(state => state.setCriminalDatabase);
    const criminals = []

    do {
        const crime = crimes.severity[Math.floor(Math.random() * crimes.severity.length)]
        const levelOfCrime = crime.level
        const crimeCase = crime.cases[Math.floor(Math.random() * crime.cases.length)]
        
        const profile = {
            driverProfile: generateDriverProfile(),
            carProfile: generateCarProfile(), // TODO: bitte hier die Funktion anpassen (Parameter wie in 'generateDriverProfile')
            arrested: false,
            levelOfCrime : levelOfCrime,
            crimeCase: crimeCase
        }
        criminals.push(profile);
        generateDriverProfile();
    } while (criminals.length < 2);

    return criminals
}