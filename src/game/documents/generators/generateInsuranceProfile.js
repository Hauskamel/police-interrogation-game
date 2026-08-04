import { faker } from "@faker-js/faker";

import { createEntityId, getCurrentGameDate } from "@game/shared";

const INSURANCE_PROVIDERS = [
    "Aachen Direkt",
    "Nordstern Versicherung",
    "Rheinland Mobil",
    "Westmark Versicherung"
];
const EXPIRED_INSURANCE_CHANCE = 0.05;

// ##### Insurance Profile Generator
// -----> Erstellt eine eigenstaendige Versicherungspolice fuer genau ein Fahrzeug.
// ---> Die Police referenziert Halter und Fahrzeug per ID und wird spaeter amtlich registriert.
export function generateInsuranceProfile({
    vehicleId,
    policyHolderNpcId,
    insuredPlateNumber,
    forceExpired
}) {
    const gameDate = getCurrentGameDate();
    const shouldBeExpired = forceExpired
        ?? Math.random() < EXPIRED_INSURANCE_CHANCE;
    const validUntil = shouldBeExpired
        ? faker.date.between({
            from: addDays(gameDate, -180),
            to: addDays(gameDate, -1)
        })
        : faker.date.between({
            from: addDays(gameDate, 30),
            to: addDays(gameDate, 365)
        });
    const validFrom = addYears(validUntil, -1);
    const real = {
        policyId: createEntityId("insurance"),
        policyNumber: `POL-${faker.string.alphanumeric({ length: 10, casing: "upper" })}`,
        provider: faker.helpers.arrayElement(INSURANCE_PROVIDERS),
        policyHolderNpcId,
        vehicleId,
        insuredPlateNumber,
        validFrom: formatDate(validFrom),
        validUntil: formatDate(validUntil),
        status: shouldBeExpired ? "expired" : "active"
    };

    return {
        real,
        presented: { ...real }
    };
}

function addDays(date, days) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
}

function addYears(date, years) {
    const result = new Date(date);
    result.setUTCFullYear(result.getUTCFullYear() + years);
    return result;
}

function formatDate(date) {
    return date.toISOString().split("T")[0];
}
