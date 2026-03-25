import { carBrands } from "../../../data/carBrands.js";
import { faker } from "@faker-js/faker";


// ---> Handling car brands
const brands = Object.keys(carBrands)
function getRandomCarBrand(exclude = null) {
    const carBrand = exclude ? brands.filter(brand => brand !== exclude) : brands;
    return faker.helpers.arrayElement(carBrand);
}


// ---> toManipulate generator for random choices
const randomChance = (percent) => {
    return Math.random() < percent / 100; // returns true or false
}


// ---> array with functions to manipulate the car profile
const manipulations = [
    profile => ({
        ...profile,
        brandName: getRandomCarBrand(profile.brandName)
    }),
    profile => ({
        ...profile,
        brandModel: carBrands[getRandomCarBrand()].models[Math.floor(Math.random() * carBrands[getRandomCarBrand()].models.length)]
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

// -----> generator for the cars profile.
//        This function returns the real car profile and if random chances are < 50% also the fake profile
export const generateCarProfile = (isWanted, noFakeProfile) => {
    // ########## CAR INFORMATION ##########
    // #####################################
    // car brand
    const brandName = getRandomCarBrand();
    const carProfile = carBrands[brandName]
    
    // car model
    const brandModel = carProfile.models[Math.floor(Math.random() * carProfile.models.length)];

    // car registration
    const carRegistrationNumber = faker.vehicle.vrm();

    // car plate
    const plateNumber = "AC - " + carRegistrationNumber.slice(2).replace(/^(.{2})/, '$1 ');

    const realProfile = {
        brandName,
        brandModel,
        plateNumber,
        carRegistrationNumber
    }
    
    return { realProfile }
}