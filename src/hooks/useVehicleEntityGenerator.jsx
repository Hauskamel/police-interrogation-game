import { useEffect } from "react";
import { randInt } from "three/src/math/MathUtils.js";

import { crimeTypes } from "../data/crimeTypes.js";

import { useCarStore, useNpcStore } from "../store.js";
import { basicEntityProfile } from "../utils/generators/entityProfileGenerators/basicEntityProfileGenerator.js";


// this function has an interval that puts random generated "entities" into the 'addCar' state for the useCarStore
export function useVehicleEntityGenerator (direction, lane) {
    const addCar = useCarStore((state) => state.addCar);
    const criminalDatabase = useNpcStore((state) => state.criminalDatabase);

    // creates new entity
    useEffect(() => {
        let respawnTime = randInt(5000, 10000);
        const intervalId = setInterval(() => {


            // TODO: PART FOR SPAWNING ENTITIS NEEDS TO BE REWRITTEN
            // ######################################
            // ######################################
            // NEW VERSION:
            // ######################################
            // ######################################
            const spawnCriminal = Math.random() < 0.5; // is npc either a 'normal' civilian or a criminal/smuggler
            let newEntity;

            if (!spawnCriminal) {
                newEntity = basicEntityProfile();
            } else {
                // spawn a criminal
                const spawnSmuggler = Math.random() < 0.5; // decide wether criminal is a smuggler;
                
                const keys = Object.keys(crimeTypes);
                const crimeType = keys[Math.floor(Math.random() * keys.length)]
                console.log(crimeType);

                // TODO: hier funktion einbauen
                switch (crimeType) {
                    case "smuggler":
                        console.log("spawn a smuggler.");
                        break;
                    case "murderer":
                        console.log("spawn a murderer.");
                        break;
                    case "cybercriminal":
                        console.log("spawn a murderer.");
                        break;
                }
                

                // code for criminal;

            }














            // ######################################
            // ######################################
            // OLD VERSION:
            // ######################################
            // ######################################
            // const spawnCarOfWantedList = Math.random() < 0.5;
            // let newEntity;

            
            // if (spawnCarOfWantedList && criminalDatabase.length) {
            //     // criminalDatabase is a parameter of this function.
            //     // the passed value is a reference to the criminalDatabase in the storage.js
            //     const criminal = criminalDatabase[Math.floor(Math.random() * criminalDatabase.length)];
            //     newEntity = {...criminal, id: generateUUID()}


            // } else {
            //     newEntity = basicEntityProfile();
            // }



            newEntity = {...newEntity, spawn: {direction, lane}};

            addCar(newEntity);

        }, respawnTime, criminalDatabase);
        
        return () => clearInterval(intervalId);
    }, [addCar, criminalDatabase]);
}