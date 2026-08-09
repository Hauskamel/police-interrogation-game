import { npcImages } from "../data";

// ##### NPC Photo Selector
// -----> Liefert das Bild, das zu Geschlecht, Altersgruppe und Erscheinungsmerkmalen passt.
// ---> Die Auswahl folgt nach generateNpcAppearance im NPC-Profilgenerator.
export function selectNpcPhoto(sex, ageRange, hairColor, eyeColor, random = Math.random) {
    const photos = npcImages[sex][ageRange][hairColor][eyeColor];
    return photos[Math.floor(random() * photos.length)];
}
