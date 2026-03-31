import { faker } from "@faker-js/faker";

export function driversLicenseData (birthYear) {
    // license number of npcs drivers license
    const licenseNumber = `${faker.string.alpha({ length: 3, casing: 'upper' })}-${faker.number.int({ min: 10000000, max: 99999999 })}`;

    // driverslicense date data
    const minIssueYear = birthYear + 18;
    const maxIssueYear = Math.min(minIssueYear + 21, new Date().getFullYear());

    const issueFrom = new Date(`${minIssueYear}-01-01`);
    const issueTo = new Date(`${maxIssueYear}-12-31`);

    const issueDate = faker.date.between({ from: issueFrom, to: issueTo });
    const formattedIssueDate = issueDate.toISOString().split('T')[0];

    const expiryDate = faker.date.between({ from: issueDate, to: new Date(`${maxIssueYear}-12-31`)});
    const formattedExpiryDate = expiryDate.toISOString().split('T')[0];

    // TODO: IN Zukunft noch einfügbar:
    // - Ausstellungsstaat
    // - Ausstellungsbehörde

    
    const data = {
        licenseNumber,
        formattedIssueDate,
        formattedExpiryDate
    }
    return data;
}