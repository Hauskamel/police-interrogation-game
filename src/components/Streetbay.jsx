import {useGLTF} from "@react-three/drei";


function Streetbay() {
    const {scene} = useGLTF("/models/streetbay.glb")

    return (
        <primitive object={scene} position={[0, 0, 0]}/>
    )
}

export { Streetbay }