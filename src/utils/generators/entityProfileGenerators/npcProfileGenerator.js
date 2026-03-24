import { getRandomNpcImageProfile } from "../../getRandomNpcImageProfile.js";
import { faker } from "@faker-js/faker";
import { getRandomFirstName } from "../../getRandomFirstName.js"
import { getDriversLicenseData } from "../../getDriversLicenseData.js";


export function generateNpcProfile () {
    // ######## DRIVER INFORMATION ########
    // #####################################

    // get driver image profile
    const driverImageProfile = getRandomNpcImageProfile();

    // driver Image
    const driverImage = driverImageProfile.driverImage;

    // first name
    const firstName = getRandomFirstName();

    // driver age
    const age = faker.number.int({
        min: driverImageProfile.ageRange[0],
        max: driverImageProfile.ageRange[1],
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


    const getDriverLicenseData = getDriversLicenseData(birthYear);




    const realProfile  = {
        driverImage,
        prefix: faker.person.prefix(driverImageProfile.gender),
        firstName,
        lastName: faker.person.lastName(),
        address: faker.location.streetAddress(),
        gender: driverImageProfile.gender,
        birthDate,
        birthYear,
        age,
        eyeColor: driverImageProfile.eyeColor,
        height: Math.floor(Math.random() * (205 - 160 + 1)) + 160,
        issueDate: getDriverLicenseData.formattedIssueDate,
        licenseNumber: `${faker.string.alpha({ length: 3, casing: 'upper' })}-${faker.number.int({ min: 10000000, max: 99999999 })}`,
    }

    return { realProfile }
        
}