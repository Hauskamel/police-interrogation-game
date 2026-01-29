import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei"

import { useCarStore } from "../store";
import { getVehicleSpawnPosition } from "../utils/getVehicleSpawnPosition";
import { POLICECAR_POSITION } from "../config/positions";

import { useCarRefs } from "../hooks/useCarRefs";

import { Car } from "../components/Car";
import { BorderStation } from "./BorderStation";
import { PoliceCar } from "../components/PoliceCar";


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
                    const { position, rotation } = getVehicleSpawnPosition(car);
                    
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