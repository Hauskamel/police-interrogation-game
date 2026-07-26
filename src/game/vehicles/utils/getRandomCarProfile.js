import { carProfiles } from "../data";

import { faker } from "@faker-js/faker";


// ---> Handling car brands
const brands = Object.keys(carProfiles)

export default function getRandomCarProfile () {
    // brand
    const brand = brands[Math.floor(Math.random() * brands.length)];

     // model
    const models = Object.keys(carProfiles[brand]);
    const model = models[Math.floor(Math.random() * models.length)];

    const vehicleBaseProfile = carProfiles[brand][model];

    // PS (horse power)
    const ps = vehicleBaseProfile.ps;

    // weight
    const weight = vehicleBaseProfile.weight;

    // Baujahr
    const yearOfConstruction = vehicleBaseProfile.yearOfConstructionRange[Math.floor(Math.random())];

    // GLB Model Filename
    const glb = vehicleBaseProfile.glb;

    const vehicleData = {
        brand,
        model,
        ps,
        weight,
        yearOfConstruction,
        glb
    }

    return vehicleData
}
