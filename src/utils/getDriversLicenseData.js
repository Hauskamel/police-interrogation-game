import { faker } from "@faker-js/faker";

export function getDriversLicenseData (birthYear, ) {

    // driverslicense date data
    const minIssueYear = birthYear + 18;
    const maxIssueYear = Math.min(minIssueYear + 7, new Date().getFullYear());
    const issueFrom = new Date(`${minIssueYear}-01-01`);
    const issueTo = new Date(`${maxIssueYear}-12-31`);
    const issueDate = faker.date.between({ from: issueFrom, to: issueTo });
    const formattedIssueDate = issueDate.toISOString().split('T')[0];

    return { formattedIssueDate };
    
}