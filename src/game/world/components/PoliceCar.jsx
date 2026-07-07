import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { generateUUID } from "three/src/math/MathUtils.js";
import { useVehicleInteraction } from "@game/vehicles/hooks";
import { useCarStore } from "@stores";

export const PoliceCar = ({ position, onHoverChange }) => {
    const { scene } = useGLTF("/models/murphy_97_cruiser.glb");
    const policecarRef = useRef();

    const playersPoliceCar = useCarStore(state => state.playersPoliceCar)
    const setPlayersPoliceCar = useCarStore(state => state.setPlayersPoliceCar)
    const { handlePointerOver, handlePointerOut, handleClick } = useVehicleInteraction(playersPoliceCar, onHoverChange);

    const positionX = position[0];
    const positionY = position[1];
    const positionZ = position[2];
    
    useEffect(() => {
        if (playersPoliceCar === undefined) {
            const car = setupPlayersPoliceCar();
            setPlayersPoliceCar(car);
        }

        function setupPlayersPoliceCar () {
            const car = {
                id: generateUUID()
            }
            
            return car
        }
    }, [setPlayersPoliceCar, playersPoliceCar])
    
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
