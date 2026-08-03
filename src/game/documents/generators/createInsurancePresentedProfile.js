import { faker } from "@faker-js/faker";

import {
    DOCUMENT_INTEGRITY_TYPES,
    INSURANCE_DOCUMENT_FORGERY_TYPES
} from "../data";

// ##### Presented Insurance Generator
// -----> Kopiert die echte Police und manipuliert nur das vom NPC vorgezeigte Dokument.
export function createInsurancePresentedProfile(real, documentState) {
    const presentedProfile = { ...real };
    const insuranceState = documentState?.vehicleDocuments?.insurance;

    if (insuranceState?.integrity !== DOCUMENT_INTEGRITY_TYPES.FORGED) {
        return presentedProfile;
    }

    if (insuranceState.forgeryType === INSURANCE_DOCUMENT_FORGERY_TYPES.WRONG_POLICY_NUMBER) {
        return {
            ...presentedProfile,
            policyNumber: `POL-${faker.string.alphanumeric({ length: 10, casing: "upper" })}`
        };
    }

    if (insuranceState.forgeryType === INSURANCE_DOCUMENT_FORGERY_TYPES.WRONG_INSURED_PLATE) {
        return {
            ...presentedProfile,
            insuredPlateNumber: `AC - ${faker.string.alpha({ length: 2, casing: "upper" })} ${faker.number.int({ min: 1000, max: 9999 })}`
        };
    }

    return presentedProfile;
}
