import { firstNames } from "../../data/firstNames"

export function getRandomFirstName () {
    const randomIndex = Math.floor(Math.random() * firstNames.length)
    return firstNames[randomIndex]
}