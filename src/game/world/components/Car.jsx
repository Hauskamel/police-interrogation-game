import { useGLTF } from "@react-three/drei";
import { useRef, useState } from "react";

import { useVehicleAnimation, useVehicleInteraction } from "../../vehicles/hooks";
import { getVehicleGlb } from "../../vehicles/utils";

import { useClonedScene } from "../hooks";


export function Car ({ car, onHoverChange, position, rotation }) {
    const [vehicleGlb] = useState(() => getVehicleGlb(car));
    const gltf = useGLTF("/models/npc-vehicles/cars/" + vehicleGlb + ".glb");
    
    const scene = useClonedScene(gltf);
    const carRef = useRef(null);

    const { handlePointerOver, handlePointerOut, handleClick } = useVehicleInteraction(car, onHoverChange); // handles pointerOver, pointerOut and click on the vehicle
    useVehicleAnimation(car, carRef); // hook for vehicle animation (driving, stopping, following curve path, ...)
    
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
