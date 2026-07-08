import { useCallback, useEffect, useRef } from "react";

import { gameStates, useCarStore, useGameStore } from "@stores";
import { randomNpcWithVehicleGenerator } from "@game/world/generators";
import { TRAFFIC_MAX_CARS, TRAFFIC_SPAWN_INTERVAL_MS } from "@game/world/config";

const TRAFFIC_DIRECTIONS = ["left", "right"];
const TRAFFIC_LANES = [1, 2, 3];

function getRandomTrafficSpawn() {
    return {
        direction: TRAFFIC_DIRECTIONS[Math.floor(Math.random() * TRAFFIC_DIRECTIONS.length)],
        lane: TRAFFIC_LANES[Math.floor(Math.random() * TRAFFIC_LANES.length)],
    };
}

export function useTrafficSpawner() {
    const addCar = useCarStore((state) => state.addCar);
    const cars = useCarStore((state) => state.cars);
    const gameState = useGameStore((state) => state.gameState);
    const spawnedInitialTrafficRef = useRef(false);

    const spawnTrafficCar = useCallback(() => {
        const newEntity = randomNpcWithVehicleGenerator();
        addCar({
            ...newEntity,
            spawn: getRandomTrafficSpawn(),
        });
    }, [addCar]);

    useEffect(() => {
        const trafficIsActive = gameState === gameStates.INGAME || gameState === gameStates.LAPTOP;

        if (!trafficIsActive || cars.length >= TRAFFIC_MAX_CARS) {
            return;
        }

        if (!spawnedInitialTrafficRef.current) {
            spawnTrafficCar();
            spawnedInitialTrafficRef.current = true;
        }

        const intervalId = window.setInterval(() => {
            if (useCarStore.getState().cars.length < TRAFFIC_MAX_CARS) {
                spawnTrafficCar();
            }
        }, TRAFFIC_SPAWN_INTERVAL_MS);

        return () => window.clearInterval(intervalId);
    }, [cars.length, gameState, spawnTrafficCar]);
}
