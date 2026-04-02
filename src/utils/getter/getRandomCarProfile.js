import { carProfiles } from "../../data/carProfiles";

import { faker } from "@faker-js/faker";


// ---> Handling car brands
const brands = Object.keys(carProfiles)

export default function getRandomCarProfile () {
    // brand
    const brand = brands[Math.floor(Math.random() * brands.length)];

     // model
    const models = Object.keys(carProfiles[brand]);
    const model = models[Math.floor(Math.random() * models.length)];


    const carProfile = carProfiles[brand][model]

    // PS (horse power)
    const ps = carProfile.ps;

    // weight
    const weight = carProfile.weight;

    // Baujahr
    const yearOfConstruction = carProfile.yearOfConstructionRange[Math.floor(Math.random())];

    // GLB Model Filename
    const glb = carProfile.glb;

    const realProfile = {
        brand,
        model,
        ps,
        weight,
        yearOfConstruction,
        glb
    }

    return  realProfile
}