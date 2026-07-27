import { generateDriversLicenseData } from "@game/documents/generators/generateDriversLicenseData.js";

// ##### Drivers License Document Generator
// -----> Erstellt einen separaten Dokument-Record für die fake database.
// ---> Dieser Record wird über npcId mit dem NPC verknüpft.
export function generateNpcDriversLicenseDocument(npcProfile) {
    const realIdentity = npcProfile.real;
    const driversLicenseData = realIdentity.driversLicense ?? generateDriversLicenseData(realIdentity.birthDate, realIdentity.birthYear);

    return {
        type: "driversLicense",
        npcId: realIdentity.npcId,
        profileType: "real",
        firstName: realIdentity.firstName,
        lastName: realIdentity.lastName,
        birthDate: realIdentity.birthDate,
        address: realIdentity.address,
        sex: realIdentity.sex,
        height: realIdentity.height,
        eyeColor: realIdentity.eyeColor,
        npcImage: realIdentity.npcImage,
        licenseNumber: driversLicenseData.licenseNumber,
        issueDate: driversLicenseData.issueDate,
        expiryDate: driversLicenseData.expiryDate
    }
}
