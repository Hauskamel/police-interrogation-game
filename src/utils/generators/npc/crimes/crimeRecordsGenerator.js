import { faker } from "@faker-js/faker";

import { getCrimeType } from "../../../getter/getCrimeType";

export function crimeRecordsGenerator () {
    // crimeId
    const crimeId = `${faker.string.alpha({ length: 1, casing: 'upper' })}-${faker.number.int({ min: 1, max: 99999 })}`;

    // 
    const crimeType = getCrimeType();
    




    const crimeRecord = {
        crimeId,
        crimeType
    }

    return crimeRecord
}