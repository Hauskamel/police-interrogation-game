import { useNpcStore } from "../store";

import { generateNpcProfile } from "../utils/generators/npc/npcProfileGenerator";

export function useCriminalDatabaseGenerator () {
    const criminalDatabase = useNpcStore(state => state.criminalDatabase);
    
    const databaseContent = [];
    let i = 0;

    while (i < 1000) {
        i++;
        const criminalNpc = generateNpcProfile();
        databaseContent.push(criminalNpc);
    }

    console.log(databaseContent);

}