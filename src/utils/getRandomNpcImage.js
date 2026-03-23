import { npcImageProfiles } from "../data/npcImageProfiles";


export function getRandomNpcImage (exclude = null) {
    const npcAgeGroups = Object.keys(npcImageProfiles);
    const randomAgeGroupIndex = Math.floor(Math.random() * npcAgeGroups.length);
    const ageGroup = npcAgeGroups[randomAgeGroupIndex];

    const randomNpcImageIndex = Math.floor(Math.random() * npcImageProfiles[ageGroup].images.length);

    

    const randomImage = npcImageProfiles[ageGroup].images[randomNpcImageIndex];

    return { ageGroup, randomImage }
}