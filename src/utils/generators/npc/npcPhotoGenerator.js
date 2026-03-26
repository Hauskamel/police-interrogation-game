import { npcImages } from "../../../data/npcImages";

export function npcPhotoGenerator (sex, age, hairColor, eyeColor) {

    console.log("sex: ", sex);

    console.log("alter: ", age);

    console.log(npcImages[sex]);


    const ageRanges = Object.keys(npcImages[sex]);

    for (let i = 0; i < ageRanges.length; i++) {
        const range = JSON.parse(ageRanges[i]);
        console.log(range);
        

        for (let j = 0; j < range.length; j++) {
            console.log(range[j]);
        }
    }
    






    console.log("hair color :", hairColor);
    console.log("eye color :", eyeColor);
    

}