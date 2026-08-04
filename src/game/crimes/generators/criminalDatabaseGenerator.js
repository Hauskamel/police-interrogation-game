import { faker } from "@faker-js/faker";

import { generateNpcProfile } from "@game/npcs/generators";
import { createEntityId, getCurrentGameDate } from "@game/shared";
import { generateVehicleProfile } from "@game/vehicles/generators";
import { WANTED_RECORD_STATUSES } from "../data";
import { generateCrimeRecordsForNpc } from "./crimeRecordGenerator.js";

// ##### Criminal Database Generator
// -----> Erstellt die fake database für den Spielstart.
// ---> NPCs und Straftaten liegen in getrennten Tabellen und sind per ID verknüpft.
// -> Die Funktion kann mit Parametern aufgerufen werden, um die Anzahl der NPCs und Wanted-List-Einträge zu steuern und wird derzeit 
// -> nur einmalig beim Spielstart ausgeführt.
export function generateCriminalDatabase({ criminalNpcCount = 10, wantedNpcCount = 4 } = {}) {
    const npcsById = {};
    const crimeRecordsById = {};
    const wantedRecordsById = {};
    const vehiclesById = {};
    const criminalNpcIds = [];
    const vehicleIds = [];

    while (criminalNpcIds.length < criminalNpcCount) {
        const npcProfile = generateNpcProfile({ minimumAge: 18 });
        const npcId = npcProfile.real.npcId;
        const crimeRecords = generateCrimeRecordsForNpc(npcId);
        const crimeRecordIds = crimeRecords.map((crimeRecord) => crimeRecord.id);
        const vehicleProfile = generateVehicleProfile({
            registeredOwnerNpcId: npcId
        });
        const vehicleId = createEntityId("vehicle");

        // Personen- und Fahrzeugdaten werden als getrennte Tabellen gespeichert.
        // Die Verbindung entsteht ausschließlich über stabile IDs.
        npcsById[npcId] = {
            ...npcProfile.real,
            crimeRecordIds,
            vehicleIds: [vehicleId]
        };
        vehiclesById[vehicleId] = {
            ...vehicleProfile.real,
            vehicleId
        };

        crimeRecords.forEach((crimeRecord) => {
            crimeRecordsById[crimeRecord.id] = crimeRecord;
        });

        criminalNpcIds.push(npcId);
        vehicleIds.push(vehicleId);
    }

    const wantedNpcIds = pickWantedNpcIds(criminalNpcIds, wantedNpcCount);
    const knownOffenderNpcIds = criminalNpcIds.filter((npcId) => !wantedNpcIds.includes(npcId));
    const wantedRecordIds = wantedNpcIds.map((npcId) => {
        const wantedRecord = createWantedRecord({
            npcId,
            crimeRecordIds: npcsById[npcId].crimeRecordIds
        });

        wantedRecordsById[wantedRecord.id] = wantedRecord;
        return wantedRecord.id;
    });

    return {
        npcsById,
        crimeRecordsById,
        wantedRecordsById,
        vehiclesById,
        criminalNpcIds,
        knownOffenderNpcIds,
        wantedRecordIds,
        vehicleIds
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
        issuedAt: faker.date.past({
            years: 2,
            refDate: getCurrentGameDate()
        }).toISOString().split("T")[0],
        priorityLevel: faker.number.int({ min: 1, max: 3 })
    };
}
