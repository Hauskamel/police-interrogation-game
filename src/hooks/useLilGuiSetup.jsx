import { useCallback, useEffect, useRef, useState } from 'react';

import { randomNpcWithVehicleGenerator } from '../game/world/generators';

import GUI from 'lil-gui'
import { useCarStore } from '../stores';

export const useLilGuiSetup = () => {
    const stopCar = useCarStore(state => state.stopCar);
    const guiRef = useRef(null);
    if (!guiRef.current) {
        guiRef.current = new GUI();
    }
    const gui = guiRef.current;

    const addCar = useCarStore(state => state.addCar);
    const [entity, setEntity] = useState(null);

    // a slim version of the spawn mechanism only for lil-gui
    const spawnRandomNpcWithVehicle = useCallback(() => {    
        let newEntity = randomNpcWithVehicleGenerator();
        newEntity = {...newEntity, spawn: {direction: "left", lane: 0, spawnForDevPurposes: true}};

        setEntity(newEntity);
        stopCar(newEntity.id);
        addCar(newEntity);
    })


    useEffect(() => {
        const guiContent = {
            spawnCarAtPoliceman: () => spawnRandomNpcWithVehicle()
        }

        gui.add(guiContent, 'spawnCarAtPoliceman').name("spawn car at policeman");

    }, []);
}
