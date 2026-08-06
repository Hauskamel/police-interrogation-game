import { useEffect } from "react";
import { randInt } from "three/src/math/MathUtils.js";

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
export function useTrafficEntitySpawner({ direction, lane, enabled = true, minRespawnTime = 5000, maxRespawnTime = 10000 } = {}) {
    const addTrafficEntity = useTrafficStore((state) => state.addTrafficEntity);
    const criminalDatabase = useNpcStore((state) => state.criminalDatabase);

    useEffect(() => {
        if (!enabled || !direction || lane === undefined) return;

        const intervalId = setInterval(() => {
            // NPC, Fahrzeug, Wahrheit und Polizeiwissen entstehen im Traffic Generator.
            const identityExclusions = getActiveTrafficIdentityExclusions(
                useTrafficStore.getState()
            );
            const scenarioStore = useControlScenarioStore.getState();
            const controlScenario = scenarioStore.selectNextScenario({
                excludedTypes: getUnavailableControlScenarioTypes({
                    criminalDatabase,
                    ...identityExclusions
                })
            });
            const newEntity = generateTrafficEntity({
                criminalDatabase,
                ...identityExclusions,
                controlScenario
            });
            if (!newEntity) return;

            // Spawn-Daten gehören zur Weltposition und werden deshalb erst hier ergänzt.
            const committedEntity = commitTrafficEntityRecords({
                ...newEntity,
                spawn: { direction, lane }
            });

            if (!committedEntity) return;

            const storedEntity = addTrafficEntity(committedEntity);
            if (!storedEntity) return;

        }, randInt(minRespawnTime, maxRespawnTime));

        return () => clearInterval(intervalId);
    }, [addTrafficEntity, criminalDatabase, direction, enabled, lane, maxRespawnTime, minRespawnTime]);
}
