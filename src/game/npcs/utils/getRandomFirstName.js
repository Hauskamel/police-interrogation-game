import { firstNames } from "../data";

export function getRandomFirstName () {
    const randomIndex = Math.floor(Math.random() * firstNames.length)
    return firstNames[randomIndex]
}
