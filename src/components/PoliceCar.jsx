import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

import { generateUUID } from "three/src/math/MathUtils.js";

import { useVehicleInteraction } from "../hooks/useVehicleInteraction.jsx";

import {useCarStore} from "../store.js";

export const PoliceCar = ({ position, onHoverChange, isPlayersCar }) => {
    const { scene } = useGLTF("/models/police-car.glb");
    const policecarRef = useRef();

    const playersPoliceCar = useCarStore(state => state.playersPoliceCar)
    const setPlayersPoliceCar = useCarStore(state => state.setPlayersPoliceCar)


    useEffect(() => {
        if (!playersPoliceCar) {
            const car = setupPlayersPoliceCar()
            console.log(car);
            
            setPlayersPoliceCar(car)
        }

        function setupPlayersPoliceCar () {
            const car = {
                id: generateUUID()
            }
            
            return car
        }

        console.log("players police car: ", playersPoliceCar);
        

    }, [setPlayersPoliceCar, playersPoliceCar])
    

    
    const { handlePointerOver, handlePointerOut, handleClick } = useVehicleInteraction(playersPoliceCar, onHoverChange)


    const positionX = position[0]
    const positionY = position[1];
    const positionZ = position[2];
    
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