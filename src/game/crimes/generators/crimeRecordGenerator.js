import { faker } from "@faker-js/faker";

import { createEntityId } from "@game/shared";
import { crimeTypes } from "../data";

// ##### Crime Metadata
// -----> Übersetzt technische crimeTypes in grobe Kategorien für Suche, UI und Balancing.
const crimeSeverityByType = {
    murder: "violent",
    manslaughter: "violent",
    assault: "violent",
    robbery: "violent",
    armed_robbery: "violent",
    burglary: "property",
    theft: "property",
    pickpocketing: "property",
    fraud: "financial",
    identity_theft: "financial",
    embezzlement: "financial",
    extortion: "financial",
    blackmail: "financial",
    kidnapping: "violent",
    human_trafficking: "violent",
    drug_possession: "minor",
    drug_dealing: "drug",
    drug_trafficking: "drug",
    arson: "violent",
    vandalism: "minor",
    cybercrime: "financial",
    hacking: "financial",
    money_laundering: "financial",
    illegal_weapons_possession: "weapon",
    smuggling: "organized",
    tax_evasion: "financial",
    stalking: "violent",
    domestic_violence: "violent",
    public_disorder: "minor"
};

// ##### Crime Distribution
// -----> Häufige Delikte bekommen mehr Gewicht als schwere Ausnahmefälle.
const crimeTypeWeights = [
    { type: "theft", weight: 16 },
    { type: "drug_possession", weight: 14 },
    { type: "vandalism", weight: 10 },
    { type: "public_disorder", weight: 9 },
    { type: "fraud", weight: 8 },
    { type: "burglary", weight: 7 },
    { type: "assault", weight: 7 },
    { type: "pickpocketing", weight: 5 },
    { type: "drug_dealing", weight: 5 },
    { type: "illegal_weapons_possession", weight: 4 },
    { type: "robbery", weight: 3 },
    { type: "cybercrime", weight: 3 },
    { type: "smuggling", weight: 3 },
    { type: "money_laundering", weight: 2 },
    { type: "identity_theft", weight: 2 },
    { type: "arson", weight: 1 },
    { type: "armed_robbery", weight: 1 }
].filter(({ type }) => crimeTypes.includes(type));

// ##### Record Count Distribution
// -----> Die meisten NPCs haben nur einen Eintrag, wenige haben lange Vorstrafenlisten.
const crimeCountWeights = [
    { count: 1, weight: 58 },
    { count: 2, weight: 25 },
    { count: 3, weight: 11 },
    { count: 4, weight: 4 },
    { count: 5, weight: 2 }
];

// ##### Crime Records
// -----> Erstellt 1-x Straftaten für einen NPC.
// ---> Wird beim Aufbau der Criminal Database und für unbekannte Täter im Traffic-System genutzt.
export function generateCrimeRecordsForNpc(npcId, options = {}) {
    // crimeCount kann für Tests oder Story-Fälle explizit überschrieben werden.
    const crimeCount = options.crimeCount ?? getWeightedRandomItem(crimeCountWeights).count;

    // Verhindert doppelte Crime-Types innerhalb desselben NPC-Records.
    const usedCrimeTypes = new Set();

    return Array.from({ length: crimeCount }, () => {
        const crimeType = getUniqueCrimeType(usedCrimeTypes);
        usedCrimeTypes.add(crimeType);

        return {
            id: createEntityId("crime"),
            npcId,
            type: crimeType,
            severity: crimeSeverityByType[crimeType] ?? "unknown",
            title: formatCrimeTitle(crimeType),
            description: generateCrimeDescription(crimeType),
            committedAt: faker.date.past({ years: 8 }).toISOString().split("T")[0],
            status: faker.helpers.arrayElement(["open", "convicted", "under_investigation"])
        };
    });
}

// ##### Unique Crime Type Picker
// -----> Wählt einen Crime-Type, der für diesen NPC noch nicht verwendet wurde.
// ---> Wird pro Crime Record aufgerufen, damit eine Vorstrafenliste abwechslungsreicher wirkt.
function getUniqueCrimeType(usedCrimeTypes) {
    let crimeType = getWeightedRandomItem(crimeTypeWeights).type;
    let attempts = 0;

    // Nach wenigen Versuchen wird ein Duplikat akzeptiert, damit die Generierung nie hängen bleibt.
    while (usedCrimeTypes.has(crimeType) && attempts < 10) {
        crimeType = getWeightedRandomItem(crimeTypeWeights).type;
        attempts++;
    }

    return crimeType;
}

// ##### Weighted Random Helper
// -----> Wählt aus einer gewichteten Liste einen Eintrag aus.
// ---> Wird hier für Crime-Typen und die Anzahl der Crime Records genutzt.
function getWeightedRandomItem(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of items) {
        random -= item.weight;
        if (random <= 0) return item;
    }

    return items[items.length - 1];
}

// ##### Crime Title Formatter
// -----> Wandelt technische Crime-Keys in lesbare Titel um.
// ---> Wird aktuell für Crime Records verwendet und kann später direkt in UI/Police-Laptop auftauchen.
function formatCrimeTitle(type) {
    return type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// ##### Crime Description Generator
// -----> Erstellt eine kurze Beschreibung für einen Crime Record.
// ---> Dient als erster Platzhalter für später ausführlichere Fallakten, Zeugenberichte oder Laptop-Einträge.
function generateCrimeDescription(type) {
    const place = faker.location.city();
    const year = faker.date.past({ years: 8 }).getFullYear();

    return `${formatCrimeTitle(type)} recorded near ${place} in ${year}.`;
}
