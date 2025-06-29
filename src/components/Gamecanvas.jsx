import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei"

import { Road } from "../components/Road";
import { Car } from "../components/Car";
import { Policeman } from "../components/Policeman";
import { Streetbay } from "../components/Streetbay";
import { POLICEMAN_POSITION } from "../config/positions";

export function Gamecanvas({cars, carRefs, setHoveringCar}) {
    return (
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
            <Policeman position={POLICEMAN_POSITION} />
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
    )
}