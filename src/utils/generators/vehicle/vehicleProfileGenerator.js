import { generateCarDocumentData } from "../../../game/documents/generators/generateCarDocumentData.js";

import getRandomCarProfile from "../../getter/getRandomCarProfile.js";

import { vehicleMasterData } from "./vehicleMasterDataGenerator.js";



// -----> generator for the cars profile.
//        This function returns the real car profile and if random chances are < 50% also the fake profile
export const generateVehicleProfile = () => {
    // car brand
    const carProfile = getRandomCarProfile();

    // car master data
    const carMasterData = vehicleMasterData()

    // car documents data
    const carDocumentData = generateCarDocumentData();

    const realProfile = {
        brand: carProfile.brand,
        model: carProfile.model,
        ps: carProfile.ps,
        weight: carProfile.weight,
        yearOfConstruction: carProfile.yearOfConstruction,
        glb: carProfile.glb,

        carDocumentsData: {
            formattedIssueDate: carDocumentData.formattedIssueDate,
            carRegistrationNumber: carMasterData.carRegistrationNumber,
            plateNumber: carMasterData.plateNumber,
        }
    }
    
    return { realProfile }
}
