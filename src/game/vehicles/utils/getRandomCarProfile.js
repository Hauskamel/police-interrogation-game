import { carProfiles } from "../data";

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
    // -----> Die beiden Werte beschreiben eine inklusive Spanne, nicht zwei einzelne Baujahre.
    const [minimumConstructionYear, maximumConstructionYear] =
        vehicleBaseProfile.yearOfConstructionRange;
    const yearOfConstruction = Math.floor(
        Math.random() * (maximumConstructionYear - minimumConstructionYear + 1)
    ) + minimumConstructionYear;

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
