import {
    useControlScenarioStore,
    useInspectionStore,
    useNpcStore,
    useOfficialRegistryStore,
    useShiftStore,
    useTrafficStore
} from "@stores";
import { INSPECTION_RESOLUTION_ACTIONS } from "../data";
import { evaluateInspection } from "../utils";

// ##### Inspection Finalization Service
// -----> Schließt Auswertung, Fortschritt und Konsequenz als einen fachlichen Vorgang ab.
// ---> Das Schließen des Ergebnisdialogs hat dadurch keine Auswirkungen mehr auf den Spielstand.
export function finalizeInspection({
    inspectionSession,
    trafficEntity,
    playerDecision
}) {
    if (!inspectionSession || !trafficEntity || !playerDecision?.type) {
        return null;
    }

    const criminalDatabase = useNpcStore.getState().criminalDatabase;
    const officialRegistry = useOfficialRegistryStore.getState().officialRegistry;
    const resolution = evaluateInspection({
        inspectionSession,
        trafficEntity,
        criminalDatabase,
        officialRegistry,
        playerDecision
    });

    useInspectionStore.getState().completeInspection({
        playerDecision,
        resolution
    });

    recordScenarioProgress(resolution);
    recordShiftProgress(inspectionSession, resolution);
    applyTrafficResolution(trafficEntity, resolution.resolutionAction);

    return resolution;
}

function recordShiftProgress(inspectionSession, resolution) {
    if (!inspectionSession.shiftEncounter?.id) return;

    useShiftStore.getState().recordCompletedEncounter({
        encounterId: inspectionSession.shiftEncounter.id,
        conversationEntries: inspectionSession.conversationEntries,
        score: resolution.score
    });
}

function recordScenarioProgress(resolution) {
    if (!resolution.scenario) return;

    useControlScenarioStore.getState().recordCompletedScenario({
        scenario: resolution.scenario,
        score: resolution.score,
        outcome: resolution.outcome
    });
}

function applyTrafficResolution(trafficEntity, resolutionAction) {
    const trafficStore = useTrafficStore.getState();
    const entityCanLeaveWorld = resolutionAction
        === INSPECTION_RESOLUTION_ACTIONS.RELEASED;

    if (entityCanLeaveWorld && !trafficEntity.spawn?.spawnForDevPurposes) {
        trafficStore.continueTrafficEntity(trafficEntity.id);
    } else {
        // Festgehaltene, übergebene und technische Dev-Fälle verlassen den Verkehrskontext.
        trafficStore.removeTrafficEntity(trafficEntity.id);
    }

    trafficStore.setSelectedVehicleId(null);
}
