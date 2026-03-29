import { generateMasterData } from "../npc/masterDataGenerator.js";
import { generatePhysicalNpcCharacteristicsGenerator } from "../npc/physicalNpcCharacteristicsGenerator.js";
import { npcPhotoGenerator } from "../npc/npcPhotoGenerator.js";

export function generateNpcProfile () {
    let npcImage;
    // ######## DRIVER INFORMATION ########
    // #####################################

    // NPC Stammdaten
    const npcMasterData = generateMasterData();

    // NPC physische Merkmale
    const physicalNpcCharacteristics = generatePhysicalNpcCharacteristicsGenerator();

    // NPC Lichtbild
    if (npcMasterData) {
        npcImage = npcPhotoGenerator(npcMasterData.sex, npcMasterData.age, physicalNpcCharacteristics.hairColor, physicalNpcCharacteristics.eyeColor);
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
        eyeColor: physicalNpcCharacteristics.eyeColor,
        hairColor: physicalNpcCharacteristics.hairColor,

        npcImage,

        // driverImage,
        // issueDate: getDriverLicenseData.formattedIssueDate,
        // licenseNumber: `${faker.string.alpha({ length: 3, casing: 'upper' })}-${faker.number.int({ min: 10000000, max: 99999999 })}`,
    }

    return { realProfile }
        
}