import { faker } from "@faker-js/faker";

import { generateIssueAndExpiryDate } from "./generateIssueAndExpiryDate";

export function generateDriversLicenseData (birthdate) {
    // license number of npcs drivers license
    const licenseNumber = `${faker.string.alpha({ length: 3, casing: 'upper' })}-${faker.number.int({ min: 10000000, max: 99999999 })}`;

    // the Issuedate can reach from the npcs 18th birthday up to today.
    // the driverslicense is valid for 15 years from the issue date
    const documentDates = generateIssueAndExpiryDate(birthdate);
    

    // TODO: IN Zukunft noch einfügbar:
    // - Ausstellungsstaat
    // - Ausstellungsbehörde
    

    const data = {
        licenseNumber,
        issueDate: documentDates.formattedIssueDate,
        expiryDate: documentDates.formattedExpiryDate
    }
    return data;
}
