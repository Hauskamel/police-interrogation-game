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
    
        const handleClick = useCallback((e) => {
            e.stopPropagation();    
            if (vehicle.position?.x > STREETBAY_ENTRY_1[0] || vehicle.id === stoppedCar?.id || vehicle?.id === playersPoliceCar?.id) {
                setSelectedCar(vehicle)
            };
        }, [vehicle, setSelectedCar]);


        return {
            handlePointerOver,
            handlePointerOut,
            handleClick
        }
}