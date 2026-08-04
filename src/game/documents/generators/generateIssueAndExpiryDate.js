import { faker } from "@faker-js/faker";
import { getCurrentGameDate } from "@game/shared";

const LICENSE_VALIDITY_YEARS = 15;
const EXPIRED_LICENSE_CHANCE = 0.08;

// ##### Driver License Dates
// -----> Trennt die erste Fahrerlaubnis vom Ausstellungsdatum des aktuell vorgelegten Dokuments.
// ---> Nur ein kleiner, bewusst gesteuerter Anteil der Dokumente ist bei Spielbeginn abgelaufen.
export function generateIssueAndExpiryDate(birthdate, options = {}) {
    const licensedSince = addYears(new Date(`${birthdate}T00:00:00.000Z`), 18);
    const gameDate = getCurrentGameDate();
    const validIssueThreshold = addDays(addYears(gameDate, -LICENSE_VALIDITY_YEARS), 1);
    const canGenerateExpiredDocument = licensedSince < validIssueThreshold;
    const shouldBeExpired = options.forceExpired
        ?? (canGenerateExpiredDocument && Math.random() < EXPIRED_LICENSE_CHANCE);
    const issueDate = shouldBeExpired
        ? generateExpiredIssueDate({ licensedSince, gameDate })
        : generateValidIssueDate({ licensedSince, gameDate });
    const expiryDate = addYears(issueDate, LICENSE_VALIDITY_YEARS);

    return {
        licensedSince: formatDate(licensedSince),
        formattedIssueDate: formatDate(issueDate),
        formattedExpiryDate: formatDate(expiryDate)
    };
}

// Abgelaufene Karten liegen maximal drei Jahre zurueck und stammen nie aus der Zeit vor der Fahrerlaubnis.
function generateExpiredIssueDate({ licensedSince, gameDate }) {
    const latestIssueDate = addDays(addYears(gameDate, -LICENSE_VALIDITY_YEARS), -1);
    const recentExpiredWindow = addYears(gameDate, -(LICENSE_VALIDITY_YEARS + 3));
    const earliestIssueDate = licensedSince > recentExpiredWindow
        ? licensedSince
        : recentExpiredWindow;

    return faker.date.between({
        from: earliestIssueDate,
        to: latestIssueDate
    });
}

// Eine gueltige Karte wurde innerhalb ihres aktuellen 15-Jahres-Zyklus ausgestellt.
function generateValidIssueDate({ licensedSince, gameDate }) {
    const earliestIssueDate = licensedSince > addYears(gameDate, -14)
        ? licensedSince
        : addYears(gameDate, -14);

    return faker.date.between({
        from: earliestIssueDate,
        to: gameDate
    });
}

function addYears(date, years) {
    const result = new Date(date);
    result.setUTCFullYear(result.getUTCFullYear() + years);
    return result;
}

function addDays(date, days) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
}

function formatDate(date) {
    return date.toISOString().split("T")[0];
}
