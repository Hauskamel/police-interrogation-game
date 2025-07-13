import { useEffect } from "react";

import { generateDriverProfile } from "../utils/generateDriverProfile.js";
import { generateCarProfile } from "../utils/generateCarProfile.js";
import { generateUUID, randInt } from "three/src/math/MathUtils.js";

import { useCarStore, useNpcStore } from "../store.js";





export function useCarSpawner () {
    const cars = useCarStore(state => state.cars)
    const addCar = useCarStore((state) => state.addCar);
    const wantedList = useNpcStore((state) => state.wantedList);
    

    // spawns new car
    useEffect(() => {
        let respawnTime = randInt(2000, 5000);
        const intervalId = setInterval(() => {
        const spawnCarOfWantedList = Math.random() < 0.5;
        let newCar;
        if (spawnCarOfWantedList && wantedList.length) {
            // wantedList is a parameter of this function.
            // the passed value is a reference to the wantedList in the storage.js
            const criminal = wantedList[Math.floor(Math.random() * wantedList.length)]
            newCar = {...criminal, id :generateUUID()}
        } else {
            newCar = {
                id: generateUUID(),
                stopped: false,
                driverProfile: generateDriverProfile(false),
                carProfile: generateCarProfile()
            }
        }
        addCar(newCar);
    }, respawnTime, wantedList);
    return () => clearInterval(intervalId);
    }, [addCar, wantedList]);
}