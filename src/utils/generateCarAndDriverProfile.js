import { faker } from '@faker-js/faker';
import { driverImageProfiles } from './driverImageProfiles';
import { carProfiles } from './carProfiles';

const driverImages = Object.keys(driverImageProfiles);
const carBrands = Object.keys(carProfiles)

function getRandomImage(exclude = null) {
    // driverImagesFilter takes all images except the passed via parameter - if no paramter is passed (= null) the entire array is passed
    const driverImagesFilter = exclude ? driverImages.filter(img => img !== exclude) : driverImages;
    // returns one element of 'driverImages' array
    return faker.helpers.arrayElement(driverImagesFilter);
}

function getRandomCarBrand(exclude = null) {
    const carBrandFilter = exclude ? carBrands.filter(brand => brand !== exclude) : carBrands;
    const carBrand = faker.helpers.arrayElement(carBrandFilter)
    return carBrand
}

export function generateCarAndDriverProfile () {
    // ######## DRIVER INFORMATION ########
    // #####################################

    // driver Image
    const driverImage = getRandomImage();
    const imageProfile = driverImageProfiles[driverImage];
    let licenceImage = driverImage;
    if (Math.random() < 0.1) {
        do {
            licenceImage = getRandomImage(driverImage);
        } while (licenceImage === driverImage);
    }

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



    // TODO: Darüber bitte nochmal besprechen - soll das in diesem File generiert werden? Oder lieber ausgelagert werden`
    // ######## DRIVER SOBRIETY ########
    // #####################################
    const drunk = Math.random() < .2;
    const high = Math.random() < .2;
    const wanted = Math.random() < .2;



    // ########## CAR INFORMATION ##########
    // #####################################
    // car brand
    const brandName = getRandomCarBrand();
    const carProfile = carProfiles[brandName]

    // car model
    const brandModel =  carProfile.models[Math.floor(Math.random() * carProfile.models.length)]

    // car registration
    const carRegistrationNumber = faker.vehicle.vrm();

    // car plate
    const plateNumber = "AC - " + carRegistrationNumber.slice(2).replace(/^(.{2})/, '$1 ')



    // #########################################################################################################################################################################################################



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
        brandName,
        brandModel
    }

    // conditionally rendered
    if (drunk) {
        profileInformation.alcoholLevel = (Math.random() * 0.15 + 0.05).toFixed(2) // range of 0.05 - 0.20
    }

    return profileInformation
}