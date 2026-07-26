import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { generateUUID } from "three/src/math/MathUtils.js";
import { useVehicleInteraction } from "@game/vehicles/hooks";
import { useTrafficStore } from "@stores";

export const PoliceCar = ({ position, onHoverChange }) => {
    const { scene } = useGLTF("/models/murphy_97_cruiser.glb");
    const policecarRef = useRef();

    const playerPoliceVehicle = useTrafficStore(state => state.playerPoliceVehicle)
    const setPlayerPoliceVehicle = useTrafficStore(state => state.setPlayerPoliceVehicle)
    const { handlePointerOver, handlePointerOut, handleClick } = useVehicleInteraction(playerPoliceVehicle, onHoverChange);

    const positionX = position[0];
    const positionY = position[1];
    const positionZ = position[2];
    
    useEffect(() => {
        if (playerPoliceVehicle === undefined) {
            const vehicle = setupPlayerPoliceVehicle();
            setPlayerPoliceVehicle(vehicle);
        }

        function setupPlayerPoliceVehicle () {
            const vehicle = {
                id: generateUUID()
            }
            
            return vehicle
        }
    }, [setPlayerPoliceVehicle, playerPoliceVehicle])
    
    return (
        <primitive 
            object={ scene } 
            ref={policecarRef}
            position={ [ positionX, positionY, positionZ] }
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={ handleClick }
        />
    )
}
