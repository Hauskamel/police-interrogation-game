import { crimeTypes } from "../data";

export function getCrimeType () {
    return crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
}
