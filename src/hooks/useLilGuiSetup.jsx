import { useCallback, useEffect, useRef, useState } from 'react';


import { generateDriverProfile } from '../utils/profileGenerators/driverProfileGenerator';
import { generateCarProfile } from "../utils/profileGenerators/carProfileGenerator.js";
import { generateUUID } from "three/src/math/MathUtils.js";




import GUI from 'lil-gui'
import { useCarStore, useNpcStore } from '../store';

export const useLilGuiSetup = () => {
    const stopCar = useCarStore(state => state.stopCar)
    const guiRef = useRef(null);
    if (!guiRef.current) {
        guiRef.current = new GUI();
    }
    const gui = guiRef.current;

    const addCar = useCarStore(state => state.addCar)
    const criminalDatabase = useNpcStore((state) => state.criminalDatabase);

    const [entity, setEntity] = useState(null);






    const createEntity = useCallback(() => {
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
        newEntity = {...newEntity, spawn: {direction: "left", lane: 0, spawnForDevPurposes: true}};


        console.log("new Entity: ", newEntity);
        setEntity(newEntity);
        stopCar(newEntity.id);
        addCar(newEntity);

        console.log("new Entity after manipulation: ", newEntity);
    })
    

    useEffect(() => {
        const guiContent = {
            spawnCarAtPolice: () => createEntity(),
            myString: 'lil-gui',
            isCriminal: false
        }

        gui.add(guiContent, 'spawnCarAtPolice');
        gui.add(guiContent, 'myString');
        gui.add(guiContent, 'isCriminal');
    }, []);
}