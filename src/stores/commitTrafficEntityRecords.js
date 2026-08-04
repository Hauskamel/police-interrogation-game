import { registerTrafficEntityOfficialRecords } from "./officialRegistryStore.js";
import { registerTrafficEntityWorldTruth } from "./worldTruthStore.js";
import {
    hasActiveTrafficIdentityConflict,
    useTrafficStore
} from "./trafficStore.js";

// ##### Traffic Entity Record Commit
// -----> Schreibt die vorbereiteten Records erst am erfolgreichen Spawn in ihre fachlichen Stores.
// ---> Die TrafficEntity selbst behaelt danach nur ihre Profile und relationalen Referenzen.
export function commitTrafficEntityRecords(trafficEntity, options = {}) {
    const trafficState = useTrafficStore.getState();
    if (
        hasActiveTrafficIdentityConflict(
            trafficState,
            trafficEntity,
            options.ignoreTrafficEntityId
        )
    ) {
        return null;
    }

    const normalizedTrafficEntity = registerTrafficEntityWorldTruth(trafficEntity);

    registerTrafficEntityOfficialRecords(normalizedTrafficEntity);

    return normalizedTrafficEntity;
}
