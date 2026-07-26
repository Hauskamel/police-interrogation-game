import { useCallback, useEffect, useRef } from "react";

import GUI from "lil-gui";

import { generateTrafficEntity, POLICE_STATUSES, TRAFFIC_ENTITY_TYPES } from "@game/traffic";
import { useNpcStore, useTrafficStore } from "@stores";

// ##### Dev Spawn Defaults
// -----> Hält die lil-gui Werte für gezielte NPC-/Dokumenttests.
// ---> Die Werte verändern nur Dev-Spawns, nicht die normalen Traffic-Wahrscheinlichkeiten.
const devSpawnDefaults = {
    trafficType: TRAFFIC_ENTITY_TYPES.CIVILIAN,
    knownToPolice: false,
    hasForgedDocuments: false,
    complexityLevel: 1,
    deceptionRisk: 0,
    focusAreas: "routine_documents"
};

export const useLilGuiSetup = () => {
    const guiRef = useRef(null);
    const devSpawnOptionsRef = useRef({ ...devSpawnDefaults });

    const addTrafficEntity = useTrafficStore(state => state.addTrafficEntity);
    const stopTrafficEntity = useTrafficStore(state => state.stopTrafficEntity);
    const setSelectedTrafficEntity = useTrafficStore(state => state.setSelectedTrafficEntity);
    const criminalDatabase = useNpcStore(state => state.criminalDatabase);

    if (!guiRef.current) {
        guiRef.current = new GUI();
    }

    const gui = guiRef.current;

    const spawnRandomNpcWithVehicle = useCallback(() => {
        const devOptions = devSpawnOptionsRef.current;
        let newEntity = generateTrafficEntity({
            criminalDatabase,
            forcedType: devOptions.trafficType,
            forcedHasForgery: devOptions.hasForgedDocuments
        });

        newEntity = applyDevSpawnOverrides(newEntity, devOptions);
        newEntity = {
            ...newEntity,
            spawn: {
                direction: "left",
                lane: 0,
                spawnForDevPurposes: true
            }
        };

        addTrafficEntity(newEntity);
        setSelectedTrafficEntity(newEntity);
        stopTrafficEntity(newEntity.id);
    }, [addTrafficEntity, criminalDatabase, setSelectedTrafficEntity, stopTrafficEntity]);

    useEffect(() => {
        const guiContent = devSpawnOptionsRef.current;
        guiContent.spawnCarAtPoliceman = () => spawnRandomNpcWithVehicle();

        const spawnFolder = gui.addFolder("NPC Dev Spawn");

        spawnFolder
            .add(guiContent, "trafficType", {
                Zivilist: TRAFFIC_ENTITY_TYPES.CIVILIAN,
                "Unbekannter Straftäter": TRAFFIC_ENTITY_TYPES.UNKNOWN_OFFENDER,
                "Bekannter Straftäter": TRAFFIC_ENTITY_TYPES.KNOWN_WANTED
            })
            .name("NPC Status");

        spawnFolder.add(guiContent, "knownToPolice").name("Ist Polizei bekannt?");
        spawnFolder.add(guiContent, "hasForgedDocuments").name("Gefälschte Papiere?");
        spawnFolder.add(guiContent, "complexityLevel", 1, 5, 1).name("Complexity Level");
        spawnFolder.add(guiContent, "deceptionRisk", 0, 1, 0.05).name("Deception Risk");
        spawnFolder.add(guiContent, "focusAreas").name("Fokus Areas");
        spawnFolder.add(guiContent, "spawnCarAtPoliceman").name("Spawn NPC an Station");

        return () => spawnFolder.destroy();
    }, [gui, spawnRandomNpcWithVehicle]);
};

// ##### Dev Spawn Override Applier
// -----> Überschreibt gezielt Debug-Werte einer frisch generierten TrafficEntity.
// ---> So lassen sich bekannte/verdächtige/manipulierte Fälle testen, ohne auf Zufall zu warten.
function applyDevSpawnOverrides(trafficEntity, devOptions) {
    const focusAreas = parseFocusAreas(devOptions.focusAreas);
    const isKnownWanted = devOptions.trafficType === TRAFFIC_ENTITY_TYPES.KNOWN_WANTED;
    const knownToPolice = isKnownWanted || devOptions.knownToPolice;

    return {
        ...trafficEntity,
        police: {
            ...trafficEntity.police,
            knownToPolice,
            status: getPoliceStatusForDevSpawn({
                trafficType: devOptions.trafficType,
                knownToPolice
            }),
            wantedLevel: isKnownWanted
                ? Math.max(1, trafficEntity.police?.wantedLevel ?? 1)
                : trafficEntity.police?.wantedLevel ?? 0
        },
        inspectionProfile: {
            ...trafficEntity.inspectionProfile,
            complexityLevel: devOptions.complexityLevel,
            deceptionRisk: devOptions.deceptionRisk,
            focusAreas
        },
        debugOverrides: {
            source: "lil-gui",
            trafficType: devOptions.trafficType,
            knownToPolice,
            hasForgedDocuments: devOptions.hasForgedDocuments,
            complexityLevel: devOptions.complexityLevel,
            deceptionRisk: devOptions.deceptionRisk,
            focusAreas
        }
    };
}

// ##### Police Status Resolver
// -----> Leitet aus Dev-Auswahl und Polizeibekanntheit einen passenden Police-Status ab.
// ---> Bekannte Straftäter bleiben wanted; andere bekannte Personen sind nur known.
function getPoliceStatusForDevSpawn({ trafficType, knownToPolice }) {
    if (trafficType === TRAFFIC_ENTITY_TYPES.KNOWN_WANTED) return POLICE_STATUSES.WANTED;
    if (knownToPolice) return POLICE_STATUSES.KNOWN;

    return POLICE_STATUSES.UNKNOWN;
}

// ##### Focus Area Parser
// -----> Wandelt die lil-gui Textliste in ein Array für inspectionProfile.focusAreas um.
// ---> Eingabeformat: routine_documents, document_consistency, vehicle_documents.
function parseFocusAreas(focusAreas) {
    return focusAreas
        .split(",")
        .map((focusArea) => focusArea.trim())
        .filter(Boolean);
}
