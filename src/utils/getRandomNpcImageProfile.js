import { npcImageProfiles } from "../data/npcImageProfiles";


export function getRandomNpcImageProfile () {
    const arrayOfNpcAgeGroups = Object.keys(npcImageProfiles);

    // age group
    const randomAgeGroupIndex = Math.floor(Math.random() * arrayOfNpcAgeGroups.length);
    const ageGroup = arrayOfNpcAgeGroups[randomAgeGroupIndex];

    // driver image
    const arrayOfImagesInThatGroup = Object.keys(npcImageProfiles[ageGroup].images);
    const lengthOfImagesInThatAgeGroup = arrayOfImagesInThatGroup.length;
    const randomNpcImageIndex = Math.floor(Math.random() * lengthOfImagesInThatAgeGroup);
    const driverImage = arrayOfImagesInThatGroup[randomNpcImageIndex];

    // age range
    const ageRange = npcImageProfiles[ageGroup].ageRange;

    return { driverImage, ageRange }
}