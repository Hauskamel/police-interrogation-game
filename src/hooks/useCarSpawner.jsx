import { useEffect } from "react";

import { generateDriverProfile } from "../utils/generateDriverProfile.js";
import { generateCarProfile } from "../utils/generateCarProfile.js";
import { generateUUID, randInt } from "three/src/math/MathUtils.js";

import { useCarStore } from "../store.js";


export function useCarSpawner (wantedList) {
    const addCar = useCarStore((state) => state.addCar);

    // spawns new car
        useEffect(() => {
            let respawnTime = randInt(2000, 5000);
            const intervalId = setInterval(() => {
                const spawnCarOfWantedList = Math.random() < 0.5;
                
                let newCar;
                if (spawnCarOfWantedList && wantedList.length) {
                    const criminal = wantedList[Math.floor(Math.random() * wantedList.length)]
                    newCar = {...criminal, id :generateUUID(), stopped: false}
                } else {
                    newCar = {
                        id: generateUUID(),
                        stopped: false,
                        driverProfile: generateDriverProfile(),
                        carProfile: generateCarProfile()
                    }   
                }
    
                addCar(newCar);
            }, respawnTime);
            return () => clearInterval(intervalId);
        }, [addCar, wantedList]);
}