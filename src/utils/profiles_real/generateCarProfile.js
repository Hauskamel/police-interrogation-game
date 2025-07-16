import { generateFakeCarProfile } from '../profiles_fake/generateFakeCarProfile';
import { carProfiles } from '../carProfiles';
import { faker } from "@faker-js/faker";

const carBrands = Object.keys(carProfiles)
function getRandomCarBrand(exclude = null) {
    const carBrandFilter = exclude ? carBrands.filter(brand => brand !== exclude) : carBrands;
    const carBrand = faker.helpers.arrayElement(carBrandFilter)
    return carBrand
}


export function generateCarProfile () {


    const currentYear = new Date().getFullYear();


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

    // VIN (Fahrzeugidentifikationsnummer)
    const vin = faker.vehicle.vin()



    // ########### CAR INSURANCE ###########
    // #####################################
    const insuranceValidFrom = faker.date
        .between({
            from: `${currentYear}-01-01`,
            to: `${currentYear}-12-31`
        })
        .toISOString()
    const insuranceValidTo = faker.date
        .between({
            from: `${currentYear + 10}-01-01`,
            to: `${currentYear + 10}-12-31`
        })
        .toISOString()




    const profile = {
        plateNumber,
        brandName,
        brandModel,
        vin,
        insuranceValidFrom,
        insuranceValidTo
    }


    generateFakeCarProfile(profile)


    return profile;

    
}