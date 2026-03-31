// Diese Funktion kümmert sich um alle Stammdaten eines NPCs
import { generateUUID } from "three/src/math/MathUtils.js";
import { getRandomFirstName } from "../../getter/getRandomFirstName.js";
import { faker } from "@faker-js/faker";


export function generateMasterData () {
    // uuid
    const npcUuid = generateUUID();

    // sex
    const sex = faker.person.sexType('male')

    // firstname
    const firstName = getRandomFirstName();
    
    // lastname
    const lastName = faker.person.lastName();

    // address
    const address = faker.location.streetAddress();

    // age
    const age = faker.number.int({
        min: 16,
        max: 75,
    });

    // brith data
    const birthYear = new Date().getFullYear() - age;
    const birthDate = faker.date
        .between({
            from: `${birthYear}-01-01`,
            to: `${birthYear}-12-31`
        })
        .toISOString()
        .split('T')[0];

    // TODO: Geburtsort einfügen
    // place of birth
    // const place of birth = 

    const npcMasterData = {
        npcUuid,
        sex,
        age,
        firstName,
        lastName,
        address,
        birthYear,
        birthDate
    }
    return npcMasterData;
}