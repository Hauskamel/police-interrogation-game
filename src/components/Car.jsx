import {useGLTF} from "@react-three/drei";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import PropTypes from "prop-types";

import {useCarStore} from "../store.js";
import { entry1Coordinates, streetbayEntry } from '../utils/streetbayEntries/streetbayEntry.js';

// ######## HOOKS ########
// #######################
import { useVehicleAnimation } from "../hooks/useVehicleAnimation.jsx";

function useClonedScene (gltf) {
    // using memo to prevent unnecessary recoloring of the screen
    return useMemo(() => gltf.scene.clone(), [gltf.scene]);
}

// ######## constants ########
// ###########################
const DEFAULT_POSITION = new THREE.Vector3(35, 0, -0.6);
const DEFAULT_ROTATION = new THREE.Euler(0, -Math.PI / 2, 0);


function Car ({ car, onSelect, onHoverChange, stoppedCar }) {
    const gltf = useGLTF("/models/car.glb");

    const scene = useClonedScene(gltf);
    const carRef = useRef();

    const removeCar = useCarStore((state) => state.removeCar);
    const updateCarPosition = useCarStore((state) => state.updateCarPosition);
    const updateStoppedCarPosition = useCarStore((state) => state.updateStoppedCarPosition);


    // useVehicleAnimation hook for vehicle animation (driving, stopping,...)
    useVehicleAnimation(car, carRef, updateCarPosition, updateStoppedCarPosition, removeCar);


    const handlePointerOver = useCallback((e) => {
        e.stopPropagation();
        onHoverChange?.(true);
    }, [onHoverChange]);

    const handlePointerOut = useCallback((e) => {
        e.stopPropagation();
        onHoverChange?.(false);
    }, [onHoverChange]);

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        if (stoppedCar || car.position?.x > entry1Coordinates[0]) {
            onSelect?.(car);
        };
    }, [car, stoppedCar, onSelect]);

    return (
        <>    
            {/* car */}
            <primitive
                object={ scene }
                ref={ carRef }
                rotation={ DEFAULT_ROTATION }
                position={ DEFAULT_POSITION }
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onClick={ handleClick }
            />
        </>
    )
}



// Define PropTypes for Car component
Car.propTypes = {
    car: PropTypes.shape({
        id: PropTypes.string.isRequired,
        stopped: PropTypes.bool.isRequired,
        position: PropTypes.shape({
            x: PropTypes.number.isRequired
        })
    }).isRequired,
    onSelect: PropTypes.func,
    onHoverChange: PropTypes.func,
    stoppedCar: PropTypes.object
}

Car.defaultProps = {
    onSelect: null,
    onHoverChange: null,
    stoppedCar: null,
    position: DEFAULT_POSITION,
    rotation: DEFAULT_ROTATION
}

export { Car }