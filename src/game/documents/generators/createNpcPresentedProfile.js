import { faker } from "@faker-js/faker";

import { DOCUMENT_INTEGRITY_TYPES, NPC_DOCUMENT_FORGERY_TYPES } from "../data";

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
        crimeRecordIds: [...(real.crimeRecordIds ?? [])]
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
