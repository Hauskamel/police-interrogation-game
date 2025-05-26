import { faker } from '@faker-js/faker';
import { driverImageProfiles } from './driverImageProfiles';
import { carProfiles } from './carProfiles';

const driverImages = Object.keys(driverImageProfiles);
const carBrands = Object.keys(carProfiles)

function getRandomImage(exclude = null) {
    const filtered = exclude ? driverImages.filter(img => img !== exclude) : driverImages;
    return faker.helpers.arrayElement(filtered);
}

export function generateCarAndDriverProfile () {


    // ######## DRIVER INFORMATION ########
    // ####################################

    const driverImage = getRandomImage();
    const imageProfile = driverImageProfiles[driverImage];
    const carProfiles = 


    let licenceImage = driverImage;
    if (Math.random() < 0.1) {
        do {
            licenceImage = getRandomImage(driverImage);
        } while (licenceImage === driverImage);
    }

    const prefix = faker.person.prefix(imageProfile.gender);

    const firstName = faker.helpers.arrayElement(imageProfile.firstNames);
    const lastName = faker.person.lastName();

    const age = faker.number.int({
        min: imageProfile.ageRange[0],
        max: imageProfile.ageRange[1],
    });

    const birthYear = new Date().getFullYear() - age;
    const birthDate = faker.date
        .between({
            from: `${birthYear}-01-01`,
            to: `${birthYear}-12-31`
        })
        .toISOString()
        .split('T')[0];

    const height = Math.floor(Math.random() * (205 - 160 + 1)) + 160;

    const minIssueYear = birthYear + 18;
    const maxIssueYear = Math.min(minIssueYear + 7, new Date().getFullYear());

    const issueFrom = new Date(`${minIssueYear}-01-01`);
    const issueTo = new Date(`${maxIssueYear}-12-31`);

    const issueDate = faker.date.between({ from: issueFrom, to: issueTo });
    const formattedIssueDate = issueDate.toISOString().split('T')[0];

    const licenseNumber = `${faker.string.alpha({ length: 3, casing: 'upper' })}-${faker.number.int({ min: 10000000, max: 99999999 })}`;

    const drunk = Math.random() < .2;
    const high = Math.random() < .2;
    const wanted = Math.random() < .2;


    // ########## CAR INFORMATION ##########
    // #####################################
    const carRegistrationNumber = faker.vehicle.vrm();
    const plateNumber = "AC - " + carRegistrationNumber.slice(2).replace(/^(.{2})/, '$1 ')

    const vehicleName = faker.vehicle.vehicle()


    const profileInformation = {
        driverImage,
        licenceImage,
        prefix,
        firstName,
        lastName,
        gender: imageProfile.gender,
        birthDate,
        eyeColor: imageProfile.eyeColor,
        height,
        licenseNumber,
        address: faker.location.streetAddress(),
        issueDate: formattedIssueDate,
        drunk,
        high,
        wanted,
        plateNumber,
        vehicleName
    }

    // conditionally rendered
    if (drunk) {
        profileInformation.alcoholLevel = (Math.random() * 0.15 + 0.05).toFixed(2) // range of 0.05 - 0.20
    }

    return profileInformation
}