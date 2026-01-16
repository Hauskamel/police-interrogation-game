import { useEffect } from "react";

import { generateCarProfile } from "../utils/profileGenerators/carProfileGenerator.js";

import { generateUUID, randInt } from "three/src/math/MathUtils.js";

import { useCarStore, useNpcStore } from "../store.js";
import { generateDriverProfile } from "../utils/profileGenerators/driverProfileGenerator.js";

export function useVehicleEntityGenerator (direction, lane) {
    const addCar = useCarStore((state) => state.addCar);
    const criminalDatabase = useNpcStore((state) => state.criminalDatabase);

    // spawns new car
    useEffect(() => {
        let respawnTime = randInt(5000, 10000);
        const intervalId = setInterval(() => {
        const spawnCarOfWantedList = Math.random() < 0.5;
        let newEntity;
        
        if (spawnCarOfWantedList && criminalDatabase.length) {
            // criminalDatabase is a parameter of this function.
            // the passed value is a reference to the criminalDatabase in the storage.js
            const criminal = criminalDatabase[Math.floor(Math.random() * criminalDatabase.length)];
            newEntity = {...criminal, id: generateUUID()}
        } else {
            const carProfile = generateCarProfile();
            const driverProfile = generateDriverProfile(true);
            
            newEntity = {driverProfile, carProfile, id: generateUUID()}
        }
        newEntity = {...newEntity, spawn: {direction, lane}};

        addCar(newEntity);
    }, respawnTime, criminalDatabase);
    return () => clearInterval(intervalId);
    }, [addCar, criminalDatabase]);
}