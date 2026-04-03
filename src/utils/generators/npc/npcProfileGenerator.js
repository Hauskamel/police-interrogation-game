import { generateNpcMasterData } from "../npc/npcMasterDataGenerator.js";
import { generatePhysicalNpcCharacteristicsGenerator } from "../npc/physicalNpcCharacteristicsGenerator.js";
import { npcPhotoGenerator } from "../npc/npcPhotoGenerator.js";

import { driversLicenseData } from "../documents/driversLicenseData.js";

import { crimeRecordGenerator } from "./crimes/crimeRecordGenerator.js";

export function generateNpcProfile () {
    let npcImage;
    let driversLicense;
    let crimeRecord;

    // NPC Stammdaten
    const npcMasterData = generateNpcMasterData();

    // NPC physische Merkmale
    const physicalNpcCharacteristics = generatePhysicalNpcCharacteristicsGenerator();

    if (npcMasterData) {
        // NPC Lichtbild
        npcImage = npcPhotoGenerator(npcMasterData.sex, npcMasterData.age, physicalNpcCharacteristics.hairColor, physicalNpcCharacteristics.eyeColor);

        // drivers license data
        driversLicense = driversLicenseData(npcMasterData.birthYear);

        // crime records data
        crimeRecord = crimeRecordGenerator();
    }

    const realProfile  = {
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

        driversLicense: {
            licenseNumber: driversLicense.licenseNumber,
            issueDate: driversLicense.formattedIssueDate,
            expiryDate: driversLicense.formattedExpiryDate
        },

        crimeRecord
    }



    console.log(realProfile);
    




    return { realProfile }
}