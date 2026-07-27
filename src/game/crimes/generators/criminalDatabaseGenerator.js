import { faker } from "@faker-js/faker";

import { generateNpcDriversLicenseDocument, generateNpcProfile } from "@game/npcs/generators";
import { createEntityId } from "@game/shared";
import { WANTED_RECORD_STATUSES } from "../data";
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
    const wantedRecordsById = {};
    const criminalNpcIds = [];

    while (criminalNpcIds.length < criminalNpcCount) {
        const npcProfile = generateNpcProfile({ minimumAge: 18 });
        const npcId = npcProfile.real.npcId;
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

    const wantedNpcIds = pickWantedNpcIds(criminalNpcIds, wantedNpcCount);
    const knownOffenderNpcIds = criminalNpcIds.filter((npcId) => !wantedNpcIds.includes(npcId));
    const wantedRecordIds = wantedNpcIds.map((npcId) => {
        const wantedRecord = createWantedRecord({
            npcId,
            crimeRecordIds: npcsById[npcId].real.crimeRecordIds
        });

        wantedRecordsById[wantedRecord.id] = wantedRecord;
        return wantedRecord.id;
    });

    return {
        npcsById,
        crimeRecordsById,
        documentsById,
        wantedRecordsById,
        criminalNpcIds,
        knownOffenderNpcIds,
        wantedRecordIds
    };
}

// ##### Wanted List Picker
// -----> Zieht eine kleine dynamische Teilmenge der kriminellen NPCs für die Fahndungsliste.
function pickWantedNpcIds(criminalNpcIds, wantedNpcCount) {
    return faker.helpers
        .shuffle(criminalNpcIds)
        .slice(0, Math.min(wantedNpcCount, criminalNpcIds.length));
}

// ##### Wanted Record Factory
// -----> Erstellt eine eigene Fahndung, die per npcId und Crime-Record-IDs verknüpft ist.
// ---> Die Fahndungs-ID ist bewusst unabhängig von der NPC-ID und kann ihren eigenen Status ändern.
function createWantedRecord({ npcId, crimeRecordIds }) {
    const reasonCrimeRecordIds = crimeRecordIds.length > 0
        ? [faker.helpers.arrayElement(crimeRecordIds)]
        : [];

    return {
        id: createEntityId("wanted"),
        npcId,
        status: WANTED_RECORD_STATUSES.ACTIVE,
        reasonCrimeRecordIds,
        issuedAt: faker.date.past({ years: 2 }).toISOString().split("T")[0],
        priorityLevel: faker.number.int({ min: 1, max: 3 })
    };
}

// ##### Record ID Helper
// -----> Gibt jedem Tabellen-Record einen stabilen Primary Key.
function withId(record, prefix) {
    return {
        id: createEntityId(prefix),
        ...record
    };
}
