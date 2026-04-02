import { useMemo } from "react";

export function useClonedScene (gltf) {
    // using memo to prevent unnecessary recoloring of the scene (car model)
    return useMemo(() => gltf.scene.clone(), [gltf.scene]);
}
