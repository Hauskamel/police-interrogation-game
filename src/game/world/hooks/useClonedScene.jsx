import { useMemo } from "react";

/**
 * ##### Cloned Scene Hook
 * -----> Klont ein GLTF-Scene-Objekt, damit mehrere Instanzen unabhaengig gerendert werden koennen.
 */
export function useClonedScene (gltf) {
    return useMemo(() => gltf.scene.clone(), [gltf.scene]);
}
