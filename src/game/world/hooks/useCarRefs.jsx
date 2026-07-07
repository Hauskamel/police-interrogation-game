import { createRef, useEffect, useRef } from "react";

/**
 * ##### Car Refs Hook
 * -----> Erstellt und behält stabile Refs fuer alle aktuell gerenderten Fahrzeuge.
 */
export function useCarRefs (cars) {
    const carRefs = useRef({});
    useEffect(() => {
        cars.forEach(car => {
            if (!carRefs.current[car.id]) {
                carRefs.current[car.id] = createRef();
            }
        })
    }, [cars])
    return carRefs;
}
