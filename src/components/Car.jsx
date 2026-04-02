import { useGLTF } from "@react-three/drei";
import { useRef, useState } from "react";

import { useVehicleAnimation } from "../hooks/useVehicleAnimation.jsx";
import { useVehicleInteraction } from "../hooks/useVehicleInteraction.jsx"
import { getVehicleGlb } from "../utils/getter/getVehicleGlb.js";

import { useClonedScene } from "../hooks/useClonedScene.jsx";


export function Car ({ car, onHoverChange, position, rotation }) {
    const [vehicleGlb] = useState(() => getVehicleGlb(car));
    console.log(vehicleGlb);
    
    const gltf = useGLTF("/models/npc-vehicles/cars/" + vehicleGlb + ".glb");
    console.log("/models/npc-vehicles/cars/" + vehicleGlb + ".glb");
    
    const scene = useClonedScene(gltf);
    const carRef = useRef(null);

    const { handlePointerOver, handlePointerOut, handleClick } = useVehicleInteraction(car, onHoverChange); // handles pointerOver, pointerOut and click on the vehicle
    useVehicleAnimation(car, carRef); // hook for vehicle animation (driving, stopping, following curve path, ...)
    
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

