import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei"

import { useCarRefs } from "../hooks/useCarRefs";

import { useCarStore } from "../store";

import { Car } from "../components/Car";

import { PoliceCar } from "../components/PoliceCar";
import { BorderStation } from "./BorderStation";

import { DEFAULT_POSITION_L_LANE1, POLICECAR_POSITION } from "../config/positions";

function setPosition (car) {
    let position;

    if (car.spawn.direction === "left") {
        const yz = [0, -70]; // y and z position
        
        switch (car.spawn.lane) {
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

    return position
}


export function Gamecanvas({playersPoliceCar, setHoveringCar}) {
    const cars = useCarStore((state) => state.cars);
    const carRefs = useCarRefs(cars);

    return (
        <div className="w-screen h-screen -z-1">
            <Canvas camera={{position: [7, 14, -16], fov: 70}}>
            {/* UTIL COMPONENTS */}
            <axesHelper/>
            <OrbitControls/>
            {/* LIHGTS */}
            <ambientLight/>
            <directionalLight position={[5, 5, 5]} />

            {/* GAME COMPONENTS */}
            <BorderStation />
            <PoliceCar
                position={POLICECAR_POSITION}
                onHoverChange={(hovering) => setHoveringCar(hovering ? playersPoliceCar?.id  : null)}
                isPlayersCar={true} 
            />
            
            {cars.map((car) => {
                const spawnPosition = setPosition(car);

                console.log(spawnPosition);
                

                return (
                    <Car
                        key={car.id}
                        ref={carRefs}
                        car={car}
                        onHoverChange={(hovering) => setHoveringCar(hovering ? car.id : null)}
                        position={ spawnPosition }
                    />
                );
            })}
            </Canvas>
        </div>
        

    )
}