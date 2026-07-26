import { useCallback, useEffect, useRef, useState } from 'react';

import GUI from 'lil-gui'

import { generateTrafficEntity } from '@game/traffic';
import { useNpcStore, useTrafficStore } from '@stores';

export const useLilGuiSetup = () => {
    const stopTrafficEntity = useTrafficStore(state => state.stopTrafficEntity);
    const guiRef = useRef(null);
    if (!guiRef.current) {
        guiRef.current = new GUI();
    }
    const gui = guiRef.current;

    const addTrafficEntity = useTrafficStore(state => state.addTrafficEntity);
    const criminalDatabase = useNpcStore(state => state.criminalDatabase);
    const [entity, setEntity] = useState(null);

    const spawnRandomNpcWithVehicle = useCallback(() => {
        let newEntity = generateTrafficEntity({ criminalDatabase });
        newEntity = {...newEntity, spawn: {direction: "left", lane: 0, spawnForDevPurposes: true}};

        setEntity(newEntity);
        addTrafficEntity(newEntity);
        stopTrafficEntity(newEntity.id);
    }, [addTrafficEntity, criminalDatabase, stopTrafficEntity])


    useEffect(() => {
        const guiContent = {
            spawnCarAtPoliceman: () => spawnRandomNpcWithVehicle()
        }

        const controller = gui.add(guiContent, 'spawnCarAtPoliceman').name("spawn car at policeman");

        return () => controller.destroy();
    }, [gui, spawnRandomNpcWithVehicle]);
}
