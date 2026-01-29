import { useCallback, useEffect, useRef, useState } from 'react';


import { basicNpcProfile } from '../utils/generators/entityProfileGenerators/basicNpcProfileGenerator.js';
import { generateUUID } from "three/src/math/MathUtils.js";

import GUI from 'lil-gui'
import { useCarStore, useNpcStore } from '../store';

export const useLilGuiSetup = () => {
    const stopCar = useCarStore(state => state.stopCar);
    const guiRef = useRef(null);
    if (!guiRef.current) {
        guiRef.current = new GUI();
    }
    const gui = guiRef.current;

    const addCar = useCarStore(state => state.addCar);
    const criminalDatabase = useNpcStore((state) => state.criminalDatabase);
    const [entity, setEntity] = useState(null);


    // a slim version of the spawn mechanism only for lil-gui
    const createEntity = useCallback(() => {
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
        newEntity = {...newEntity, spawn: {direction: "left", lane: 0, spawnForDevPurposes: true}};

        setEntity(newEntity);
        stopCar(newEntity.id);
        addCar(newEntity);
    })


    // TODO: HIER WEITERBAUEN
    // const makeNpcCriminal = useCallback(() => {
        // criminalDatabase is a parameter of this function.
        // the passed value is a reference to the criminalDatabase in the storage.js
        // const criminal = criminalDatabase[Math.floor(Math.random() * criminalDatabase.length)];
        // let newEntity = {...criminal, id: generateUUID()}
    // })



    useEffect(() => {
        const guiContent = {
            spawnCarAtPolice: () => createEntity(),
            isCriminal: false,
            riggedCar: false
        }

        gui.add(guiContent, 'spawnCarAtPolice').name("spawn car at policeman");
        gui.add(guiContent, 'isCriminal').name("is criminal (not working)");
        gui.add(guiContent, 'riggedCar').name("rigged car (not working)");

    }, []);
}