import {driverImageProfiles} from "../utils/driverImageProfiles"
import { faker } from "@faker-js/faker";

const driverImages = Object.keys(driverImageProfiles);
function getRandomImage(exclude = null) {
    // driverImagesFilter takes all images except the passed via parameter - if no paramter is passed (= null) the entire array is passed
    const driverImagesFilter = exclude ? driverImages.filter(img => img !== exclude) : driverImages;
    // returns one element of 'driverImages' array
    return faker.helpers.arrayElement(driverImagesFilter);
}


export function generateDriverProfile (isWanted) {
    // ######## DRIVER INFORMATION ########
    // #####################################

    // driver Image
    const driverImage = getRandomImage();
    const imageProfile = driverImageProfiles[driverImage];

    // driver gender
    const prefix = faker.person.prefix(imageProfile.gender);

    // driver name
    const firstName = faker.helpers.arrayElement(imageProfile.firstNames);
    const lastName = faker.person.lastName();

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

    // driver height
    const height = Math.floor(Math.random() * (205 - 160 + 1)) + 160;


    // driverslicense date data 
    const minIssueYear = birthYear + 18;
    const maxIssueYear = Math.min(minIssueYear + 7, new Date().getFullYear());
    const issueFrom = new Date(`${minIssueYear}-01-01`);
    const issueTo = new Date(`${maxIssueYear}-12-31`);
    const issueDate = faker.date.between({ from: issueFrom, to: issueTo });
    const formattedIssueDate = issueDate.toISOString().split('T')[0];

    // driverslicense license number
    const licenseNumber = `${faker.string.alpha({ length: 3, casing: 'upper' })}-${faker.number.int({ min: 10000000, max: 99999999 })}`;


    // ######## DRIVER SOBRIETY ########
    // #####################################
    const drunk = Math.random() < .2;
    const high = Math.random() < .2;
    const wanted = isWanted ? true : false
    // NOTE: OFFENER PUNKT - MÖGLICHERWEISE IRRELEVANT, MÖGLICHERWEISE WICHTIG FÜR ZUKÜNFTIGE VORHABEN
    // NOTE: hier noch weitere indizien als nur 'isWanted' hinzufügen
    const arrestable = isWanted ? true : false 


    const profile = {
        driverImage,
        prefix,
        prefix,
        firstName,
        lastName,
        address: faker.location.streetAddress(),
        gender: imageProfile.gender,
        birthDate,
        eyeColor: imageProfile.eyeColor,
        height,
        issueDate: formattedIssueDate,
        licenseNumber,
        drunk,
        alcoholLevel: drunk ? (Math.random() * 0.15 + 0.05).toFixed(2) : null,
        high,
        wanted,
        arrestable
    }

    return profile


}