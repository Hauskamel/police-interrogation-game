import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState, useCallback } from "react";

import {
  gameStates,
  useGameStore,
  useCarStore,
  useNpcStore
} from "./store";
import { entry1Coordinates } from "./utils/streetbayEntries/streetbayEntry.js";

import { Road } from "./components/Road";
import { Car } from "./components/Car";
import { Policeman } from "./components/Policeman";
import { Streetbay } from "./components/Streetbay";
import { DocumentManager } from "./components/manager/DocumentManager";
import { Notebook } from "./components/manager/Notebook.jsx";
import { Policeradio } from "./components/manager/Policeradio/Policeradio.jsx";
import { Startmenu } from "./components/Startmenu";
import { CarControlTextbox } from "./components/textboxes/CarControlTextbox";
import { CarAndDriverProfileTextbox } from "./components/textboxes/CarAndDriverProfileTextbox";

import "./../assets/css/App.css";
import { generateUUID, randInt } from "three/src/math/MathUtils.js";
import { generateDriverProfile } from "./utils/generateDriverProfile.js";
import { generateCarProfile } from "./utils/generateCarProfile.js";
import { generateWantedListProfiles } from "./utils/generateWantedListProfiles.js";

// --- Configurations ---
const POLICEMAN_POSITION = [8, 0.5, -4];
const STOPPED_CAR_Z = -3;

// --- Custom Hooks ---
// Handles wanted list logic
function useWantedList(gameState) {
  const setWantedList = useNpcStore((state) => state.setWantedList);
  useEffect(() => {
    if (gameState === gameStates.GAME) {
      setWantedList(generateWantedListProfiles());
    }
  }, [gameState, setWantedList]);
}

// Handles car spawning logic
function useCarSpawner(wantedList) {
  const addCar = useCarStore((state) => state.addCar);

  useEffect(() => {
    const respawnTime = randInt(2000, 5000);
    const intervalId = setInterval(() => {
      const spawnWanted = Math.random() < 0.5;
      let newCar;
      if (spawnWanted && wantedList.length) {
        const criminal =
          wantedList[Math.floor(Math.random() * wantedList.length)];
        newCar = { ...criminal, id: generateUUID(), stopped: false };
      } else {
        newCar = {
          id: generateUUID(),
          stopped: false,
          driverProfile: generateDriverProfile(),
          carProfile: generateCarProfile(),
        };
      }
      addCar(newCar);
    }, respawnTime);

    return () => clearInterval(intervalId);
  }, [addCar, wantedList]);
}

// Handles selection and stopping logic
function useCarSelection(cars, selectedCar, setSelectedCar) {
  const [stoppedCar, setStoppedCar] = useState(null);

  useEffect(() => {
    const carStopped = cars.find((car) => car.stopped);
    setStoppedCar(carStopped || null);

    // Deselect car if passed entry or not the stopped car
    if (
      selectedCar &&
      selectedCar.position &&
      selectedCar.position.x < entry1Coordinates[0] &&
      selectedCar.id !== carStopped?.id
    ) {
      setSelectedCar(null);
    }
  }, [cars, selectedCar, setSelectedCar]);

  return stoppedCar;
}

// Handles refs for cars
function useCarRefs(cars) {
  const carRefs = useRef({});
  useEffect(() => {
    cars.forEach((car) => {
      if (!carRefs.current[car.id]) {
        carRefs.current[car.id] = { current: null };
      }
    });
  }, [cars]);
  return carRefs;
}

function App() {
  // Zustand stores
  const cars = useCarStore((state) => state.cars);
  const setSelectedCar = useCarStore((state) => state.setSelectedCar);
  const selectedCar = useCarStore((state) => state.selectedCar);
  const gameState = useGameStore((state) => state.gameState);
  const wantedList = useNpcStore((state) => state.wantedList);

  // Local state
  const [hoveringCar, setHoveringCar] = useState(false);

  // --- Hooks ---
  useWantedList(gameState);
  useCarSpawner(wantedList);
  const stoppedCar = useCarSelection(cars, selectedCar, setSelectedCar);
  const carRefs = useCarRefs(cars);

  // --- Handlers ---
  const handleHoverChange = useCallback(
    (carId) => setHoveringCar(carId || false),
    []
  );

  // --- Render ---
  return (
    <div className={`h-full ${hoveringCar ? "cursor-pointer" : ""}`}>
      <Canvas camera={{ position: [7, 14, -16], fov: 70 }}>
        <axesHelper />
        <OrbitControls />
        <ambientLight />
        <directionalLight position={[5, 5, 5]} />

        <Road />
        <Streetbay />
        <Policeman position={POLICEMAN_POSITION} />

        {cars.map((car) => (
          <Car
            key={car.id}
            ref={carRefs.current[car.id]}
            car={car}
            onHoverChange={(hovering) => handleHoverChange(hovering ? car.id : null)}
          />
        ))}
      </Canvas>

      <Startmenu />

      {gameState === gameStates.GAME && (
        <>
          <Notebook />
          <Policeradio />
        </>
      )}

      {selectedCar && (
        <>
          <CarControlTextbox
            selectedCar={selectedCar}
            onClose={() => setSelectedCar(null)}
          />
          {stoppedCar && stoppedCar.position.z === STOPPED_CAR_Z && (
            <>
              <CarAndDriverProfileTextbox
                selectedCar={selectedCar}
                stoppedCar={stoppedCar}
              />
              <DocumentManager selectedCar={selectedCar} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;