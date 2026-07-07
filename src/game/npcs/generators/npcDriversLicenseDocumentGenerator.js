import { generateDriversLicenseData } from "@game/documents/generators/generateDriversLicenseData.js";

// ##### Drivers License Document Generator
// -----> Erstellt einen separaten Dokument-Record für die fake database.
// ---> Dieser Record wird über npcId mit dem NPC verknüpft.
export function generateNpcDriversLicenseDocument(npcProfile) {
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
