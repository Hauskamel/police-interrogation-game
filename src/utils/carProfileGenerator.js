// NOTE: THIS ALGORYTHM MIGHT BE ALTERED TO WORK FOR BOTH - DRIVER AND CAR
// NOTE: ----- for testing purposes its only for the car -----


import { carProfiles } from './carProfiles';
import { faker } from "@faker-js/faker";


// ---> Handling car brands
const carBrands = Object.keys(carProfiles)
function getRandomCarBrand(exclude = null) {
    const carBrand = exclude ? carBrands.filter(brand => brand !== exclude) : carBrands;
    return faker.helpers.arrayElement(carBrand)
}


// ---> toManipulate generator for random choices
const randomChance = (percent) => {
    return Math.random() < percent / 100
}


const manipulations = [
    profile => ({
        ...profile,
        brandName: getRandomCarBrand(profile.brandName)
    }),
    profile => ({
        ...profile,
        brandModel: carProfile.models[Math.floor(Math.random() * carProfile.models.length)]
    }),
    profile => ({
        ...profile,
        carRegistrationNumber: faker.vehicle.vrm()
    }),
    profile => ({
        ...profile,
        plateNumber: "AC - " + faker.vehicle.vrm().slice(2).replace(/^(.{2})/, '$1 ')
    })
]



// ---> applies manipulation(s) to the passed profile
const applyRandomManipulations = (profile) => {
    const chancesOfManipulation = [100, 50, 10, 5]; // 1 manipulation min. and 4 manipulations max.

    let toManipulate;
    do {
        toManipulate = randomChance(chancesOfManipulation[0]) // takes current max chance of manipulation --> returns true or false    
        if (!toManipulate) return;

        chancesOfManipulation.shift() // removes current max toManipulate
        
        const randomIndex = Math.floor(Math.random() * manipulations.length);
        const manipulation = manipulations[randomIndex];
        return manipulation(profile)

    } while (toManipulate)
}



// -----> generator for the cars profile.
//        This function returns the real car profile and if random chances are < 50% also the fake profile
export const generateCarProfile = (isForWantedList) => {
    // ########## CAR INFORMATION ##########
    // #####################################
    // car brand
    const brandName = getRandomCarBrand();
    const carProfile = carProfiles[brandName]
    
    // car model
    const brandModel = carProfile.models[Math.floor(Math.random() * carProfile.models.length)]

    // car registration
    const carRegistrationNumber = faker.vehicle.vrm();

    // car plate
    const plateNumber = "AC - " + carRegistrationNumber.slice(2).replace(/^(.{2})/, '$1 ')

    const realProfile = {
        brandName,
        brandModel,
        plateNumber,
        carRegistrationNumber
    }

    if (isForWantedList) return realProfile; // wanted list profiles need to match the original identity --> only true if profile is generated for wanted List

    // Generate toManipulate of a manipulated (fake) profile being generated
    let fakeProfile = null;
    if (randomChance(50)) {
        fakeProfile = applyRandomManipulations(realProfile)
    }

    return fakeProfile ?
        { realProfile, fakeProfile } :
        { realProfile }

    // return realProfile
}
