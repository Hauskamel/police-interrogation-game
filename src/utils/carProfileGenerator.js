// NOTE: THIS ALGORYTHM MIGHT BE ALTERED TO WORK FOR BOTH - DRIVER AND CAR
// NOTE: ----- for testing purposes its only for the car -----


import { carProfiles } from './carProfiles';
import { faker } from "@faker-js/faker";



const carBrands = Object.keys(carProfiles)
function getRandomCarBrand(exclude = null) {
    const carBrand = exclude ? carBrands.filter(brand => brand !== exclude) : carBrands;
    return faker.helpers.arrayElement(carBrand)
}

// chance generator for random choices
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
        plateNumber: "AC - " + carRegistrationNumber.slice(2).replace(/^(.{2})/, '$1 ')
    })
]


const applyRandomManipulations =  (profile) => {
    const chancesOfManipulation = [100, 50, 10, 5];

    do {
        const chance = randomChance(chancesOfManipulation[0])
        chancesOfManipulation.shift() // removes first element of array
    } while (chance <= chancesOfManipulation[0])

}



// this is the actual/original/legitimate profile of the car 
export const generateCarProfile = () => {
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
        carRegistrationNumber,
        plateNumber
    }


    // Generate chance of a manipulated (fake) profile being generated
    let fakeProfile = null;
    if (randomChance(50)) {
        fakeProfile = applyRandomManipulations(realProfile)
    }

    return fakeProfile ?
        { realProfile, fakeProfile } :
        { realProfile }
}
