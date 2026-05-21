import { eyeColors } from "../../../data/eyeColors";
import { npcImages } from "../../../data/npcImages";

export function generatePhysicalNpcCharacteristicsGenerator (sex, ageRange) {

    // hair color
    const hairColorsArray = Object.keys(npcImages[sex][ageRange]);
    const randomHairColor = Math.floor(Math.random() * hairColorsArray.length);
    const hairColor = hairColorsArray[randomHairColor];

    // eye color
    const eyeColorsArray = Object.keys(npcImages[sex][ageRange][hairColor]);
    const randomEyeColorIndex = Math.floor(Math.random() * eyeColorsArray.length);
    const eyeColor = eyeColorsArray[randomEyeColorIndex];

    // height 
    const height = Math.floor(Math.random() * (205 - 160 + 1)) + 160;

    const physicalCharacteristics = {
        height,
        eyeColor,
        hairColor
    }

    return physicalCharacteristics;
}