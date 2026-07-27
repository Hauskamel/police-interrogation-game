// Diese Funktion kümmert sich um alle Stammdaten eines NPCs
import { createEntityId } from "@game/shared";
import { getRandomFirstName } from "../utils";
import { faker } from "@faker-js/faker";

import { generateBirthDate } from "./generateBirthDate.js";
import { getNpcAge } from "../utils";


export function generateNpcMasterData () {
    // stabile, kompakte NPC-ID
    const npcId = createEntityId("npc");

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
        npcId,
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
