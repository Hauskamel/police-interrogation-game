// Diese Funktion kümmert sich um alle Stammdaten eines NPCs
import { createEntityId } from "@game/shared";
import { getRandomFirstName } from "../utils";
import { faker } from "@faker-js/faker";

import { generateBirthDate } from "./generateBirthDate.js";
import { getNpcAge } from "../utils";
import { FOREIGN_COUNTRIES, HOME_COUNTRY } from "../data";


export function generateNpcMasterData (options = {}) {
    // stabile, kompakte NPC-ID
    const npcId = createEntityId("npc");

    // Geschlecht
    // -----> Aktuell werden bewusst ausschließlich männliche NPCs generiert.
    const sex = "male";

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

    // Herkunftsland
    // -----> Etwa ein Drittel der Verkehrsteilnehmer besitzt einen auslaendischen Fuehrerschein.
    const requiresForeignOrigin = options.forcedRequiresResidencePermit === true
        || options.forcedRequiresWorkPermit === true;
    const countryOfOrigin = options.forcedCountryOfOrigin
        ?? (requiresForeignOrigin
            ? faker.helpers.arrayElement(FOREIGN_COUNTRIES)
            : undefined
        )
        ?? (faker.number.float({ min: 0, max: 1 }) < 0.35
            ? faker.helpers.arrayElement(FOREIGN_COUNTRIES)
            : HOME_COUNTRY
        );
    
    // TODO: Geburtsort einfügen

    const npcMasterData = {
        npcId,
        sex,
        age,
        firstName,
        lastName,
        address,
        birthYear,
        birthDate,
        countryOfOrigin
    }
    return npcMasterData;
}
