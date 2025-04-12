import {useGLTF} from "@react-three/drei";
import {useMemo, useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {useCarStore} from "../store";

function Car({car}) {
    const gltf = useGLTF("/models/car.glb");
    const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
    const carRef = useRef();
    const tubeRef = useRef();

    const [t, setT] = useState(0);

    const {id, stopped} = car;

    const removeCar = useCarStore((state) => state.removeCar);
    const stopCar = useCarStore((state) => state.stopCar);

    
    // Create a CatmullRomCurve3 with the points
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(15, 0,  -.6),
        new THREE.Vector3(13, 0,  -.6),
        new THREE.Vector3(10, 0, -3),
        new THREE.Vector3(8, 0, -3),
    ]);


    useFrame(() => {
        const carPositionX = Math.floor(carRef.current.position.x * 100) / 100

        if (!stopped) {

            // TODO: coordinate needs to be more specific (for now hardcoded '15' is ok)
            if (carPositionX > 15) {
                carRef.current.position.x -= 0.03; // car driving on road

            } else {
                setT((prevT) => (prevT + .009) % 1); // loop animation

                const position = curve.getPoint(t); // Get the position at t
                const tangent = curve.getTangent(t);
                
                const lookAtTarget = position.clone().add(tangent);

                carRef.current.position.copy(position);
                carRef.current.lookAt(lookAtTarget);
            }

            // TODO: rework - this is not clean code -


            // car stops when car drove 99.9% of the roads lengthcurv
            if (t.toFixed(3) == .999) {
                stopCar(id);
            }


            // if (carRef.current.position.x < -45) {
            //     removeCar(id);
            // }
        }
    });


    return (
        <>
            {/* tube*/}
            {/* <mesh ref={tubeRef}>
                <tubeGeometry args={[curve, 100, .2, 5, false]}/>
                <meshStandardMaterial color="yellow" wireframe={false}></meshStandardMaterial>
            </mesh>
            */}
            {/* car */}
            <primitive object={scene} ref={carRef} rotation={[0, -Math.PI / 2, 0]} position={[20, 0, -.6]}/>
        </>
    )
}

export {Car}