import { faker } from "@faker-js/faker";


export function carDocumentData () {
     // issue date
    const minIssueYear = 1950;
    const maxIssueYear = Math.min(minIssueYear + 21, new Date().getFullYear());
    const issueFrom = new Date(`${minIssueYear}-01-01`);
    const issueTo = new Date(`${maxIssueYear}-12-31`);
    const issueDate = faker.date.between({ from: issueFrom, to: issueTo });
    const formattedIssueDate = issueDate.toISOString().split('T')[0];

    const data = {
        formattedIssueDate,
    }

    return data;
}