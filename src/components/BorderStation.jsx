import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";



function useClonedScene (gltf) {
    // using memo to prevent unnecessary recoloring of the scene (car model)
    return useMemo(() => gltf.scene.clone(), [gltf.scene]);
}


export const BorderStation = () => {
    const gltf = useGLTF("/models/border-station.glb");
    console.log(gltf);
    
    const scene = useClonedScene(gltf);


    return (
        <primitive object={scene} position={[0,0,0]} />
    )


}