import { generateNpcMasterData } from "./npcMasterDataGenerator.js";
import { generatePhysicalNpcCharacteristicsGenerator } from "./physicalNpcCharacteristicsGenerator.js";
import { npcPhotoGenerator } from "./npcPhotoGenerator.js";

import { generateDriversLicenseData } from "../../documents/generators/generateDriversLicenseData.js";

import { getNpcAgeRange } from "../utils";

// ##### NPC Profile Generator
// -----> Erstellt die spielinterne Wahrheit über eine Person.
// ---> Dokumente werden separat generiert, aber ein kleiner driversLicense-Snapshot bleibt
// ---> vorerst im Profil, damit bestehende UI-Komponenten weiter funktionieren.
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
            return { realProfile: createRealProfile(npcMasterData, physicalNpcCharacteristics, npcImage) }
        }
    }

    const driversLicenseData = generateDriversLicenseData(npcMasterData.birthDate, npcMasterData.birthYear);
    const realProfile  = createRealProfile(npcMasterData, physicalNpcCharacteristics, npcImage, driversLicenseData);

    return { realProfile }
}

// ##### Real Profile Factory
// -----> Bündelt Stammdaten und biometrische Daten in der echten Personenidentität.
// ---> documentIds und crimeRecordIds sind Foreign-Key-Listen auf die separaten Tabellen.
function createRealProfile (npcMasterData, physicalNpcCharacteristics, npcImage, driversLicenseData = null) {
    return {
        npcUuid: npcMasterData.npcUuid,
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
