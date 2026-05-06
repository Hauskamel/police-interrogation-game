import { useCriminalNpcGenerator } from "./useCriminalNpcGenerator";
import { useCrimeGenerator } from "./useCrimeGenerator";

export function useCriminalDatabaseGenerator () {
    console.log("Datenbank wird gerade generiert...");

    useCriminalNpcGenerator();
    useCrimeGenerator();

    console.log("Datenbank wurde erfolgreich generiert!");
}