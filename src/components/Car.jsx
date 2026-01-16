import {useGLTF, Html} from "@react-three/drei";
import {useMemo, useRef} from "react";
import PropTypes from "prop-types";

import { DEFAULT_POSITION_L_LANE1, DEFAULT_ROTATION, POLICE_CHECKPOINT } from "../config/positions.js";

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

function CarOccupantsInfoTextbox ({stoppedCar}) {
    const selectedCar = useCarStore(state => state.selectedCar);

    if (!stoppedCar || stoppedCar?.position.z !== POLICE_CHECKPOINT) {
        return <CarOccupantsInformationTextbox />
    } 
    return <CarOccupantsInformationTextbox stoppedCar={stoppedCar} />
}


function Car ({ car, onHoverChange, position, rotation }) {
    const gltf = useGLTF("/models/low-poly-car.glb");
    const scene = useClonedScene(gltf);

    // ##################################################
    // ##################### STATES #####################
    // cars
    const stoppedCar = useCarStore((state) => state.cars.find(car => car.stopped));
    const selectedCar = useCarStore((state) => state.selectedCar);
    const carRef = useRef(null);

    // handles pointerOver, pointerOut and click on the vehicle
    const { handlePointerOver, handlePointerOut, handleClick } = useVehicleInteraction(car, onHoverChange);
    // hook for vehicle animation (driving, stopping, following curve path, ...)
    useVehicleAnimation(car, carRef);
    
    const carOccupantsTextboxPosition = car.position ? 
        [car.position.x, car.position.y ?? 7.5, car.position.z ?? 0]
        : [0,0,0]

    return (
        <>
            {selectedCar && car.id === selectedCar.id && (
                <Html position={carOccupantsTextboxPosition}>
                    <CarOccupantsInfoTextbox stoppedCar={stoppedCar} />
                </Html>
            )}
            
            {/* car */}
            <primitive
                object={ scene }
                ref={ carRef }
                rotation={ rotation }
                position={ position }
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
    position: DEFAULT_POSITION_L_LANE1,
    rotation: DEFAULT_ROTATION
}

export { Car }
