import { faker } from "@faker-js/faker";

import { getCurrentGameDate, pickWeightedItem } from "@game/shared";
import {
    HOME_COUNTRY,
    RESIDENCE_PERMIT_THRESHOLD_DAYS,
    TRAVEL_PURPOSES
} from "../data";

const FOREIGN_TRAVEL_OPTIONS = [
    { purpose: TRAVEL_PURPOSES.TRANSIT, weight: 30 },
    { purpose: TRAVEL_PURPOSES.VISIT, weight: 25 },
    { purpose: TRAVEL_PURPOSES.LONG_STAY, weight: 20 },
    { purpose: TRAVEL_PURPOSES.WORK, weight: 25 }
];

const EMPLOYMENT_OPTIONS = [
    { occupation: "Lagermitarbeiter", employer: "Westmark Logistik" },
    { occupation: "Monteur", employer: "Nordwerk Anlagenbau" },
    { occupation: "Koch", employer: "Hotel Stadtkrone" },
    { occupation: "Pflegehelfer", employer: "Klinik am Park" },
    { occupation: "Erntehelfer", employer: "Landgut Hohenfeld" }
];

// ##### Migration Profile Generator
// -----> Leitet Aufenthaltszweck, Aufenthaltsdauer und Dokumentpflichten aus der Herkunft ab.
// ---> Das Profil ist World Truth; sichtbare Antworten und Dokumente werden spaeter daraus erzeugt.
export function generateMigrationProfile({ countryOfOrigin, options = {} }) {
    if (countryOfOrigin === HOME_COUNTRY) {
        return createDomesticProfile();
    }

    const travelPurpose = getForcedTravelPurpose(options)
        ?? options.forcedTravelPurpose
        ?? pickWeightedItem(
            FOREIGN_TRAVEL_OPTIONS,
            () => faker.number.float({ min: 0, max: 1 })
        ).purpose;
    const plannedStayDays = options.forcedStayDurationDays
        ?? generateStayDuration(travelPurpose);
    const requiresWorkPermit = travelPurpose === TRAVEL_PURPOSES.WORK;
    const requiresResidencePermit = requiresWorkPermit
        || plannedStayDays > RESIDENCE_PERMIT_THRESHOLD_DAYS;
    const arrivalDate = addDays(
        getCurrentGameDate(),
        -faker.number.int({ min: 0, max: Math.min(30, plannedStayDays - 1) })
    );
    const departureDate = addDays(arrivalDate, plannedStayDays);
    const employment = requiresWorkPermit
        ? faker.helpers.arrayElement(EMPLOYMENT_OPTIONS)
        : null;

    return {
        status: "foreign_visitor",
        countryOfOrigin,
        travelPurpose,
        plannedStayDays,
        arrivalDate: formatDate(arrivalDate),
        departureDate: formatDate(departureDate),
        requiresResidencePermit,
        requiresWorkPermit,
        localAddress: requiresResidencePermit
            ? faker.location.streetAddress()
            : null,
        employment: employment ? { ...employment } : null
    };
}

// Uebersetzt die beiden Devtool-Checkboxen in einen fachlich passenden Aufenthaltszweck.
// Eine Arbeitserlaubnis setzt dadurch immer auch einen laengeren Aufenthalt voraus.
function getForcedTravelPurpose(options) {
    if (options.forcedRequiresWorkPermit === true) {
        return TRAVEL_PURPOSES.WORK;
    }

    if (options.forcedRequiresResidencePermit === true) {
        return TRAVEL_PURPOSES.LONG_STAY;
    }

    const requirementsWereForced = typeof options.forcedRequiresResidencePermit
        === "boolean"
        || typeof options.forcedRequiresWorkPermit === "boolean";
    if (!requirementsWereForced) return null;

    return faker.helpers.arrayElement([
        TRAVEL_PURPOSES.TRANSIT,
        TRAVEL_PURPOSES.VISIT
    ]);
}

function createDomesticProfile() {
    return {
        status: "domestic",
        countryOfOrigin: HOME_COUNTRY,
        travelPurpose: TRAVEL_PURPOSES.DOMESTIC,
        plannedStayDays: null,
        arrivalDate: null,
        departureDate: null,
        requiresResidencePermit: false,
        requiresWorkPermit: false,
        localAddress: null,
        employment: null
    };
}

function generateStayDuration(travelPurpose) {
    const rangeByPurpose = {
        [TRAVEL_PURPOSES.TRANSIT]: [1, 5],
        [TRAVEL_PURPOSES.VISIT]: [7, 60],
        [TRAVEL_PURPOSES.LONG_STAY]: [120, 365],
        [TRAVEL_PURPOSES.WORK]: [180, 730]
    };
    const [min, max] = rangeByPurpose[travelPurpose];

    return faker.number.int({ min, max });
}

function addDays(date, days) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
}

function formatDate(date) {
    return date.toISOString().split("T")[0];
}
