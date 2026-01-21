import { useEffect, useMemo } from 'react';

import GUI from 'lil-gui'

export const useLilGuiSetup = () => {
    const gui = useMemo(() => new GUI());

    useEffect(() => {
        const guiContent = {
        carStopped: false,
        myString: 'lil-gui',
        myNumber: 1,
        isCriminal: false
    }
    gui.add(guiContent, 'carStopped');
    gui.add(guiContent, 'myString');
    gui.add(guiContent, 'myNumber');
    }, [gui]);
}