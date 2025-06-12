import {useGLTF, Html} from "@react-three/drei";
import {useCallback, useMemo, useRef} from "react";
import * as THREE from "three";
import PropTypes from "prop-types";

import {useCarStore} from "../store.js";
import { entry1Coordinates } from '../utils/streetbayEntries/streetbayEntry.js';
import { CarOccupantsInformationTextbox } from "./textboxes/CarOccupantsInformationTextbox.jsx";

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




function Car ({ car, onHoverChange }) {
    const gltf = useGLTF("/models/car.glb");
    const scene = useClonedScene(gltf);
    const carRef = useRef(null);


    const selectedCar = useCarStore((state) => state.selectedCar)
    const removeCar = useCarStore((state) => state.removeCar);

    const setSelectedCar = useCarStore((state) => state.setSelectedCar);
    const stoppedCar = useCarStore((state) => state.cars.find(car => car.stopped));


    let occupants;
    if (stoppedCar?.position.z !== -3 || !stoppedCar) {
        occupants = (
            <CarOccupantsInformationTextbox />
        )
    } else {
        occupants = (
            <CarOccupantsInformationTextbox
                selectedCar={selectedCar}
                stoppedCar={stoppedCar}
            />
        )
    }


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
        if (car.position?.x > entry1Coordinates[0]) {
            setSelectedCar(car)
            // onSelect?.(car);
            // setSelectedCar(car.id);
        };
    }, [car, setSelectedCar]);


    // useVehicleAnimation hook for vehicle animation (driving, stopping,...)
    useVehicleAnimation(car, carRef, removeCar);
    

    return (
        <>
            {selectedCar && car.id === selectedCar.id &&
                <Html position={car.position ? [car.position.x, car.position.y ?? 7.5, car.position.z ?? 0] : [0,0,0]}>
                    {occupants}
                </Html>
            }
            
            
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
    // onSelect: PropTypes.func,
    onHoverChange: PropTypes.func,
    
}

Car.defaultProps = {
    // onSelect: null,
    onHoverChange: null,
    
    position: DEFAULT_POSITION,
    rotation: DEFAULT_ROTATION
}

export { Car }
