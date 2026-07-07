import { faker } from "@faker-js/faker";
import { generateUUID } from "three/src/math/MathUtils.js";

import { crimeTypes } from "../data";
import { generateNpcDriversLicenseDocument, generateNpcProfile } from "@game/npcs/generators";

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
// ---> Dadurch wirkt die Datenbank glaubwürdiger als eine reine Zufallsverteilung.
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

// ##### Criminal Database Generator
// -----> Erstellt die fake database für den Spielstart.
// ---> NPCs, Dokumente und Straftaten liegen in getrennten Tabellen und sind per ID verknüpft.
// -> Die Funktion kann mit Parametern aufgerufen werden, um die Anzahl der NPCs und Wanted-List-Einträge zu steuern und wird derzeit 
// -> nur einmalig beim Spielstart ausgeführt.
export function generateCriminalDatabase({ criminalNpcCount = 10, wantedNpcCount = 4 } = {}) {
    const npcsById = {};
    const crimeRecordsById = {};
    const documentsById = {};
    const criminalNpcIds = [];

    while (criminalNpcIds.length < criminalNpcCount) {
        const npcProfile = generateNpcProfile({ minimumAge: 18 });
        const npcId = npcProfile.realProfile.npcUuid;
        const document = withId(generateNpcDriversLicenseDocument(npcProfile), "doc");
        const crimeRecords = generateCrimeRecordsForNpc(npcId);

        npcsById[npcId] = {
            ...npcProfile,
            realProfile: {
                ...npcProfile.realProfile,
                documentIds: [document.id],
                crimeRecordIds: crimeRecords.map((crimeRecord) => crimeRecord.id)
            },
            fakeProfile: null
        };

        documentsById[document.id] = document;

        crimeRecords.forEach((crimeRecord) => {
            crimeRecordsById[crimeRecord.id] = crimeRecord;
        });

        criminalNpcIds.push(npcId);
    }

    const wantedList = pickWantedNpcIds(criminalNpcIds, wantedNpcCount);

    


    return {
        npcsById,
        crimeRecordsById,
        documentsById,
        criminalNpcIds,
        wantedList
    };
}

// ##### Crime Records
// -----> Erstellt 1-x Straftaten für einen kriminellen NPC.
// ---> Für normale Zivilisten könnte man später dieselbe Funktion mit 0 Records erweitern.
function generateCrimeRecordsForNpc(npcId) {
    const crimeCount = getWeightedRandomItem(crimeCountWeights).count;
    const usedCrimeTypes = new Set();

    return Array.from({ length: crimeCount }, () => {
        const crimeType = getUniqueCrimeType(usedCrimeTypes);
        usedCrimeTypes.add(crimeType);

        return {
            id: `crime--${generateUUID()}`,
            npcId,
            type: crimeType,
            severity: crimeSeverityByType[crimeType] ?? "unknown",
            title: formatCrimeTitle(crimeType),
            description: generateCrimeDescription(crimeType),
            committedAt: faker.date.past({ years: 8 }).toISOString().split("T")[0],
            status: faker.helpers.arrayElement(["open", "convicted", "under_investigation"]),
            source: faker.helpers.arrayElement(["local_police", "border_control", "federal_database"])
        };
    });
}

// ##### Unique Crime Picker
// -----> Verhindert, dass ein NPC mehrfach exakt denselben Crime-Type bekommt.
function getUniqueCrimeType(usedCrimeTypes) {
    let crimeType = getWeightedRandomItem(crimeTypeWeights).type;
    let attempts = 0;

    while (usedCrimeTypes.has(crimeType) && attempts < 10) {
        crimeType = getWeightedRandomItem(crimeTypeWeights).type;
        attempts++;
    }

    return crimeType;
}

// ##### Wanted List Picker
// -----> Zieht eine kleine dynamische Teilmenge der kriminellen NPCs für die Fahndungsliste.
function pickWantedNpcIds(criminalNpcIds, wantedNpcCount) {
    return faker.helpers
        .shuffle(criminalNpcIds)
        .slice(0, Math.min(wantedNpcCount, criminalNpcIds.length));
}

// ##### Record ID Helper
// -----> Gibt jedem Tabellen-Record einen stabilen Primary Key.
function withId(record, prefix) {
    return {
        id: `${prefix}--${generateUUID()}`,
        ...record
    };
}

// ##### Weighted Random Helper
// -----> Wählt einen Eintrag anhand seiner Gewichtung aus.
function getWeightedRandomItem(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of items) {
        random -= item.weight;
        if (random <= 0) return item;
    }

    return items[items.length - 1];
}

// ##### Display Helpers
// -----> Macht aus technischen Keys wie drug_possession lesbare Titel.
function formatCrimeTitle(type) {
    return type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// ##### Description Generator
// -----> Baut eine kurze Beschreibung, die später in Laptop/Funk/UI angezeigt werden kann.
function generateCrimeDescription(type) {
    const place = faker.location.city();
    const year = faker.date.past({ years: 8 }).getFullYear();

    return `${formatCrimeTitle(type)} recorded near ${place} in ${year}.`;
}
