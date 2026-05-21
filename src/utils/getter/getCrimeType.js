import { crimeTypes } from "../../data/crimeTypes";

export function getCrimeType () {
    return crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
}