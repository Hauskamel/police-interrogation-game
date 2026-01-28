import { useEffect } from "react";

import { generateCarProfile } from "../utils/profileGenerators/carProfileGenerator.js";

import { generateUUID, randInt } from "three/src/math/MathUtils.js";

import { useCarStore, useNpcStore } from "../store.js";
import { generateDriverProfile } from "../utils/profileGenerators/driverProfileGenerator.js";
import { basicNpcProfile } from "../utils/generators/basicNpcProfileGenerator.js";

export function useVehicleEntityGenerator (direction, lane) {
    const addCar = useCarStore((state) => state.addCar);
    const criminalDatabase = useNpcStore((state) => state.criminalDatabase);

    // creates new entity
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
                newEntity = basicNpcProfile();
            }
            newEntity = {...newEntity, spawn: {direction, lane}};

            addCar(newEntity);
        }, respawnTime, criminalDatabase);
        return () => clearInterval(intervalId);
    }, [addCar, criminalDatabase]);
}