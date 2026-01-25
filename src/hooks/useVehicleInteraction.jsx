import { STREETBAY_ENTRY_1 } from "../config/positions.js";

import { useCarStore } from "../store.js";

import { useCallback } from "react";

export const useVehicleInteraction = (vehicle, onHoverChange) => {    
    const stoppedCar = useCarStore((state) => state.cars.find(car => car.stopped));
    const playersPoliceCar = useCarStore(state => state.playersPoliceCar);
    const setSelectedCar = useCarStore((state) => state.setSelectedCar);

    const handlePointerOver = useCallback((e) => {
        e.stopPropagation();
        onHoverChange?.(true);
    }, [onHoverChange]);

    const handlePointerOut = useCallback((e) => {
        e.stopPropagation();
        onHoverChange?.(false);
    }, [onHoverChange]);

    const handleClick = useCallback((e) => {e.stopPropagation();
        console.log("trying to set clicked vehicle...");

        console.log("vehicle id: ", vehicle);
        

        if (vehicle.id === stoppedCar?.id || vehicle?.id === playersPoliceCar?.id) {
            console.log("setting clicked vehicle...");
            setSelectedCar(vehicle)
        };
    }, [vehicle, setSelectedCar]);

    return {
        handlePointerOver,
        handlePointerOut,
        handleClick
    }
}