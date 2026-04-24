// Diese Funktion kümmert sich um alle Stammdaten eines NPCs
import { generateUUID } from "three/src/math/MathUtils.js";
import { getRandomFirstName } from "../../getter/getRandomFirstName.js";
import { faker } from "@faker-js/faker";


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

    // age
    const today = new Date();

    // TODO: 2010 als maximales Geburtsjahr ist sehr statisch. (Man müsste quasi jedes Jahr das 'to' Datum um 1 erhöhen (2026 = 2010, 2027 = 2011,...). Das macht wenig Sinn.) 
    // Geburtstag muss dynamischer gestaltet werden --> vorübergehend ok, nachträglich aber zu verbessern!
    let birthDate = faker.date.between({
            from: '1945-01-01',
            to: '2010-12-31'
        })

    let age = today.getFullYear() - birthDate.getFullYear();
    const birthYear = new Date().getFullYear() - age;

    const hasHadBirthdayThisYear = today.getMonth() > birthDate.getMonth() || 
                                  (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (hasHadBirthdayThisYear) age = age - 1;

    birthDate.toISOString().split('T')[0];

    // const age = faker.number.int({
    //     min: 16,
    //     max: 75,
    // });

    // // brith data
    // const birthYear = new Date().getFullYear() - age;
    // const birthDate = faker.date
    //     .between({
    //         from: `${birthYear}-01-01`,
    //         to: `${birthYear}-12-31`
    //     })
    //     .toISOString()
    //     .split('T')[0];

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