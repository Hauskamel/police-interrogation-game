import {driverImageProfiles} from "../../utils/driverImageProfiles.js"

import {applyRandomManipulations} from "./fakeProfileGenerator.js"

import { faker } from "@faker-js/faker";



// this function may be exported someday
const firstNames = [
    'Peter', 'Michael', 'Alexander', 'John', 'Robert', 'Lukas', 'Christoph', 
    'Maximilian', 'Simon', 'Justin', 'Louis', 'Gabriel', 'Armin', 'Sebastian', 
    'Ethan', 'Martin', 'Bernhard', 'Leo', 'Leonhard', 'Charles', 'James', 
    'Andrew', 'Steven', 'Brian', 'Kevin', 'Jason', 'Eric', 'Tyler', 'Dylan',
    'Mark', 'Anthony', 'Todd', 'Gregory', 'Kyle', 'Brandon', 'Zachary', 'Cody',
    'George', 'Frank', 'Ronald', 'Larry', 'Wayne', 'Logan', 'Hunter', 'Austin',
    'Blake', 'Daniel', 'Scott', 'Shawn', 'Connor'
]

// ---> generates a random chance in percent (%)
const randomChance = (percent) => {
    return Math.random() < percent / 100
}


const driverImages = Object.keys(driverImageProfiles); // returns all key (in form of this string: 'driver1.jpg') from the 'driverImagesProfiles' array (driverImageProfiles.js) 
function getRandomImage(exclude = null) {
    // driverImagesFilter takes all images except the passed via parameter - if no paramter is passed (= null) the entire array is passed
    const driverImagesFilter = exclude ? driverImages.filter(img => img !== exclude) : driverImages;
    // returns one element of 'driverImages' array
    return faker.helpers.arrayElement(driverImagesFilter);
}


function getRandomFirstName() {
    const randomIndex = Math.floor(Math.random() * firstNames.length)
    return firstNames[randomIndex]
}



// ---> array with functions to manipulate the driver realProfile
const createManipulations = (imageProfile) => [
    profile => ({
        ...profile,
        prefix: faker.person.prefix(imageProfile.gender)
    }),
    profile => ({
        ...profile,
         firstName: getRandomFirstName()
    }),
    profile => ({
        ...profile,
        lastName: faker.person.lastName()
    }),
    profile => ({
        ...profile,
        address: faker.location.streetAddress(),
    }),
    profile => ({
        ...profile,
        gender: imageProfile.gender,
    }),
    profile => {
        const age = faker.number.int({
            min: driverImageProfiles[profile.driverImage].ageRange[0],
            max: driverImageProfiles[profile.driverImage].ageRange[1],
        });
        return {
            ...profile,
            age
        }
    },
    profile => ({
        ...profile,
        birthYear: new Date().getFullYear() - (Math.floor(Math.random() * 50) + 10)
    }),
    profile => {
        const birthYear = profile.birthYear || (new Date().getFullYear() - (profile?.age));
        const birthDate = faker.date
            .between({
                from: `${birthYear}-01-01`,
                to: `${birthYear}-12-31`
            })
            .toISOString()
            .split('T')[0];
        return {
            ...profile,
            birthDate
        };
    },
    profile => ({
        ...profile,
        height: Math.floor(Math.random() * (205 - 160 + 1)) + 160,
    }),
    profile => ({
        ...profile,
        licenseNumber: `${faker.string.alpha({ length: 3, casing: 'upper' })}-${faker.number.int({ min: 10000000, max: 99999999 })}`,
    }),
]


export function generateDriverProfile (isWanted) {
    // ######## DRIVER INFORMATION ########
    // #####################################


    // ##########################################################
    // NOTE/TODO:
    // BITTE 'driverImage' UND 'imageProfile' STAND JETZT NICHT MANPIULIEREN LASSEN
    // DA zB 'ageRange' ABHÄNGIG VOM BILD IST UND BEIM MANIPULIEREN DES BILDES WÜRDE
    // SICH NICHT NUR DAS BILD ÄNDERN SONDERN AUCH DIE 'ageRange' UND DIE 'eyeColor'

    // driver Image
    const driverImage = getRandomImage();
    const imageProfile = driverImageProfiles[driverImage]; // object from 'driverImagesProfiles' array (driverImageProfiles.js)
    // ##########################################################

    // first names
    const firstName = getRandomFirstName();

    // driver age
    const age = faker.number.int({
        min: imageProfile.ageRange[0],
        max: imageProfile.ageRange[1],
    });

    // driver brith data
    const birthYear = new Date().getFullYear() - age;
    const birthDate = faker.date
        .between({
            from: `${birthYear}-01-01`,
            to: `${birthYear}-12-31`
        })
        .toISOString()
        .split('T')[0];

    // driverslicense date data 
    const minIssueYear = birthYear + 18;
    const maxIssueYear = Math.min(minIssueYear + 7, new Date().getFullYear());
    const issueFrom = new Date(`${minIssueYear}-01-01`);
    const issueTo = new Date(`${maxIssueYear}-12-31`);
    const issueDate = faker.date.between({ from: issueFrom, to: issueTo });
    const formattedIssueDate = issueDate.toISOString().split('T')[0];

    // ######## DRIVER SOBRIETY ########
    // #####################################
    // const drunk = Math.random() < .2;
    // const high = Math.random() < .2;

    const realProfile  = {
        driverImage,
        prefix: faker.person.prefix(imageProfile.gender),
        firstName,
        lastName: faker.person.lastName(),
        address: faker.location.streetAddress(),
        gender: imageProfile.gender,
        birthDate,
        birthYear,
        age,
        eyeColor: imageProfile.eyeColor,
        height: Math.floor(Math.random() * (205 - 160 + 1)) + 160,
        issueDate: formattedIssueDate,
        licenseNumber: `${faker.string.alpha({ length: 3, casing: 'upper' })}-${faker.number.int({ min: 10000000, max: 99999999 })}`,
        // drunk,
        // alcoholLevel: drunk ? (Math.random() * 0.15 + 0.05).toFixed(2) : null,
        // high,
        // wanted: !!isWanted, // gilt nur für NPCs, die beim Spielbeginn bereits gesucht sind
        // arrestable: !!isWanted
    }

    if (isWanted) return { realProfile }; // wanted list profiles need to match the original identity --> only true if profile is generated for wanted List

    // Generate toManipulate of a manipulated (fake) profile being generated
    let fakeProfile = null;
    if (randomChance(50)) {
        const manipulations = createManipulations(imageProfile);
        fakeProfile = applyRandomManipulations(realProfile, manipulations);
    }

    return fakeProfile ?
        { realProfile, fakeProfile } :
        { realProfile }
}