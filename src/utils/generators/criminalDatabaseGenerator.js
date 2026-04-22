import { useNpcStore } from "../../store";
import { generateNpcProfile } from "./npc/npcProfileGenerator";


export function criminalDatabaseGenerator () {
    // const criminalDatabase = useNpcStore(state => state.criminalDatabase);

    const databaseContent = [];
    let i = 0;

    while (i < 150) {
        i++;
        const criminalNpc = generateNpcProfile();
        databaseContent.push(criminalNpc);
    }



    console.log(criminalDatabase);
    


}