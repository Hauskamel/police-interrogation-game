import { npcImages } from "../../../data/npcImages";

export function npcPhotoGenerator (sex, ageRange, hairColor, eyeColor) {    
    return npcImages[sex][ageRange][hairColor][eyeColor][0];
}