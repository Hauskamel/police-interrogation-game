import { npcImages } from "../data";

export function npcPhotoGenerator (sex, ageRange, hairColor, eyeColor) {    
    return npcImages[sex][ageRange][hairColor][eyeColor][0];
}
