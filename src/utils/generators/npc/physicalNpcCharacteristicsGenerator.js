import { eyeColors } from "../../../data/eyeColors";
import { hairColors } from "../../../data/hairColors";

export function generatePhysicalNpcCharacteristicsGenerator () {
    const eyeColorsArray = Object.values(eyeColors);
    const hairCOlorsArray = Object.values(hairColors);

    // height 
    const height = Math.floor(Math.random() * (205 - 160 + 1)) + 160;

    // eye color
    const randomEyeColorIndex = Math.floor(Math.random() * eyeColorsArray.length);
    const eyeColor = eyeColorsArray[randomEyeColorIndex];

    // hair color
    const randomHairColor = Math.floor(Math.random() * hairCOlorsArray.length);
    const hairColor = hairCOlorsArray[randomHairColor];

    const physicalCharacteristics = {
        height,
        eyeColor,
        hairColor
    }

    return physicalCharacteristics;
}