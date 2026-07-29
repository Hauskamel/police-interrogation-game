import {
    generateVehicleRegistrationDocument
} from "@game/documents/generators/generateVehicleRegistrationDocument.js";

import { getRandomCarProfile } from "../utils";

import { generateVehicleRegistrationData } from "./generateVehicleRegistrationData.js";

// ##### Vehicle Profile Generator
// -----> Erstellt die echten Fahrzeugdaten und eine unveränderte presented-Basis.
// ---> Bewusste Dokumentabweichungen werden später zentral über createPresentedProfiles angewendet.
export const generateVehicleProfile = (options = {}) => {
    // car brand
    const vehicleData = getRandomCarProfile();

    // car master data
    const vehicleRegistrationData = generateVehicleRegistrationData();

    // car documents data
    const vehicleRegistrationDocument = generateVehicleRegistrationDocument({
        yearOfConstruction: vehicleData.yearOfConstruction
    });

    const real = {
        brand: vehicleData.brand,
        model: vehicleData.model,
        ps: vehicleData.ps,
        weight: vehicleData.weight,
        yearOfConstruction: vehicleData.yearOfConstruction,
        glb: vehicleData.glb,
        registeredOwnerNpcId: options.registeredOwnerNpcId ?? null,

        carDocumentsData: {
            formattedIssueDate: vehicleRegistrationDocument.formattedIssueDate,
            carRegistrationNumber: vehicleRegistrationData.carRegistrationNumber,
            plateNumber: vehicleRegistrationData.plateNumber,
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
