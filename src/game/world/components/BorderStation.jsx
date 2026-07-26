import { useGLTF } from "@react-three/drei";
import { useClonedScene } from "../hooks";


export const BorderStation = () => {
    const gltf = useGLTF("/models/border-station.glb");
    const scene = useClonedScene(gltf);

    return (
        <primitive object={scene} position={[0,0,0]} />
    )
}
