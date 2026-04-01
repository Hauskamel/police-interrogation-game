import {useGLTF, Html} from "@react-three/drei";
import {useEffect, useMemo, useRef} from "react";

import { getRandomVehicleModel } from "../utils/getter/getRandomVehicleModel.js";
import { getRandomVehicleGlb } from "../utils/getter/getRandomVehicleGlb.js";


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
    if (!stoppedCar) {
        return <CarOccupantsInformationTextbox />
    } 
    return <CarOccupantsInformationTextbox stoppedCar={stoppedCar} />
}


export function Car ({ car, onHoverChange, position, rotation }) {
    const gltf = useGLTF("/models/npc-vehicles/cars/car3.glb");


    const vehicleGlb = getRandomVehicleGlb();

    console.log(vehicleGlb);
    



    











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
        [car.position.x, car.position.y, car.position.z]
        : [0,0,0]

    return (
        <>
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

