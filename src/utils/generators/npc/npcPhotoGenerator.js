import { npcImages } from "../../../data/npcImages";

export function npcPhotoGenerator (sex, ageRange, hairColor, eyeColor) {    
    return npcImages[sex][ageRange][hairColor][eyeColor][0];    // logs an object like so:
                                                                // const obj = {
                                                                //     [50,59]: {
                                                                //         {
                                                                //             blond: {
                                                                //                 blue : ['driver7.jpg'],
                                                                //                 brown: ['driver9.jpg'], 
                                                                //                 green : ['driver9.jpg']
                                                                //             }
                                                                //         }
}