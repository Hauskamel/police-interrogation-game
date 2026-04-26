// Diese Funktion kümmert sich um alle Stammdaten eines NPCs
import { generateUUID } from "three/src/math/MathUtils.js";
import { getRandomFirstName } from "../../getter/getRandomFirstName.js";
import { faker } from "@faker-js/faker";

import { generateBirthDate } from "./generateBirthDate.js";
import { getNpcAge } from "../../getter/getNpcAge.js";


export function generateNpcMasterData () {
    // uuid
    const npcUuid = "npc--" + generateUUID();

    // sex
    const sex = faker.person.sexType('male'); // TODO: funktioniert nicht

    // firstname
    const firstName = getRandomFirstName();
    
    // lastname
    const lastName = faker.person.lastName();

    // address
    const address = faker.location.streetAddress();

    // birthdate
    const birthDate = generateBirthDate();

    // birthyear
    const birthYear = birthDate.split("-")[0];
    
    // age
    const age = getNpcAge(birthDate);
    
    // TODO: Geburtsort einfügen

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