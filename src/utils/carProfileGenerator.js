// NOTE: THIS ALGORYTHM MIGHT BE ALTERED TO WORK FOR BOTH - DRIVER AND CAR
// NOTE: ----- for testing purposes its only for the car -----


import { percent } from 'framer-motion';
import { carProfiles } from './carProfiles';
import { faker } from "@faker-js/faker";



const carBrands = Object.keys(carProfiles)
function getRandomCarBrand(exclude = null) {
    const carBrandFilter = exclude ? carBrands.filter(brand => brand !== exclude) : carBrands;
    const carBrand = faker.helpers.arrayElement(carBrandFilter)
    return carBrand
}

const createFakeProfile = Math.floor(Math.random() * 100) < 80; // 50% chance of creating a fake profile


// this is the actual/original/legitimate profile of the car 
const generateRealProfile = () => {
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

    return {
        brandName,
        brandModel,
        plateNumber,
        carRegistrationNumber,
        plateNumber
    }
}
const realProfile = generateRealProfile();


const manipulateProfile = (profile) => {
    const chancesOfError = [100, 50, 10, 5];

    const manipulations = []

    do {
        const percentage = Math.floor(Math.random() * 100);
        console.log(percentage);

        if (percentage <= chancesOfError[0]) {
            chancesOfError.shift();

            // TODO: Hier dann Logik für Manipulation einfügen

        } else {
            break;
        }
    } while (chancesOfError.length)
    
}


export const identity = () => {
    return realProfile;
}

if (createFakeProfile) {
    manipulateProfile(realProfile);
}