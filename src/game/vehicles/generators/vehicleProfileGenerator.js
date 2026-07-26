import { generateCarDocumentData } from "@game/documents/generators/generateCarDocumentData.js";

import { getRandomCarProfile } from "../utils";

import { vehicleMasterData } from "./vehicleMasterDataGenerator.js";

// ##### Vehicle Profile Generator
// -----> Erstellt die echten Fahrzeugdaten und eine unveränderte presented-Basis.
// ---> Bewusste Dokumentabweichungen werden später zentral über createPresentedProfiles angewendet.
export const generateVehicleProfile = () => {
    // car brand
    const vehicleData = getRandomCarProfile();

    // car master data
    const carMasterData = vehicleMasterData()

    // car documents data
    const carDocumentData = generateCarDocumentData();

    const real = {
        brand: vehicleData.brand,
        model: vehicleData.model,
        ps: vehicleData.ps,
        weight: vehicleData.weight,
        yearOfConstruction: vehicleData.yearOfConstruction,
        glb: vehicleData.glb,

        carDocumentsData: {
            formattedIssueDate: carDocumentData.formattedIssueDate,
            carRegistrationNumber: carMasterData.carRegistrationNumber,
            plateNumber: carMasterData.plateNumber,
        }
    }
    
    return createVehicleProfile(real);
}

// ##### Vehicle Profile Factory
// -----> Bündelt echte Fahrzeugdaten und die unveränderte presented-Ausgangslage.
// ---> Die Traffic-Generatoren können presented danach anhand des documentState gezielt verändern.
function createVehicleProfile(real) {
    return {
        real,
        presented: {
            ...real,
            carDocumentsData: { ...real.carDocumentsData }
        }
    };
}
