import { useEffect } from "react";

import { generateDriverProfile } from "../utils/generateDriverProfile.js";

import { generateCarProfile } from "../utils/carProfileGenerator.js";
import { generateFakeDriverAndCarProfile } from "../utils/generateFakeDriverAndCarProfile.js";

import { generateUUID, randInt } from "three/src/math/MathUtils.js";

import { useCarStore, useNpcStore } from "../store.js";






export function useCarSpawner () {
    const addCar = useCarStore((state) => state.addCar);
    const wantedList = useNpcStore((state) => state.wantedList);
    

    // spawns new car
    useEffect(() => {
        let respawnTime = randInt(2000, 5000);
        const intervalId = setInterval(() => {
        const spawnCarOfWantedList = Math.random() < 0.5;
        let newCar;
        
        if (spawnCarOfWantedList && wantedList.length) {
            console.log("Spawning from wantedList");
            
            // wantedList is a parameter of this function.
            // the passed value is a reference to the wantedList in the storage.js
            const criminal = wantedList[Math.floor(Math.random() * wantedList.length)];

            console.log(criminal);
            
            

            newCar = {...criminal, id :generateUUID()}
        } else {
            console.log("Spawning NOT from wantedList");
            
            const carProfile = generateCarProfile();
            
            newCar = {carProfile, id: generateUUID()}
        }


        addCar(newCar);
    }, respawnTime, wantedList);
    return () => clearInterval(intervalId);
    }, [addCar, wantedList]);
}