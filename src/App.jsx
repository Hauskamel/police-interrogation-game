import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei"
import {createRef, useEffect, useRef, useState} from "react";

import {gameStates, useGameStore, useCarStore, useNpcStore} from "./store";
import {entry1Coordinates} from './utils/streetbayEntries/streetbayEntry.js'

import { Road } from "./components/Road";
import { Car } from "./components/Car";
import { Policeman } from "./components/Policeman";
import { Streetbay } from "./components/Streetbay";
import { DocumentManager } from "./components/manager/DocumentManager";
import { Notebook } from "./components/manager/Notebook.jsx";
import { Policeradio } from "./components/manager/Policeradio/Policeradio.jsx";
import { useCarSpawner } from "./hooks/useCarSpawner.jsx"

import './../assets/css/App.css'

import { Startmenu } from "./components/Startmenu";
import { CarControlTextbox } from "./components/textboxes/CarControlTextbox";
import { CarAndDriverProfileTextbox } from "./components/textboxes/CarAndDriverProfileTextbox";

import { generateWantedListProfiles } from "./utils/generateWantedListProfiles.js";



function App() {
    // ##################################################
    // ##################### STATES #####################
    const gameState = useGameStore((state) => state.gameState)

    // cars
    const cars = useCarStore((state) => state.cars);
    const setSelectedCar = useCarStore(state => state.setSelectedCar)
    const selectedCar = useCarStore(state => state.selectedCar)

    const setStoppedCar = useCarStore(state => state.setStoppedCar);
    const stoppedCar = useCarStore(state => state.stoppedCar)

    // wanted list
    const setWantedList = useNpcStore((state) => state.setWantedList)
    const wantedList = useNpcStore((state) => state.wantedList)

    // NOTE: das ist ein local State - deshalb kein store.js nötig
    const [hoveringCar, setHoveringCar] = useState(false);

    

    // ##################################################
    // ################### REFERENCES ###################
    const carRefs = useRef({});



    // creates wanted list profiles
    useEffect(() => {
        if (gameState === gameStates.GAME) {
            setWantedList(generateWantedListProfiles())
        }   
    }, [gameState, setWantedList])


    // hook to spawn car 
    useCarSpawner(wantedList);
    

    

    // effect for making car (not) selectable
    useEffect(() => {
        
        
        


        // NOTE: wenn ein Fahrzeug angehalten wird (es wird selected -> dann gestopped) und dann auf ein anderes Auto selected wird, kann nicht mehr
        // auf das gestoppte Auto zurückselected werden
        if (!selectedCar || !selectedCar) return;

        if (cars.find(car => car.stopped)) setStoppedCar(cars.find(car => car.stopped))
            console.log(stoppedCar);

        // check if car has passed first bay entry point AND the selected Car is NOT the stopped car to make the stopped car still clickable
        if ((selectedCar.position.x < entry1Coordinates[0]) && (selectedCar.id !== stoppedCar?.id)) {
            // resets selected car
            setSelectedCar(null);
            selectedCar(null);
            return;
        }
    }, [cars, selectedCar, stoppedCar]);




    

    // ##################################################
    // ############# RENDERED HTML COMPONENT ############
    return (
        <div className={`h-full ${hoveringCar ? 'cursor-pointer' : ''}` }>
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
                <Policeman position={[8,.5,-4]} />

                {cars.map((car) => {
                    // if no refference on a car id in the "cars" store (store.js) exists, create a new reference to that id
                    if (!carRefs.current[car.id]) {
                        carRefs.current[car.id] = createRef();
                    }

                    return (
                        <Car
                            key={car.id}
                            ref={carRefs.current[car.id]}
                            car={car}
                            onHoverChange={(hovering) => setHoveringCar(hovering ? car.id : null)}
                        />
                    );
                })}

            </Canvas>
            <Startmenu />

            {gameState === gameStates.GAME && 
            <>
                <Notebook />
                <Policeradio />
            </>
            }

            {/* Todo: Textbox fade-out animation onClose after car reaches police checkpoint */}
            {selectedCar && (
                <>
                    <CarControlTextbox
                        selectedCar={selectedCar}
                        onClose={() => setSelectedCar(null)}
                    />
                    

                    {/* TODO: -3 ist die z-Position vom Policeman, müsste ausgelagert werden in eine Config Datei */}
                    {/* NOTE: -3 ist die Z-Koordinate des Autos, wenn es hält (siehe 'CatmullRomCurve3' in Car.jsx) */}
                    {/* Junge, was jez */}
                    {stoppedCar && stoppedCar.position.z === -3 && (
                        <>
                            {/* TODO: Brauchen wir diese Box in Zukunft? Soll sich der Spieler die Infos merken? */}
                            <CarAndDriverProfileTextbox
                                selectedCar={selectedCar}
                                stoppedCar={cars.find(car => car.stopped)}
                            />

                            <DocumentManager selectedCar={selectedCar} />

                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default App;