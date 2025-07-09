import {useGLTF, Html} from "@react-three/drei";
import {useMemo, useRef} from "react";
import PropTypes from "prop-types";

import { DEFAULT_POSITION, DEFAULT_ROTATION, POLICE_CHECKPOINT } from "../config/positions.js";

import {useCarStore} from "../store.js";
import { CarOccupantsInformationTextbox } from "./textboxes/CarOccupantsInformationTextbox.jsx";

// ######## HOOKS ########
// #######################
import { useVehicleAnimation } from "../hooks/useVehicleAnimation.jsx";
import { useVehicleInteraction } from "../hooks/useVehicleInteraction.jsx"


function useClonedScene (gltf) {
    // using memo to prevent unnecessary recoloring of the scene (car model)
    return useMemo(() => gltf.scene.clone(), [gltf.scene]);
}

function CarOccupants ({stoppedCar, selectedCar}) {
    if (!stoppedCar ||stoppedCar?.position.z !== POLICE_CHECKPOINT) {
        return <CarOccupantsInformationTextbox />
    } 
    return <CarOccupantsInformationTextbox selectedCar={selectedCar} stoppedCar={stoppedCar} />
}


function Car ({ car, onHoverChange }) {
    const gltf = useGLTF("/models/car.glb");
    const scene = useClonedScene(gltf);

    // ##################################################
    // ##################### STATES #####################
    // cars
    const stoppedCar = useCarStore((state) => state.cars.find(car => car.stopped));
    const selectedCar = useCarStore((state) => state.selectedCar)
    const removeCar = useCarStore((state) => state.removeCar);

    const carRef = useRef(null);


    // handles pointerOver, pointerOut and click on the vehicle
    const { handlePointerOver, handlePointerOut, handleClick } = useVehicleInteraction(car, onHoverChange)
    // hook for vehicle animation (driving, stopping, following curve path, ...)
    useVehicleAnimation(car, carRef, removeCar);

    

    return (
        <>
            {selectedCar && car.id === selectedCar.id && (
                <Html position={car.position ? [car.position.x, car.position.y ?? 7.5, car.position.z ?? 0] : [0,0,0]}>
                    <CarOccupants stoppedCar={stoppedCar} selectedCar={selectedCar} />
                </Html>
            )}
            
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
    onHoverChange: PropTypes.func,
    
}

Car.defaultProps = {
    onHoverChange: null,
    position: DEFAULT_POSITION,
    rotation: DEFAULT_ROTATION
}

export { Car }
