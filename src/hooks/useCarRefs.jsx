import { createRef, useEffect, useRef } from "react";

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