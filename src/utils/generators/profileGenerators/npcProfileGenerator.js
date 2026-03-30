import { generateMasterData } from "../npc/masterDataGenerator.js";
import { generatePhysicalNpcCharacteristicsGenerator } from "../npc/physicalNpcCharacteristicsGenerator.js";
import { npcPhotoGenerator } from "../npc/npcPhotoGenerator.js";

import { driversLicenseData } from "../documents/driversLicenseData.js";

export function generateNpcProfile () {
    let npcImage;
    let dlData;

    // NPC Stammdaten
    const npcMasterData = generateMasterData();

    // NPC physische Merkmale
    const physicalNpcCharacteristics = generatePhysicalNpcCharacteristicsGenerator();

    if (npcMasterData) {
        // NPC Lichtbild
        npcImage = npcPhotoGenerator(npcMasterData.sex, npcMasterData.age, physicalNpcCharacteristics.hairColor, physicalNpcCharacteristics.eyeColor);

        // drivers license data
        dlData = driversLicenseData(npcMasterData.birthYear);
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

        driverLicenseData: {
            licenseNumber: dlData.licenseNumber,
            issueDate: dlData.formattedIssueDate,
            expiryDate: dlData.formattedExpiryDate
        }
    }

    return { realProfile }
}