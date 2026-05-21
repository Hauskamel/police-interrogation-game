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

        // TODO: remove or keep old line -- check later
        // old line: i am not sure why i compared stoppedCar.id with vehicle.id because this would disable to click on any car since there is no car stopped at the beginning of the game
        // if (vehicle.id === stoppedCar?.id || vehicle?.id === playersPoliceCar?.id) {

        // new line
        if (vehicle.id || vehicle?.id === playersPoliceCar?.id) {
            setSelectedCar(vehicle)
        };
    }, [vehicle, setSelectedCar]);

    return {
        handlePointerOver,
        handlePointerOut,
        handleClick
    }
}