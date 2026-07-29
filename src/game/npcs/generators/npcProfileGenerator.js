import { generateDriversLicenseData } from "@game/documents/generators/generateDriversLicenseData.js";

import { generateNpcMasterData } from "./npcMasterDataGenerator.js";
import { generateNpcAppearance } from "./generateNpcAppearance.js";
import { selectNpcPhoto } from "./selectNpcPhoto.js";

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
    const npcAppearance = generateNpcAppearance(npcMasterData.sex, ageRange);

    if (npcMasterData) {
        // NPC Lichtbild
        npcImage = selectNpcPhoto(
            npcMasterData.sex,
            ageRange,
            npcAppearance.hairColor,
            npcAppearance.eyeColor
        );

        if (npcMasterData.age < 18) {
            const real = createRealProfile(npcMasterData, npcAppearance, npcImage);
            return createNpcProfileFromReal(real);
        }
    }

    const driversLicenseData = generateDriversLicenseData(npcMasterData.birthDate);
    const real = createRealProfile(npcMasterData, npcAppearance, npcImage, driversLicenseData);

    return createNpcProfileFromReal(real);
}

// ##### NPC Profile Factory
// -----> Bündelt echte Identität und die unveränderte presented-Ausgangslage.
// ---> Die Traffic-Generatoren können presented danach anhand des documentState gezielt verändern.
export function createNpcProfileFromReal(real) {
    return {
        real,
        presented: {
            ...real,
            driversLicense: real.driversLicense ? { ...real.driversLicense } : null,
            crimeRecordIds: [...real.crimeRecordIds]
        }
    };
}

// ##### Real Profile Factory
// -----> Bündelt Stammdaten und biometrische Daten in der echten Personenidentität.
// ---> crimeRecordIds verweist auf die separaten Straftatdatensätze.
function createRealProfile(npcMasterData, npcAppearance, npcImage, driversLicenseData = null) {
    return {
        npcId: npcMasterData.npcId,
        sex: npcMasterData.sex,
        firstName: npcMasterData.firstName,
        lastName: npcMasterData.lastName,
        address: npcMasterData.address,
        age: npcMasterData.age,
        birthYear: npcMasterData.birthYear,
        birthDate: npcMasterData.birthDate,

        height: npcAppearance.height,
        hairColor: npcAppearance.hairColor,
        eyeColor: npcAppearance.eyeColor,

        npcImage: npcImage,
        driversLicense: driversLicenseData
            ? {
                licenseNumber: driversLicenseData.licenseNumber,
                issueDate: driversLicenseData.issueDate,
                expiryDate: driversLicenseData.expiryDate
            }
            : null,
        crimeRecordIds: []
    }
}
