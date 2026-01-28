import { generateDriverProfile } from "./profileGenerators/driverProfileGenerator.js";
import { generateCarProfile } from "./profileGenerators/carProfileGenerator.js"


export function generateWantedListProfiles () {
    const criminals = [];

    while (criminals.length < 5) {
        const profile = {
            driverProfile: generateDriverProfile(true),
            carProfile: generateCarProfile(true),
            arrested: false
            // TODO: hier den Grund, warum der NPC gesucht ist & davon abhängig eine Beschreibung der Straftat
        }
        criminals.push(profile);
    }
    return criminals
}