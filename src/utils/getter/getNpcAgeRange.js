import { npcImages } from "../../data/npcImages";

export function getNpcAgeRange (sex, age) {


    console.log(age);
    


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

    return ageRange
}