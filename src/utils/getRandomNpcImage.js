import { npcImageProfiles } from "../data/npcImageProfiles";


export function getRandomNpcImage (exclude = null) {
    const npcAgeGroups = Object.keys(npcImageProfiles);

    const randomAgeGroupIndex = Math.floor(Math.random() * npcAgeGroups.length); // WORKING
    const ageGroup = npcAgeGroups[randomAgeGroupIndex]; // WORKING

    const arrayOfImagesInThatGroup = Object.keys(npcImageProfiles[ageGroup].images);
    const lengthOfImagesInThatAgeGroup = arrayOfImagesInThatGroup.length; // WORKING
    
    const randomNpcImageIndex = Math.floor(Math.random() * lengthOfImagesInThatAgeGroup);
    const randomImage = arrayOfImagesInThatGroup[randomNpcImageIndex];

    return { ageGroup, randomImage }
}