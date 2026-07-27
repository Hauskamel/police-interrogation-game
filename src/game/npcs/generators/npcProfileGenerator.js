import { generateNpcMasterData } from "./npcMasterDataGenerator.js";
import { generatePhysicalNpcCharacteristicsGenerator } from "./physicalNpcCharacteristicsGenerator.js";
import { npcPhotoGenerator } from "./npcPhotoGenerator.js";

import { generateDriversLicenseData } from "@game/documents/generators/generateDriversLicenseData.js";

import { getNpcAgeRange } from "../utils";

// ##### NPC Profile Generator
// -----> Erstellt die echte Identität und eine unveränderte presented-Basis einer Person.
// ---> Bewusste Dokumentabweichungen werden später zentral über createPresentedProfiles angewendet.
export function generateNpcProfile (options = {}) {
    const { minimumAge = 16 } = options; // speichert Mindestalter in eine Variable, um die while-Schleife zu steuern
    
    let npcImage;
    let ageRange;

    // NPC Stammdaten
    let npcMasterData = generateNpcMasterData();

    while (npcMasterData.age < minimumAge) {
        npcMasterData = generateNpcMasterData();
    }
    
    // npcs age range
    ageRange = getNpcAgeRange(npcMasterData.sex, npcMasterData.age);

    // NPC physische Merkmale
    const physicalNpcCharacteristics = generatePhysicalNpcCharacteristicsGenerator(npcMasterData.sex, ageRange);

    if (npcMasterData) {
        // NPC Lichtbild
        npcImage = npcPhotoGenerator(npcMasterData.sex, ageRange, physicalNpcCharacteristics.hairColor, physicalNpcCharacteristics.eyeColor);

        if (npcMasterData.age < 18) {
            const real = createRealProfile(npcMasterData, physicalNpcCharacteristics, npcImage);
            return createNpcProfile(real);
        }
    }

    const driversLicenseData = generateDriversLicenseData(npcMasterData.birthDate);
    const real = createRealProfile(npcMasterData, physicalNpcCharacteristics, npcImage, driversLicenseData);

    return createNpcProfile(real);
}

// ##### NPC Profile Factory
// -----> Bündelt echte Identität und die unveränderte presented-Ausgangslage.
// ---> Die Traffic-Generatoren können presented danach anhand des documentState gezielt verändern.
function createNpcProfile(real) {
    return {
        real,
        presented: {
            ...real,
            driversLicense: real.driversLicense ? { ...real.driversLicense } : null,
            documentIds: [...real.documentIds],
            crimeRecordIds: [...real.crimeRecordIds]
        }
    };
}

// ##### Real Profile Factory
// -----> Bündelt Stammdaten und biometrische Daten in der echten Personenidentität.
// ---> documentIds und crimeRecordIds sind Foreign-Key-Listen auf die separaten Tabellen.
function createRealProfile (npcMasterData, physicalNpcCharacteristics, npcImage, driversLicenseData = null) {
    return {
        npcId: npcMasterData.npcId,
        sex: npcMasterData.sex,
        firstName: npcMasterData.firstName,
        lastName: npcMasterData.lastName,
        address: npcMasterData.address,
        age: npcMasterData.age,
        birthYear: npcMasterData.birthYear,
        birthDate: npcMasterData.birthDate,

        height: physicalNpcCharacteristics.height,
        hairColor: physicalNpcCharacteristics.hairColor,
        eyeColor: physicalNpcCharacteristics.eyeColor,

        npcImage: npcImage,
        driversLicense: driversLicenseData
            ? {
                licenseNumber: driversLicenseData.licenseNumber,
                issueDate: driversLicenseData.issueDate,
                expiryDate: driversLicenseData.expiryDate
            }
            : null,
        documentIds: [],
        crimeRecordIds: []
    }
}
