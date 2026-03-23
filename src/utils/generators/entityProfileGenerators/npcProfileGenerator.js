import { firstNames } from "../../../data/firstNames.js";
import { npcImageProfiles } from "../../../data/npcImageProfiles.js";
import { getRandomNpcImage } from "../../getRandomNpcImage.js";
import { faker } from "@faker-js/faker";



function getRandomFirstName() {
    const randomIndex = Math.floor(Math.random() * firstNames.length)
    return firstNames[randomIndex]
}


export function generateNpcProfile () {
    // ######## DRIVER INFORMATION ########
    // #####################################

    // driver Image
    const driverImage = getRandomNpcImage();

    const npcImage = driverImage.randomImage;
    const ageGroup = driverImage.ageGroup;    
    
    const imageProfile = npcImageProfiles[ageGroup]; // object from 'driverImagesProfiles' array (driverImageProfiles.js);

    



    

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
    const arrested = false

    const realProfile  = {
        driverImage,
        biometricalData,
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
        arrested
    }

    return { realProfile }
        
}