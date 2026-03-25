import { eyeColors } from "../../../data/eyeColors";
import { hairColors } from "../../../data/hairColors";

export function generatePhysicalNpcCharacteristicsGenerator () {
    // height 
    const height = Math.floor(Math.random() * (205 - 160 + 1)) + 160;

    // eye color
    const randomEyeColorIndex = Math.floor(Math.random() * eyeColors.length);
    const eyeColor = eyeColors[randomEyeColorIndex];

    // hair color
    const randomHairColor = Math.floor(Math.random() * hairColors.length);
    const hairColor = hairColors[randomHairColor];

    const physicalCharacteristics = {
        height,
        eyeColor,
        hairColor
    }

    return physicalCharacteristics;
}