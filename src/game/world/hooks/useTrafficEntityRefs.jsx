import { createRef, useEffect, useRef } from "react";

/**
 * ##### Traffic Entity Refs Hook
 * -----> Erstellt und behält stabile Refs fuer alle aktuell gerenderten TrafficEntities.
 */
export function useTrafficEntityRefs (trafficEntities) {
    const trafficEntityRefs = useRef({});
    useEffect(() => {
        trafficEntities.forEach(entity => {
            if (!trafficEntityRefs.current[entity.id]) {
                trafficEntityRefs.current[entity.id] = createRef();
            }
        })
    }, [trafficEntities])
    return trafficEntityRefs;
}
