import { firstNames } from "../data/firstNames.js"

export function getRandomFirstName() {
    const randomIndex = Math.floor(Math.random() * firstNames.length)
    return firstNames[randomIndex]
}