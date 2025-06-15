import { carProfiles } from './carProfiles';
import { faker } from "@faker-js/faker";

const carBrands = Object.keys(carProfiles)
function getRandomCarBrand(exclude = null) {
    const carBrandFilter = exclude ? carBrands.filter(brand => brand !== exclude) : carBrands;
    const carBrand = faker.helpers.arrayElement(carBrandFilter)
    return carBrand
}


export function generateCarProfile () {
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



    const profile = {
        plateNumber,
        brandName,
        brandModel
    }

    return profile;

    
}