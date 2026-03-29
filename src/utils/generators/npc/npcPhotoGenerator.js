import { npcImages } from "../../../data/npcImages";

export function npcPhotoGenerator (sex, age, hairColor, eyeColor) {
    const ageRanges = Object.keys(npcImages[sex]);    
    let ageRange;

    for (let i = 0; i < ageRanges.length; i++) {
        const key = ageRanges[i];
        const [minAge, maxAge] = JSON.parse(key);

        if (age >= minAge && age <= maxAge) {
            ageRange = key;
            break;
        }
    }

    return npcImages[sex][ageRange][hairColor][eyeColor][0]; 
                                // logs an object like so:
                                // const obj = {
                                //     [50,59]: {
                                //         {
                                //             blond: {
                                //                 blue : ['driver7.jpg'],
                                //                 brown: ['driver9.jpg'], 
                                //                 green : ['driver9.jpg']
                                //             }
                                //         }
    
}