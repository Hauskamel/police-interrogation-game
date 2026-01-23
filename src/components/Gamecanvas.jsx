import * as THREE from "three";

import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei"
import { useCarRefs } from "../hooks/useCarRefs";

import { useCarStore } from "../store";
import { Car } from "../components/Car";
import { PoliceCar } from "../components/PoliceCar";
import { BorderStation } from "./BorderStation";
import { POLICECAR_POSITION } from "../config/positions";

function setPosition (car) {
    let position, rotation;

    if (car.spawn.direction === "left") {
        rotation = new THREE.Euler(0, Math.PI, 0);
        const yz = [0, -70]; // y and z position
        
        switch (car.spawn.lane) {
            // spawning at police lane
            case 0:
                position = [-10, ...yz];
            case 1:            
                position = [.5, ...yz];
            break;
            case 2:
                position = [6, ...yz];
            break;
            case 3:
                position = [11, ...yz];
            break;
        }

    } else if (car.spawn.direction === "right") {
        rotation = new THREE.Euler(0, 0, 0);
        const yz = [0, 70]; // y and z position
        
        switch (car.spawn.lane) {
            case 1:            
                position = [20, ...yz];
            break;
            case 2:
                position = [23, ...yz];
            break;

            case 3:
                position = [28, ...yz];
            break;
        }
    } else {
        return;
    }

    return { position, rotation }
}


export function Gamecanvas({playersPoliceCar, setHoveringCar}) {
    const cars = useCarStore((state) => state.cars);
    const carRefs = useCarRefs(cars);

    return (
        <div className="w-screen h-screen -z-1">
            <Canvas camera={{position: [-30, 20, 10], fov: 70}}>
            {/* UTIL COMPONENTS */}
            <axesHelper args={[10]} />
            <OrbitControls/>
            {/* LIHGTS */}
            <ambientLight/>
            <directionalLight position={[5, 5, 5]} />

            {/* GAME COMPONENTS */}
            <BorderStation />
            <PoliceCar
                position={POLICECAR_POSITION}
                onHoverChange={(hovering) => setHoveringCar(hovering ? playersPoliceCar?.id : null)}
                isPlayersCar={true}
            />
            
            {cars.map((car) => {
                const {position, rotation } = setPosition(car);
                
                return (
                    <Car
                        key={car.id}
                        ref={carRefs}
                        car={car}
                        onHoverChange={(hovering) => setHoveringCar(hovering ? car.id : null)}
                        position={ position }
                        rotation={ rotation }
                    />
                );
            })}
            </Canvas>
        </div>
        

    )
}