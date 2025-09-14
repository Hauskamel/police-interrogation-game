import { useEffect } from "react";

import { generateCarProfile } from "../utils/profileGenerators/carProfileGenerator.js";

import { generateUUID, randInt } from "three/src/math/MathUtils.js";

import { useCarStore, useNpcStore } from "../store.js";
import { generateDriverProfile } from "../utils/profileGenerators/driverProfileGenerator.js";






export function useCarSpawner () {
    const addCar = useCarStore((state) => state.addCar);
    const wantedList = useNpcStore((state) => state.wantedList);
    

    // spawns new car
    useEffect(() => {
        let respawnTime = randInt(2000, 5000);
        const intervalId = setInterval(() => {
        const spawnCarOfWantedList = Math.random() < 0.5;
        let newEntitiy;
        
        if (spawnCarOfWantedList && wantedList.length) {
            console.log("#############################");
            console.log("WANTED LIST NPC");
            console.log("#############################");
            

            // wantedList is a parameter of this function.
            // the passed value is a reference to the wantedList in the storage.js
            const criminal = wantedList[Math.floor(Math.random() * wantedList.length)];            

            newEntitiy = {...criminal, id :generateUUID()}
        } else {
            console.log("#############################");
            console.log("NPC WITH POTENCIAL FAKED PROFILE");
            console.log("#############################");
            
            const carProfile = generateCarProfile();
            const driverProfile = generateDriverProfile();
            
            newEntitiy = {driverProfile, carProfile, id: generateUUID()}
        }


        addCar(newEntitiy);
    }, respawnTime, wantedList);
    return () => clearInterval(intervalId);
    }, [addCar, wantedList]);
}