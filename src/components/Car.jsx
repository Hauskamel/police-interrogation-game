import {useGLTF} from "@react-three/drei";
import {useEffect, useMemo, useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {useCarStore} from "../store.js";
import { entry1Coordinates, streetbayEntry } from '../utils/streetbayEntries/streetbayEntry.js';

function Car ({ car, onSelect, onHoverChange, onAutomaticDeselect, stoppedCar }) {
    const gltf = useGLTF("/models/car.glb");
    const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
    const carRef = useRef();
    const tubeRef = useRef();

    // distance of driven curve (when entering bay) from 0 to 1
    const [t, setT] = useState(0);

    // creating object from car prop
    const {id, stopped} = car;

    const removeCar = useCarStore((state) => state.removeCar);
    const updateCarPosition = useCarStore((state) => state.updateCarPosition);
    const updateStoppedCarPosition = useCarStore((state) => state.updateStoppedCarPosition);

    // Deselect car if it passes bay entry and is not currently stopped
    useEffect(() => {
        if (!carRef.current || !onAutomaticDeselect) return;

        const carX = carRef.current.position.x;

        if (carX < entry1Coordinates[0] && !stoppedCar) {
            onAutomaticDeselect(car.id);
        }

    }, [car.id, onAutomaticDeselect, stoppedCar]);

    // animation loop
    useFrame(() => {
        // return when no refference to a car exists (no animation needed)
        if (!carRef.current) return;        

        const carPositionX = Math.floor(carRef.current.position.x * 100) / 100
        if (car.stopped) {
            // when car is stopped -> position.z is relevent to trigger 'CarAndDriverProfileTextbox'
            const carPositionZ = Math.floor(carRef.current.position.z * 100) / 100
            updateStoppedCarPosition(car.id, carPositionX, carPositionZ);
        } else {
            // when car is not stopped -> position.z is not relevant
            updateCarPosition(car.id, carPositionX);
        }
        
        // check if car passed first entry point of bay
        if (carPositionX < entry1Coordinates[0] && stopped) {
            // track driven distance of entry
            setT((prevT) => {
                const nextT = prevT + 0.009;
                return nextT > 1 ? 1 : nextT;
            });

            const position = streetbayEntry.getPoint(t); // Get the position at t
            const tangent = streetbayEntry.getTangent(t);
            const lookAtTarget = position.clone().add(tangent);

            carRef.current.position.copy(position);
            carRef.current.lookAt(lookAtTarget);

        } else {
            carRef.current.position.x -= 0.1; // car driving on road
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
                <tubeGeometry args={[streetbayEntry, 100, .2, 5, false]}/>
                <meshStandardMaterial color="yellow" wireframe={false}></meshStandardMaterial>
            </mesh> */}
            
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

                    // makes car selectable if position.x is > 15 OR the clicked car is the stopped car
                    if (car.position?.x > entry1Coordinates[0] || stoppedCar) {
                        onSelect?.(car);
                    }
                }}
            />
        </>
    )
}

export { Car }
