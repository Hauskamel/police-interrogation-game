import {useGLTF} from "@react-three/drei";
import {useMemo, useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {useCarStore} from "../store.js";

function Car ({ car, onSelect, onHoverChange }) {
    const gltf = useGLTF("/models/car.glb");
    const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
    const carRef = useRef();
    const updateCarPosition = useCarStore((state) => state.updateCarPosition);
    const tubeRef = useRef();

    const [t, setT] = useState(0);

    const {id, stopped} = car;

    const removeCar = useCarStore((state) => state.removeCar);
    const stopCar = useCarStore((state) => state.stopCar);

    // Create a Curve with the given Vector3 coordinates
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(15, 0,  -.6),
        new THREE.Vector3(13, 0,  -.6),
        new THREE.Vector3(10, 0, -3),
        new THREE.Vector3(8, 0, -3),
    ]);

    useFrame(() => {
        const carPositionX = Math.floor(carRef.current.position.x * 100) / 100
        updateCarPosition(car.id, carPositionX);

        if (!carRef.current) return;

        // TODO: coordinate needs to be more specific (for now hardcoded '15' is ok)
        if (carPositionX < 15 && stopped) {

            setT((prevT) => {
                const nextT = prevT + 0.009;
                return nextT > 1 ? 1 : nextT;
            });

            const position = curve.getPoint(t); // Get the position at t
            const tangent = curve.getTangent(t);
            const lookAtTarget = position.clone().add(tangent);

            carRef.current.position.copy(position);
            carRef.current.lookAt(lookAtTarget);

        } else {
            carRef.current.position.x -= 0.06; // car driving on road
        }

        if (carRef.current.position.x < -40) {
            removeCar(id);
        }
    });

    return (
        <>
            {/* ####################### TUBE DIENT ZUR VERANSCHAULICHUNG DER KURVE ####################### */}
            {/* ##################################### DO NOT DELETE ###################################### */}
            {/* tube*/}
            {/* <mesh ref={tubeRef}>
                <tubeGeometry args={[curve, 100, .2, 5, false]}/>
                <meshStandardMaterial color="yellow" wireframe={false}></meshStandardMaterial>
            </mesh>
            */}
            {/* car */}
            <primitive
                object={ scene }
                ref={ carRef }
                rotation={ [0, -Math.PI / 2, 0] }
                position={ [35, 0, -.6] }
                onPointerOver={(e) => {
                    e.stopPropagation();
                    onHoverChange?.(true);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    onHoverChange?.(false);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (car.positionX > 15) {
                        onSelect?.(car.id);
                    }
                }}
            />
        </>
    )
}

export { Car }
