import { generateNpcMasterData } from "../npc/npcMasterDataGenerator.js";
import { generatePhysicalNpcCharacteristicsGenerator } from "../npc/physicalNpcCharacteristicsGenerator.js";
import { npcPhotoGenerator } from "../npc/npcPhotoGenerator.js";

import { generateDriversLicenseData } from "../documents/generateDriversLicenseData.js";

import { getNpcAgeRange } from "../../getter/getNpcAgeRange.js"

export function generateNpcProfile () {
    let npcImage;
    let driversLicenseData;
    let ageRange;

    // NPC Stammdaten
    const npcMasterData = generateNpcMasterData();
    
    // npcs age range
    ageRange = getNpcAgeRange(npcMasterData.sex, npcMasterData.age);

    // NPC physische Merkmale
    const physicalNpcCharacteristics = generatePhysicalNpcCharacteristicsGenerator(npcMasterData.sex, ageRange);

    if (npcMasterData) {
        // NPC Lichtbild
        npcImage = npcPhotoGenerator(npcMasterData.sex, ageRange, physicalNpcCharacteristics.hairColor, physicalNpcCharacteristics.eyeColor);

        if (npcMasterData.age < 18) return // npc darf noch keinen Führerschein machen

        // drivers license data
        driversLicenseData = generateDriversLicenseData(npcMasterData.birthDate, npcMasterData.birthYear);
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
            licenseNumber: driversLicenseData?.licenseNumber,
            issueDate: driversLicenseData?.issueDate,
            expiryDate: driversLicenseData?.expiryDate
        }
    }

    return { realProfile }
}