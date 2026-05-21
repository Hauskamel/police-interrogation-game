import { useCriminalNpcGenerator } from "./useCriminalNpcGenerator";
import { useCrimeGenerator } from "./useCrimeGenerator";

import { useNpcStore } from "../store";

export function useCriminalDatabaseGenerator (
    setCriminalNpcIds,
) {
    console.log("Datenbank wird gerade generiert...");

    // sets id´s of pre game generated criminal npcs
    setCriminalNpcIds(useCriminalNpcGenerator());
    useCrimeGenerator();

    console.log("Datenbank Generierung abgeschlossen!");
}