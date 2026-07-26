import { useTrafficStore } from "@stores";

import { useCallback } from "react";

/**
 * ##### Vehicle Interaction Hook
 * -----> Buendelt Hover- und Klick-Events fuer auswählbare Fahrzeuge.
 */
export const useVehicleInteraction = (vehicle, onHoverChange) => {    
    const setSelectedTrafficEntity = useTrafficStore((state) => state.setSelectedTrafficEntity);

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

        setSelectedTrafficEntity(vehicle);
    }, [vehicle, setSelectedTrafficEntity]);

    return {
        handlePointerOver,
        handlePointerOut,
        handleClick
    }
}
