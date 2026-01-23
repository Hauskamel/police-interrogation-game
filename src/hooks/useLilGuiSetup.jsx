import { useEffect, useMemo } from 'react';
import { useVehicleEntityGenerator } from './useVehicleEntityGenerator';

import GUI from 'lil-gui'

export const useLilGuiSetup = () => {
    const gui = useMemo(() => new GUI(), []);

    const createdVehicleEntity =  useVehicleEntityGenerator("left", 0);

    useEffect(() => {
        const guiContent = {
            carStopped: () => { console.log(createdVehicleEntity) } ,
            myString: 'lil-gui',
            isCriminal: false
        }

        gui.add(guiContent, 'carStopped');
        gui.add(guiContent, 'myString');
        gui.add(guiContent, 'isCriminal');
    }, []);
}