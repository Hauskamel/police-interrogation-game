import { useCarStore } from "@stores";

import { useCallback } from "react";

/**
 * ##### Vehicle Interaction Hook
 * -----> Buendelt Hover- und Klick-Events fuer auswählbare Fahrzeuge.
 */
export const useVehicleInteraction = (vehicle, onHoverChange) => {    
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

        if (!vehicle?.id) return;

        setSelectedCar(vehicle);
    }, [vehicle, setSelectedCar]);

    return {
        handlePointerOver,
        handlePointerOut,
        handleClick
    }
}
