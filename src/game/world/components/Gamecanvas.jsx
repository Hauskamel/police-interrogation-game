import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei"
import { Suspense } from "react";

import { useTrafficStore } from "@stores";
import { getTrafficSpawnTransform } from "@game/world/spawn";
import { POLICECAR_POSITION } from "../config";

import { useTrafficEntityRefs } from "../hooks";

import { Car } from "./Car";
import { BorderStation } from "./BorderStation";
import { PoliceCar } from "./PoliceCar";
import { TrafficRouteVisualizer } from "./TrafficRouteVisualizer";


export function Gamecanvas({ playersPoliceVehicle, setHoveringCar }) {
    const trafficEntities = useTrafficStore((state) => state.trafficEntities);
    const trafficEntityRefs = useTrafficEntityRefs(trafficEntities);

    return (
        <div className="w-screen h-screen -z-1">
            <Canvas shadows camera={{position: [-30, 20, 10], fov: 70}}>
                {/* UTIL COMPONENTS */}
                <axesHelper args={[10]} />
                <OrbitControls/>
                {/* LIHGTS */}
                <ambientLight intensity={2.5} />
                <directionalLight position={[10,10,10]} intensity={2.5} />



                {/* INGAME COMPONENTS */}
                <BorderStation receiveShadow />
                <TrafficRouteVisualizer trafficEntities={trafficEntities} />
                <PoliceCar
                    castShadow
                    position={POLICECAR_POSITION}
                    onHoverChange={(hovering) => setHoveringCar(hovering ? playersPoliceVehicle?.id : null)}
                    isPlayersCar={true}
                />
                
                {trafficEntities.map((trafficEntity) => {
                    const { position, rotation } = getTrafficSpawnTransform(trafficEntity);
                    
                    return (
                        <Suspense fallback={null} key={trafficEntity.id}>
                            <Car
                                castShadow
                                ref={trafficEntityRefs}
                                car={trafficEntity}
                                onHoverChange={(hovering) => setHoveringCar(hovering ? trafficEntity.id : null)}
                                position={ position }
                                rotation={ rotation }
                            />
                        </Suspense>
                    );
                })}
            </Canvas>
        </div>
    )
}
