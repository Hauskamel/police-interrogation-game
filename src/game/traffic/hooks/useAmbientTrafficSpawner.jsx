import { gameStates, useGameStore } from "@stores";

import { useTrafficEntitySpawner } from "./useTrafficEntitySpawner.jsx";

const SPAWNER_OPTIONS = {
    minRespawnTime: 3500,
    maxRespawnTime: 9000,
    maxTrafficEntities: 8,
    storyChance: 0.25
};

// Starts exactly two lanes per direction. Most cars are ordinary ambient
// traffic; only a small random share is prepared as a paced control scenario.
export function useAmbientTrafficSpawner() {
    const gameState = useGameStore((state) => state.gameState);
    const enabled = gameState === gameStates.INGAME || gameState === gameStates.LAPTOP;

    useTrafficEntitySpawner({ ...SPAWNER_OPTIONS, direction: "left", lane: 1, enabled });
    useTrafficEntitySpawner({ ...SPAWNER_OPTIONS, direction: "left", lane: 2, enabled });
    useTrafficEntitySpawner({ ...SPAWNER_OPTIONS, direction: "right", lane: 1, enabled });
    useTrafficEntitySpawner({ ...SPAWNER_OPTIONS, direction: "right", lane: 2, enabled });
}
