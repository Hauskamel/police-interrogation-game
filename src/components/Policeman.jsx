import {useGLTF} from "@react-three/drei";

function Policeman () {
    const { scene } = useGLTF("/models/policeman.glb")

    return (
        <primitive object={ scene } position={ [ 0, 0, 0] } />
    )
}

export { Policeman }