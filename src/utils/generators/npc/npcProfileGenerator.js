import { generateNpcMasterData } from "../npc/npcMasterDataGenerator.js";
import { generatePhysicalNpcCharacteristicsGenerator } from "../npc/physicalNpcCharacteristicsGenerator.js";
import { npcPhotoGenerator } from "../npc/npcPhotoGenerator.js";

import { generateDriversLicenseData } from "../../../game/documents/generators/generateDriversLicenseData.js";

import { getNpcAgeRange } from "../../getter/getNpcAgeRange.js"

// ##### NPC Profile Generator
// -----> Erstellt die spielinterne Wahrheit über eine Person.
// ---> Dokumente werden separat generiert, aber ein kleiner driversLicense-Snapshot bleibt
// ---> vorerst im Profil, damit bestehende UI-Komponenten weiter funktionieren.
export function generateNpcProfile (options = {}) {
    const { minimumAge = 16 } = options; // speichert Mindestalter in eine Variable, um die while-Schleife zu steuern
    console.log(minimumAge);
    
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

// ##### Drivers License Document Generator
// -----> Erstellt einen separaten Dokument-Record für die fake database.
// ---> Dieser Record wird über npcId mit dem NPC verknüpft.
export function generateNpcDriversLicenseDocument (npcProfile) {
    const realProfile = npcProfile.realProfile;
    const driversLicenseData = realProfile.driversLicense ?? generateDriversLicenseData(realProfile.birthDate, realProfile.birthYear);

    return {
        type: "driversLicense",
        npcId: realProfile.npcUuid,
        profileType: "realProfile",
        firstName: realProfile.firstName,
        lastName: realProfile.lastName,
        birthDate: realProfile.birthDate,
        address: realProfile.address,
        sex: realProfile.sex,
        height: realProfile.height,
        eyeColor: realProfile.eyeColor,
        npcImage: realProfile.npcImage,
        licenseNumber: driversLicenseData.licenseNumber,
        issueDate: driversLicenseData.issueDate,
        expiryDate: driversLicenseData.expiryDate
    }
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
