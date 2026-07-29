import { faker } from "@faker-js/faker";

// ##### Car Document Data Generator
// -----> Erstellt zeitabhängige Angaben für den Fahrzeugschein.
// ---> Das Ausstellungsdatum kann frühestens im Baujahr des Fahrzeugs liegen.
export function generateVehicleRegistrationDocument({ yearOfConstruction } = {}) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const validConstructionYear = Number.isInteger(yearOfConstruction)
        ? Math.min(yearOfConstruction, currentYear)
        : currentYear;
    const issueFrom = new Date(Date.UTC(validConstructionYear, 0, 1));
    const issueTo = currentDate;
    const issueDate = faker.date.between({ from: issueFrom, to: issueTo });

    return {
        formattedIssueDate: issueDate.toISOString().split("T")[0]
    };
}
