import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei"

import { Road } from "../components/Road";
import { Car } from "../components/Car";
import { Policeman } from "../components/Policeman";
import { Streetbay } from "../components/Streetbay";

import { PoliceCar } from "../components/PoliceCar";

import { POLICEMAN_POSITION, POLICECAR_POSITION } from "../config/positions";

export function Gamecanvas({playersPoliceCar, cars, carRefs, setHoveringCar}) {
    return (
        <div className="w-screen h-screen -z-1">
            <Canvas camera={{position: [7, 14, -16], fov: 70}}>
            {/* UTIL COMPONENTS */}
            <axesHelper/>
            <OrbitControls/>
            {/* LIHGTS */}
            <ambientLight/>
            <directionalLight position={[5, 5, 5]}/>
            {/* GAME COMPONENTS */}
            <Road />
            <Streetbay />
            <Policeman 
                position={POLICEMAN_POSITION} 
            />
            <PoliceCar
                position={POLICECAR_POSITION}
                onHoverChange={(hovering) => setHoveringCar(hovering ? playersPoliceCar?.id  : null)}
                isPlayersCar={true}
                
            />
            
            {cars.map((car) => {
                return (
                    <Car
                        key={car.id}
                        ref={carRefs}
                        car={car}
                        onHoverChange={(hovering) => setHoveringCar(hovering ? car.id : null)}
                    />
                );
            })}
            </Canvas>
        </div>
        

    )
}