import { NPC_PHOTO_CATALOG } from "./npcPhotoMetadata.js";

// Der verschachtelte Index bleibt der Vertrag für die Appearance-Generierung.
// Seine Inhalte werden aus dem kanonischen Foto-Katalog abgeleitet, damit sichtbares
// Bild und generierte Haar-/Augenfarbe nicht auseinanderlaufen können.
export const npcImages = Object.values(NPC_PHOTO_CATALOG).reduce(
    (index, photo) => {
        const sexIndex = index[photo.sex] ??= {};
        const ageIndex = sexIndex[photo.ageRange] ??= {};
        const hairIndex = ageIndex[photo.hairColor] ??= {};
        const eyeIndex = hairIndex[photo.eyeColor] ??= [];
        eyeIndex.push(photo.fileName);
        return index;
    },
    { male: {} }
);
