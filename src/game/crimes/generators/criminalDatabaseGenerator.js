import { faker } from "@faker-js/faker";
import { generateUUID } from "three/src/math/MathUtils.js";

import { generateNpcDriversLicenseDocument, generateNpcProfile } from "@game/npcs/generators";
import { generateCrimeRecordsForNpc } from "./crimeRecordGenerator.js";

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
        const npcId = npcProfile.real.npcUuid;
        const document = withId(generateNpcDriversLicenseDocument(npcProfile), "doc");
        const crimeRecords = generateCrimeRecordsForNpc(npcId);

        npcsById[npcId] = {
            ...npcProfile,
            real: {
                ...npcProfile.real,
                documentIds: [document.id],
                crimeRecordIds: crimeRecords.map((crimeRecord) => crimeRecord.id)
            },
            // Criminal-Database-Profile speichern erstmal dieselbe presented-Basis wie real.
            // ---> Spawns erzeugen daraus später je Kontrolle sichtbare Dokumentabweichungen über documentState.
            presented: {
                ...npcProfile.presented,
                documentIds: [document.id],
                crimeRecordIds: crimeRecords.map((crimeRecord) => crimeRecord.id)
            }
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
