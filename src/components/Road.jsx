import { useGLTF } from "@react-three/drei";

function Road () {
    const { scene } = useGLTF("/models/road.glb");

    return (
        <primitive object={ scene } position={ [-20, 0, 0] } />
    )
}

export { Road }
