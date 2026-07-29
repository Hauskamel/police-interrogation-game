import { npcImages } from "../data";

// ##### NPC Appearance Generator
// -----> Wählt zusammenpassende sichtbare Merkmale anhand der verfügbaren NPC-Bilder.
// ---> Wird vom NPC-Profilgenerator vor der Auswahl des konkreten Lichtbilds verwendet.
export function generateNpcAppearance(sex, ageRange) {
    const availableHairColors = Object.keys(npcImages[sex][ageRange]);
    const hairColor = availableHairColors[
        Math.floor(Math.random() * availableHairColors.length)
    ];
    const availableEyeColors = Object.keys(npcImages[sex][ageRange][hairColor]);
    const eyeColor = availableEyeColors[
        Math.floor(Math.random() * availableEyeColors.length)
    ];
    const height = Math.floor(Math.random() * (205 - 160 + 1)) + 160;

    return {
        height,
        eyeColor,
        hairColor
    };
}
