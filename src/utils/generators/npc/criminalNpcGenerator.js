import { generateNpcProfile } from "./npcProfileGenerator";

export function criminalNpcGenerator () {
    let ids = [];
    let i = 0;

    while (i < 10) {
        i++;
        const criminalNpc = generateNpcProfile();

        console.log(criminalNpc); // TODO: manchmal ist das noch 'undefined' --> vllt mit await & promise arbeiten?
                                  // ----> es wurde festgestellt, dass die Funktion 'generateNpcProfile' manchmal nicht ausgeführt wird
        
        const npcId = criminalNpc?.realProfile?.npcUuid;
        ids.push(npcId);
    }

    return ids
}