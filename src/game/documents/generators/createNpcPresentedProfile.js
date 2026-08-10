import { faker } from "@faker-js/faker";

import { DOCUMENT_INTEGRITY_TYPES, NPC_DOCUMENT_FORGERY_TYPES } from "../data";
import { NPC_PHOTO_CATALOG } from "@game/npcs/data";

// ##### NPC Presented Profile Generator
// -----> Erstellt die vorgezeigten Personendaten aus der echten Identität.
// ---> Wenn documentState eine Fälschung beschreibt, werden nur die betroffenen Felder verändert.
export function createNpcPresentedProfile(real, documentState) {
    const presentedProfile = cloneNpcProfile(real);
    const driversLicenseState = documentState?.npcDocuments?.driversLicense;

    if (driversLicenseState?.integrity !== DOCUMENT_INTEGRITY_TYPES.FORGED) {
        return presentedProfile;
    }

    return applyNpcDocumentForgery(presentedProfile, driversLicenseState.forgeryType);
}

// ##### NPC Profile Clone
// -----> Kopiert die verschachtelten Felder, die von Dokumentfälschungen verändert werden dürfen.
// ---> real bleibt dadurch unverändert und dient weiterhin als Spielwahrheit.
function cloneNpcProfile(real) {
    return {
        ...real,
        driversLicense: real.driversLicense ? { ...real.driversLicense } : null,
        ...(real.migrationProfile
            ? { migrationProfile: {
                ...real.migrationProfile,
                employment: real.migrationProfile.employment
                    ? { ...real.migrationProfile.employment }
                    : null
            } }
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
        crimeRecordIds: [...(real.crimeRecordIds ?? [])],
        distinguishingMarks: [...(real.distinguishingMarks ?? [])]
    };
}

// ##### NPC Forgery Applier
// -----> Verändert gezielt ein sichtbares Personenfeld passend zum gewählten Fälschungstyp.
// ---> Diese Funktion wird nur auf presented angewendet, niemals auf real.
function applyNpcDocumentForgery(presentedProfile, forgeryType) {
    if (forgeryType === NPC_DOCUMENT_FORGERY_TYPES.WRONG_ADDRESS) {
        return {
            ...presentedProfile,
            address: faker.location.streetAddress()
        };
    }

    if (forgeryType === NPC_DOCUMENT_FORGERY_TYPES.WRONG_BIRTH_DATE) {
        const forgedBirthDate = shiftBirthDateByOneYear(presentedProfile.birthDate);

        return {
            ...presentedProfile,
            birthDate: forgedBirthDate,
            birthYear: forgedBirthDate.split("-")[0],
            age: Math.max(16, presentedProfile.age + 1)
        };
    }

    if (forgeryType === NPC_DOCUMENT_FORGERY_TYPES.WRONG_LICENSE_NUMBER) {
        return {
            ...presentedProfile,
            driversLicense: {
                ...presentedProfile.driversLicense,
                licenseNumber: `${faker.string.alpha({ length: 3, casing: "upper" })}-${faker.number.int({ min: 10000000, max: 99999999 })}`
            }
        };
    }

    if (forgeryType === NPC_DOCUMENT_FORGERY_TYPES.WRONG_NAME) {
        return {
            ...presentedProfile,
            firstName: faker.person.firstName("male"),
            lastName: faker.person.lastName()
        };
    }

    if (forgeryType === NPC_DOCUMENT_FORGERY_TYPES.WRONG_EYE_COLOR) {
        const alternateEyeColors = ["blue", "green", "brown"].filter(
            (eyeColor) => eyeColor !== presentedProfile.eyeColor
        );

        return {
            ...presentedProfile,
            eyeColor: alternateEyeColors[0]
        };
    }

    if (forgeryType === NPC_DOCUMENT_FORGERY_TYPES.WRONG_PHOTO) {
        const replacementPhoto = Object.values(NPC_PHOTO_CATALOG).find(
            (photo) => photo.fileName !== presentedProfile.npcImage
                && (
                    photo.eyeColor !== presentedProfile.eyeColor
                    || photo.hairColor !== presentedProfile.hairColor
                    || photo.distinguishingMarks.join("|")
                        !== presentedProfile.distinguishingMarks.join("|")
                )
        );

        return {
            ...presentedProfile,
            npcImage: replacementPhoto?.fileName ?? presentedProfile.npcImage
        };
    }

    return presentedProfile;
}

// ##### Birth Date Shifter
// -----> Erzeugt eine kleine, aber überprüfbare Abweichung im Geburtsdatum.
// ---> Ein Jahr Unterschied ist für Datenbankabgleiche sichtbar, wirkt aber nicht cartoonhaft falsch.
function shiftBirthDateByOneYear(birthDate) {
    const date = new Date(birthDate);
    date.setFullYear(date.getFullYear() - 1);

    return date.toISOString().split("T")[0];
}
