import { useEffect } from "react";
import {
    commitTrafficEntityRecords,
    getActiveTrafficIdentityExclusions,
    useControlScenarioStore,
    useNpcStore,
    useTrafficStore
} from "@stores";
import { generateTrafficEntity } from "../generators";
import { getUnavailableControlScenarioTypes } from "../utils";

// ##### Traffic Entity Spawner Hook
// -----> Erzeugt in einem Intervall neue TrafficEntities und legt sie in den Traffic Store.
// ---> Der Hook entscheidet nur wann/wo gespawned wird, nicht welche NPC-Daten entstehen.
export function useTrafficEntitySpawner({
    direction,
    lane,
    enabled = true,
    minRespawnTime = 5000,
    maxRespawnTime = 10000,
    maxTrafficEntities = 8,
    storyChance = 0.25
} = {}) {
    const addTrafficEntity = useTrafficStore((state) => state.addTrafficEntity);
    const criminalDatabase = useNpcStore((state) => state.criminalDatabase);

    useEffect(() => {
        if (!enabled || !direction || lane === undefined) return;

        let timeoutId;
        let cancelled = false;

        const scheduleNextSpawn = () => {
            timeoutId = window.setTimeout(
                spawnTrafficEntity,
                randomInteger(minRespawnTime, maxRespawnTime)
            );
        };

        const spawnTrafficEntity = () => {
            if (cancelled) return;
            if (useTrafficStore.getState().trafficEntities.length >= maxTrafficEntities) {
                scheduleNextSpawn();
                return;
            }

            // NPC, Fahrzeug, Wahrheit und Polizeiwissen entstehen im Traffic Generator.
            const identityExclusions = getActiveTrafficIdentityExclusions(
                useTrafficStore.getState()
            );
            const controlScenario = Math.random() < storyChance
                ? useControlScenarioStore.getState().selectNextScenario({
                    excludedTypes: getUnavailableControlScenarioTypes({
                        criminalDatabase,
                        ...identityExclusions
                    })
                })
                : null;
            const newEntity = generateTrafficEntity({
                criminalDatabase,
                ...identityExclusions,
                controlScenario
            });
            if (!newEntity) {
                scheduleNextSpawn();
                return;
            }

            // Spawn-Daten gehören zur Weltposition und werden deshalb erst hier ergänzt.
            const committedEntity = commitTrafficEntityRecords({
                ...newEntity,
                spawn: { direction, lane }
            });

            if (!committedEntity) {
                scheduleNextSpawn();
                return;
            }

            const storedEntity = addTrafficEntity(committedEntity);
            if (!storedEntity) {
                scheduleNextSpawn();
                return;
            }

            scheduleNextSpawn();
        };

        scheduleNextSpawn();

        return () => {
            cancelled = true;
            window.clearTimeout(timeoutId);
        };
    }, [addTrafficEntity, criminalDatabase, direction, enabled, lane, maxRespawnTime, maxTrafficEntities, minRespawnTime, storyChance]);
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
