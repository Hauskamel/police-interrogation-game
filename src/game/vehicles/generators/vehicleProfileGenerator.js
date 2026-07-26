import { generateCarDocumentData } from "@game/documents/generators/generateCarDocumentData.js";

import { getRandomCarProfile } from "../utils";

import { vehicleMasterData } from "./vehicleMasterDataGenerator.js";

// ##### Vehicle Profile Generator
// -----> Erstellt die echten und aktuell vorgezeigten Fahrzeugdaten.
// ---> real ist die Spielwahrheit, presented ist das, was Fahrzeugdokumente anzeigen.
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
// -----> Bündelt echte Fahrzeugdaten und aktuell vorgezeigte Fahrzeugdaten.
// TODO: presented ist aktuell immer identisch mit real, weil noch keine gefälschten Fahrzeugdokumente generiert werden.
// ---> Später werden hier manipulierte Kennzeichen, Halterdaten oder Fahrzeugpapiere eingehängt.
function createVehicleProfile(real) {
    return {
        real,
        presented: {
            ...real,
            carDocumentsData: { ...real.carDocumentsData }
        }
    };
}
