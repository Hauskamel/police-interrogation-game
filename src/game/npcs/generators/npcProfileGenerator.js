import { generateDriversLicenseData } from "@game/documents/generators/generateDriversLicenseData.js";
import { generateImmigrationDocuments } from "@game/documents/generators/generateImmigrationDocuments.js";

import { generateNpcMasterData } from "./npcMasterDataGenerator.js";
import { generateNpcAppearance } from "./generateNpcAppearance.js";
import { selectNpcPhoto } from "./selectNpcPhoto.js";
import { generateMigrationProfile } from "./generateMigrationProfile.js";

import { getNpcAgeRange } from "../utils";
import { NPC_PHOTO_METADATA } from "../data";

// ##### NPC Profile Generator
// -----> Erstellt die echte Identität und eine unveränderte presented-Basis einer Person.
// ---> Bewusste Dokumentabweichungen werden später zentral über createPresentedProfiles angewendet.
export function generateNpcProfile (options = {}) {
    const { minimumAge = 16 } = options;

    // NPC Stammdaten
    let npcMasterData = generateNpcMasterData(options);

    while (npcMasterData.age < minimumAge) {
        npcMasterData = generateNpcMasterData(options);
    }
    
    // npcs age range
    const ageRange = getNpcAgeRange(npcMasterData.sex, npcMasterData.age);

    // NPC physische Merkmale
    const npcAppearance = generateNpcAppearance(npcMasterData.sex, ageRange);

    // Das Lichtbild folgt Alter und Aussehen, damit Dokumentfoto und Person konsistent bleiben.
    const npcImage = selectNpcPhoto(
        npcMasterData.sex,
        ageRange,
        npcAppearance.hairColor,
        npcAppearance.eyeColor
    );

    // Minderjaehrige erhalten kein Fuehrerscheindokument, behalten aber dasselbe Personenmodell.
    const driversLicenseData = npcMasterData.age >= 18
        ? generateDriversLicenseData(npcMasterData.birthDate, {
            forceExpired: options.forcedLicenseExpired,
            issuingCountry: npcMasterData.countryOfOrigin
        })
        : null;
    const migrationProfile = generateMigrationProfile({
        countryOfOrigin: npcMasterData.countryOfOrigin,
        options
    });
    const immigrationDocuments = generateImmigrationDocuments({
        npcId: npcMasterData.npcId,
        migrationProfile
    });
    const real = createRealProfile({
        npcMasterData,
        npcAppearance,
        npcImage,
        driversLicenseData,
        migrationProfile,
        immigrationDocuments
    });

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
            ...(real.migrationProfile
                ? { migrationProfile: cloneMigrationProfile(real.migrationProfile) }
                : {}
            ),
            ...(Object.hasOwn(real, "residencePermit")
                ? {
                    residencePermit: real.residencePermit
                        ? { ...real.residencePermit }
                        : null
                }
                : {}
            ),
            ...(Object.hasOwn(real, "workPermit")
                ? { workPermit: real.workPermit ? { ...real.workPermit } : null }
                : {}
            ),
            crimeRecordIds: [...real.crimeRecordIds],
            distinguishingMarks: [...(real.distinguishingMarks ?? [])]
        }
    };
}

// ##### Real Profile Factory
// -----> Bündelt Stammdaten und biometrische Daten in der echten Personenidentität.
// ---> crimeRecordIds verweist auf die separaten Straftatdatensätze.
function createRealProfile({
    npcMasterData,
    npcAppearance,
    npcImage,
    driversLicenseData = null,
    migrationProfile,
    immigrationDocuments
}) {
    const photoMetadata = NPC_PHOTO_METADATA[npcImage];

    return {
        npcId: npcMasterData.npcId,
        sex: npcMasterData.sex,
        firstName: npcMasterData.firstName,
        lastName: npcMasterData.lastName,
        address: npcMasterData.address,
        age: npcMasterData.age,
        birthYear: npcMasterData.birthYear,
        birthDate: npcMasterData.birthDate,
        countryOfOrigin: npcMasterData.countryOfOrigin,
        migrationProfile,

        height: npcAppearance.height,
        hairColor: npcAppearance.hairColor,
        eyeColor: npcAppearance.eyeColor,
        distinguishingMarks: [...(photoMetadata?.distinguishingMarks ?? [])],

        npcImage: npcImage,
        driversLicense: driversLicenseData
            ? {
                licenseNumber: driversLicenseData.licenseNumber,
                licensedSince: driversLicenseData.licensedSince,
                issueDate: driversLicenseData.issueDate,
                expiryDate: driversLicenseData.expiryDate,
                issuingCountry: driversLicenseData.issuingCountry
            }
            : null,
        residencePermit: immigrationDocuments.residencePermit,
        workPermit: immigrationDocuments.workPermit,
        crimeRecordIds: []
    };
}

function cloneMigrationProfile(migrationProfile) {
    if (!migrationProfile) return null;

    return {
        ...migrationProfile,
        employment: migrationProfile?.employment
            ? { ...migrationProfile.employment }
            : null
    };
}
