import { useCallback, useEffect, useRef } from "react";

import GUI from "lil-gui";

import { createDocumentState, createPresentedProfiles } from "@game/documents/generators";
import {
    generateTrafficEntity,
    getActiveWantedRecords,
    getKnownOffenderNpcIds,
    isNpcKnownToPolice,
    POLICE_STATUSES,
    TRAFFIC_ENTITY_TYPES
} from "@game/traffic";
import {
    registerTrafficEntityWorldTruth,
    selectSelectedTrafficEntity,
    useNpcStore,
    useTrafficStore
} from "@stores";

import {
    deriveInspectionProfile,
    INSPECTION_FOCUS_AREAS
} from "./inspectionProfileControls.js";

const RANDOM_DATABASE_NPC_ID = "__random_database_npc__";

// ##### Dev Spawn Defaults
// -----> Hält die lil-gui Werte für gezielte NPC-/Dokumenttests.
// ---> Die Werte verändern nur Dev-Spawns, nicht die normalen Traffic-Wahrscheinlichkeiten.
const devSpawnDefaults = {
    trafficType: TRAFFIC_ENTITY_TYPES.CIVILIAN,
    databaseNpcId: RANDOM_DATABASE_NPC_ID,
    knownToPolice: false,
    hasForgedDocuments: false,
    complexityLevel: 1,
    deceptionRisk: 0,
    focusAreas: ["routine_documents"]
};

export const useLilGuiSetup = () => {
    const guiRef = useRef(null);
    const controllersRef = useRef([]);
    const applyToStoppedNpcControllerRef = useRef(null);
    const databaseNpcControllerRef = useRef(null);
    const selectedTrafficEntityRef = useRef(null);
    const devSpawnOptionsRef = useRef({
        ...devSpawnDefaults,
        focusAreas: [...devSpawnDefaults.focusAreas]
    });
    const focusSelectionRef = useRef(createFocusSelection(devSpawnDefaults.focusAreas));

    const addTrafficEntity = useTrafficStore(state => state.addTrafficEntity);
    const setSelectedVehicleId = useTrafficStore(state => state.setSelectedVehicleId);
    const stopTrafficEntity = useTrafficStore(state => state.stopTrafficEntity);
    const updateTrafficEntity = useTrafficStore(state => state.updateTrafficEntity);
    const selectedTrafficEntity = useTrafficStore(selectSelectedTrafficEntity);
    const criminalDatabase = useNpcStore(state => state.criminalDatabase);

    if (!guiRef.current) {
        guiRef.current = new GUI();
    }

    const gui = guiRef.current;

    // Hält den aktuell ausgewählten NPC für lil-gui Callbacks verfügbar, ohne das GUI neu aufzubauen.
    useEffect(() => {
        selectedTrafficEntityRef.current = selectedTrafficEntity;
    }, [selectedTrafficEntity]);

    const spawnConfiguredTrafficEntityAtStation = useCallback(() => {
        const trafficState = useTrafficStore.getState();

        // An der Kontrollstation darf zu jedem Zeitpunkt nur ein Fahrzeug stehen.
        if (trafficState.trafficEntities.some((entity) => entity.stopped)) {
            return;
        }

        const devOptions = devSpawnOptionsRef.current;
        let newEntity = generateTrafficEntity({
            criminalDatabase,
            forcedType: devOptions.trafficType,
            forcedHasForgery: devOptions.hasForgedDocuments,
            forcedDatabaseNpcId: getForcedDatabaseNpcId(devOptions.databaseNpcId)
        });

        // Ein bekannter Straftäter ist nur gültig, wenn der Generator wirklich einen Datenbank-NPC liefern konnte.
        // Ohne initialisierte Fahndungsliste wird kein unbekannter Fallback fälschlich als bekannt markiert.
        if (newEntity.trafficType !== devOptions.trafficType) return;

        newEntity = applyDevSpawnOverrides(newEntity, devOptions);
        newEntity = {
            ...newEntity,
            spawn: {
                direction: "left",
                lane: 0,
                spawnForDevPurposes: true
            }
        };

        newEntity = registerTrafficEntityWorldTruth(newEntity);
        newEntity = addTrafficEntity(newEntity);
        setSelectedVehicleId(newEntity.id);
        stopTrafficEntity(newEntity.id);
    }, [
        addTrafficEntity,
        criminalDatabase,
        setSelectedVehicleId,
        stopTrafficEntity
    ]);

    // Wendet die vollständige aktuelle Dev-Konfiguration auf die angehaltene Auswahl an.
    // Der Button nutzt denselben Generatorpfad wie ein Spawn, erhält aber den Weltzustand der TrafficEntity.
    const applyOptionsToStoppedNpc = useCallback(() => {
        const trafficState = useTrafficStore.getState();
        const selectedEntity = selectSelectedTrafficEntity(trafficState);
        const stoppedEntity = trafficState.trafficEntities.find(
            (entity) => entity.id === selectedEntity?.id && entity.stopped
        );

        if (!stoppedEntity) return;

        selectedTrafficEntityRef.current = stoppedEntity;
        replaceSelectedTrafficScenarioFromGui({
            selectedTrafficEntityRef,
            updateTrafficEntity,
            criminalDatabase,
            focusSelection: focusSelectionRef.current,
            devOptions: devSpawnOptionsRef.current
        });
    }, [criminalDatabase, updateTrafficEntity]);

    useEffect(() => {
        const guiContent = devSpawnOptionsRef.current;
        guiContent.spawnCarAtPoliceman = () => {
            spawnConfiguredTrafficEntityAtStation();
        };
        guiContent.applyToStoppedNpc = () => applyOptionsToStoppedNpc();

        const spawnFolder = gui.addFolder("NPC Dev Spawn");

        const trafficTypeController = spawnFolder
            .add(guiContent, "trafficType", {
                Zivilist: TRAFFIC_ENTITY_TYPES.CIVILIAN,
                "Unbekannter Straftäter": TRAFFIC_ENTITY_TYPES.UNKNOWN_OFFENDER,
                "Bekannter Straftäter": TRAFFIC_ENTITY_TYPES.KNOWN_OFFENDER,
                "Gesuchter Straftäter": TRAFFIC_ENTITY_TYPES.WANTED_OFFENDER
            })
            .name("NPC Status")
            .onChange(() => {
                guiContent.databaseNpcId = RANDOM_DATABASE_NPC_ID;
                enforcePoliceKnowledgeForDatabaseNpc(guiContent);
                updateDatabaseNpcController({
                    controller: databaseNpcControllerRef.current,
                    criminalDatabase,
                    devOptions: guiContent
                });
                replaceSelectedTrafficScenarioFromGui({
                    selectedTrafficEntityRef,
                    updateTrafficEntity,
                    criminalDatabase,
                    focusSelection: focusSelectionRef.current,
                    devOptions: guiContent
                });
                updateControllerDisplays(controllersRef.current);
            });

        const databaseNpcController = spawnFolder
            .add(
                guiContent,
                "databaseNpcId",
                createDatabaseNpcOptions(criminalDatabase, guiContent.trafficType)
            )
            .name("Datenbank-NPC")
            .onChange(() => replaceSelectedTrafficScenarioFromGui({
                selectedTrafficEntityRef,
                updateTrafficEntity,
                criminalDatabase,
                focusSelection: focusSelectionRef.current,
                devOptions: guiContent
            }));

        databaseNpcControllerRef.current = databaseNpcController;
        updateDatabaseNpcController({
            controller: databaseNpcController,
            criminalDatabase,
            devOptions: guiContent
        });

        const knownToPoliceController = spawnFolder
            .add(guiContent, "knownToPolice")
            .name("Ist Polizei bekannt?")
            .onChange(() => updateSelectedTrafficEntityFromGui({
                selectedTrafficEntityRef,
                updateTrafficEntity,
                devOptions: guiContent
            }));

        const forgedDocumentsController = spawnFolder
            .add(guiContent, "hasForgedDocuments")
            .name("Gefälschte Papiere?")
            .onChange(() => updateSelectedTrafficEntityFromGui({
                selectedTrafficEntityRef,
                updateTrafficEntity,
                devOptions: guiContent
            }));

        const complexityController = spawnFolder
            .add(guiContent, "complexityLevel", 1, 5, 1)
            .name("Complexity Level")
            .onChange(() => updateSelectedTrafficEntityFromGui({
                selectedTrafficEntityRef,
                updateTrafficEntity,
                devOptions: guiContent
            }));

        const deceptionController = spawnFolder
            .add(guiContent, "deceptionRisk", 0, 1, 0.05)
            .name("Deception Risk")
            .onChange(() => updateSelectedTrafficEntityFromGui({
                selectedTrafficEntityRef,
                updateTrafficEntity,
                devOptions: guiContent
            }));

        const focusFolder = spawnFolder.addFolder("Fokus Areas");
        const focusControllers = INSPECTION_FOCUS_AREAS.map(({ id, label }) =>
            focusFolder
                .add(focusSelectionRef.current, id)
                .name(label)
                .onChange(() => {
                    const derivedProfile = deriveInspectionProfile(
                        getSelectedFocusAreas(focusSelectionRef.current)
                    );

                    Object.assign(guiContent, derivedProfile);
                    updateControllerDisplays(controllersRef.current);
                    updateSelectedTrafficEntityFromGui({
                        selectedTrafficEntityRef,
                        updateTrafficEntity,
                        devOptions: guiContent
                    });
                })
        );

        const applyToStoppedNpcController = spawnFolder
            .add(guiContent, "applyToStoppedNpc")
            .name("Auf angehaltenen NPC anwenden");

        applyToStoppedNpcControllerRef.current = applyToStoppedNpcController;
        updateApplyToStoppedNpcController({
            controller: applyToStoppedNpcController,
            selectedTrafficEntity: selectedTrafficEntityRef.current
        });

        spawnFolder.add(guiContent, "spawnCarAtPoliceman").name("Spawn NPC an Station");

        controllersRef.current = [
            trafficTypeController,
            databaseNpcController,
            knownToPoliceController,
            forgedDocumentsController,
            complexityController,
            deceptionController,
            ...focusControllers
        ];

        return () => {
            controllersRef.current = [];
            applyToStoppedNpcControllerRef.current = null;
            databaseNpcControllerRef.current = null;
            spawnFolder.destroy();
        };
    }, [
        applyOptionsToStoppedNpc,
        criminalDatabase,
        gui,
        spawnConfiguredTrafficEntityAtStation,
        updateTrafficEntity
    ]);

    // Übernimmt beim Wechsel des ausgewählten Fahrzeugs dessen Werte zurück in lil-gui.
    // Dadurch bleiben GUI und Debug-Panel auch bei normalen Traffic-Spawns synchron.
    useEffect(() => {
        if (!selectedTrafficEntity) return;

        syncGuiOptionsFromTrafficEntity({
            trafficEntity: selectedTrafficEntity,
            devOptions: devSpawnOptionsRef.current,
            focusSelection: focusSelectionRef.current
        });
        updateDatabaseNpcController({
            controller: databaseNpcControllerRef.current,
            criminalDatabase,
            devOptions: devSpawnOptionsRef.current
        });
        updateApplyToStoppedNpcController({
            controller: applyToStoppedNpcControllerRef.current,
            selectedTrafficEntity
        });
        updateControllerDisplays(controllersRef.current);
    }, [criminalDatabase, selectedTrafficEntity]);
};

// ##### Dev Spawn Override Applier
// -----> Überschreibt gezielt Debug-Werte einer frisch generierten TrafficEntity.
// ---> So lassen sich bekannte/verdächtige/manipulierte Fälle testen, ohne auf Zufall zu warten.
function applyDevSpawnOverrides(trafficEntity, devOptions) {
    const isDatabaseOffender = isDatabaseTrafficType(devOptions.trafficType);
    const knownToPolice = isDatabaseOffender || devOptions.knownToPolice;

    return {
        ...trafficEntity,
        trafficType: devOptions.trafficType,
        truth: {
            ...trafficEntity.truth,
            role: devOptions.trafficType === TRAFFIC_ENTITY_TYPES.CIVILIAN
                ? "civilian"
                : "criminal"
        },
        police: {
            ...trafficEntity.police,
            status: getPoliceStatusForDevSpawn({
                trafficType: devOptions.trafficType,
                knownToPolice
            }),
            wantedRecordId: devOptions.trafficType === TRAFFIC_ENTITY_TYPES.WANTED_OFFENDER
                ? trafficEntity.police?.wantedRecordId
                : null
        },
        inspectionProfile: {
            ...trafficEntity.inspectionProfile,
            complexityLevel: devOptions.complexityLevel,
            deceptionRisk: devOptions.deceptionRisk,
            focusAreas: [...devOptions.focusAreas]
        },
        debugOverrides: {
            trafficType: devOptions.trafficType,
            databaseNpcId: trafficEntity.police?.databaseNpcId,
            knownToPolice,
            hasForgedDocuments: devOptions.hasForgedDocuments,
            complexityLevel: devOptions.complexityLevel,
            deceptionRisk: devOptions.deceptionRisk,
            focusAreas: [...devOptions.focusAreas]
        }
    };
}

// ##### Police Status Resolver
// -----> Leitet aus Dev-Auswahl und Polizeibekanntheit einen passenden Police-Status ab.
// ---> Bekannte Straftäter bleiben wanted; andere bekannte Personen sind nur known.
function getPoliceStatusForDevSpawn({ trafficType, knownToPolice }) {
    if (trafficType === TRAFFIC_ENTITY_TYPES.WANTED_OFFENDER) return POLICE_STATUSES.WANTED;
    if (trafficType === TRAFFIC_ENTITY_TYPES.KNOWN_OFFENDER) return POLICE_STATUSES.KNOWN;
    if (knownToPolice) return POLICE_STATUSES.KNOWN;

    return POLICE_STATUSES.UNKNOWN;
}

// ##### Selected Traffic Scenario Replacer
// -----> Erzeugt beim Wechsel des NPC-Status einen vollständigen, fachlich passenden Traffic-Fall.
// ---> Datenbanktäter stammen aus passenden NPC-IDs und bei Gesuchten zusätzlich aus aktiven Wanted Records.
function replaceSelectedTrafficScenarioFromGui({
    selectedTrafficEntityRef,
    updateTrafficEntity,
    criminalDatabase,
    focusSelection,
    devOptions
}) {
    const selectedTrafficEntity = selectedTrafficEntityRef.current;
    if (!selectedTrafficEntity) return;

    const generatedEntity = generateTrafficEntity({
        criminalDatabase,
        forcedType: devOptions.trafficType,
        forcedHasForgery: devOptions.hasForgedDocuments,
        forcedDatabaseNpcId: getForcedDatabaseNpcId(devOptions.databaseNpcId)
    });

    // generateTrafficEntity nutzt im normalen Spiel einen unbekannten Täter als sicheren Fallback.
    // Im Devtool wird dieser Fallback abgelehnt, weil die GUI sonst einen falschen Status anzeigen würde.
    if (generatedEntity.trafficType !== devOptions.trafficType) {
        syncGuiOptionsFromTrafficEntity({
            trafficEntity: selectedTrafficEntity,
            devOptions,
            focusSelection
        });
        return;
    }

    // World-Truth-Records werden erst registriert, wenn der erzeugte Fall wirklich übernommen wird.
    const normalizedGeneratedEntity = registerTrafficEntityWorldTruth(generatedEntity);

    updateTrafficEntity(selectedTrafficEntity.id, (currentEntity) => {
        const replacementEntity = preserveTrafficWorldState({
            currentEntity,
            generatedEntity: normalizedGeneratedEntity
        });

        return applyDevSpawnOverrides(replacementEntity, devOptions);
    });
}

// ##### Traffic World State Preserver
// -----> Behält die vorhandene Weltinstanz an ihrer Position, ersetzt aber NPC-, Fahrzeug- und Falldaten.
// ---> So bleibt der angehaltene Wagen auswählbar, während die Debug-Kategorie fachlich neu aufgebaut wird.
function preserveTrafficWorldState({ currentEntity, generatedEntity }) {
    return {
        ...generatedEntity,
        id: currentEntity.id,
        spawn: currentEntity.spawn,
        position: currentEntity.position,
        stopped: currentEntity.stopped
    };
}

// ##### Selected TrafficEntity GUI Update
// -----> Wendet jede lil-gui Änderung sofort auf den aktuell ausgewählten NPC an.
// ---> Bei geänderter Dokumentmanipulation werden presented und documentState gemeinsam neu erzeugt.
function updateSelectedTrafficEntityFromGui({
    selectedTrafficEntityRef,
    updateTrafficEntity,
    devOptions
}) {
    const selectedTrafficEntity = selectedTrafficEntityRef.current;
    if (!selectedTrafficEntity) return;

    updateTrafficEntity(selectedTrafficEntity.id, (currentEntity) => {
        let updatedEntity = currentEntity;
        const hasForgeryChanged = currentEntity.documentState?.hasForgery
            !== devOptions.hasForgedDocuments;

        if (hasForgeryChanged) {
            updatedEntity = rebuildPresentedDocuments(currentEntity, devOptions);
        }

        return applyDevSpawnOverrides(updatedEntity, devOptions);
    });
}

// ##### Presented Document Rebuilder
// -----> Erzeugt bei einem lil-gui Forgery-Toggle einen konsistenten Dokumentzustand.
// ---> So zeigt presented sofort echte oder manipulierte Werte, während real unverändert bleibt.
function rebuildPresentedDocuments(trafficEntity, devOptions) {
    const documentState = createDocumentState({
        trafficType: devOptions.trafficType,
        driverProfile: trafficEntity.driverProfile,
        vehicleProfile: trafficEntity.vehicleProfile,
        forcedHasForgery: devOptions.hasForgedDocuments
    });
    const profiles = createPresentedProfiles({
        driverProfile: trafficEntity.driverProfile,
        vehicleProfile: trafficEntity.vehicleProfile,
        documentState
    });

    return {
        ...trafficEntity,
        ...profiles,
        documentState
    };
}

// ##### GUI Selection Synchronizer
// -----> Lädt die Werte einer ausgewählten TrafficEntity in die lil-gui Controls.
// ---> Unbekannte Fokusbereiche bleiben im Profil erhalten, erscheinen aber nicht als Checkbox.
function syncGuiOptionsFromTrafficEntity({
    trafficEntity,
    devOptions,
    focusSelection
}) {
    const focusAreas = trafficEntity.inspectionProfile?.focusAreas ?? [];

    Object.assign(devOptions, {
        trafficType: trafficEntity.trafficType,
        databaseNpcId: trafficEntity.police?.databaseNpcId ?? RANDOM_DATABASE_NPC_ID,
        knownToPolice: isNpcKnownToPolice(trafficEntity.police?.status),
        hasForgedDocuments: Boolean(trafficEntity.documentState?.hasForgery),
        complexityLevel: trafficEntity.inspectionProfile?.complexityLevel ?? 1,
        deceptionRisk: trafficEntity.inspectionProfile?.deceptionRisk ?? 0,
        focusAreas: [...focusAreas]
    });

    INSPECTION_FOCUS_AREAS.forEach(({ id }) => {
        focusSelection[id] = focusAreas.includes(id);
    });
}

// ##### Database Police Knowledge Guard
// -----> Polizeibekannte und gesuchte Datenbank-NPCs müssen im Debugmodell bekannt bleiben.
function enforcePoliceKnowledgeForDatabaseNpc(devOptions) {
    if (isDatabaseTrafficType(devOptions.trafficType)) {
        devOptions.knownToPolice = true;
    }
}

// ##### Database Traffic Type Check
// -----> Kennzeichnet die Traffic-Typen, die zwingend eine bestehende Datenbankidentität brauchen.
function isDatabaseTrafficType(trafficType) {
    return trafficType === TRAFFIC_ENTITY_TYPES.KNOWN_OFFENDER
        || trafficType === TRAFFIC_ENTITY_TYPES.WANTED_OFFENDER;
}

// ##### Database NPC Options Factory
// -----> Erstellt lesbare lil-gui Optionen aus den zur Kategorie passenden Datenbank-NPCs.
// ---> Bekannte Täter schließen aktive Fahndungen aus; gesuchte Täter benötigen einen aktiven Record.
function createDatabaseNpcOptions(criminalDatabase, trafficType) {
    if (!isDatabaseTrafficType(trafficType)) {
        return { "Nicht relevant": RANDOM_DATABASE_NPC_ID };
    }

    const candidateNpcIds = getDatabaseNpcIdsForTrafficType(criminalDatabase, trafficType);
    const npcOptions = Object.fromEntries(
        candidateNpcIds.map((npcId) => {
            const npcRecord = criminalDatabase.npcsById?.[npcId];
            const name = [npcRecord?.firstName, npcRecord?.lastName]
                .filter(Boolean)
                .join(" ");

            return [`${name || "Unbenannter NPC"} (${npcId.slice(-8)})`, npcId];
        })
    );

    return {
        "Zufälliger passender NPC": RANDOM_DATABASE_NPC_ID,
        ...npcOptions
    };
}

// ##### Database NPC Candidate Resolver
// -----> Liefert je Kategorie nur IDs, die den Polizeistatus tatsächlich erfüllen.
function getDatabaseNpcIdsForTrafficType(criminalDatabase, trafficType) {
    if (trafficType === TRAFFIC_ENTITY_TYPES.KNOWN_OFFENDER) {
        return getKnownOffenderNpcIds(criminalDatabase);
    }

    if (trafficType === TRAFFIC_ENTITY_TYPES.WANTED_OFFENDER) {
        return getActiveWantedRecords(criminalDatabase).map(({ npcId }) => npcId);
    }

    return [];
}

// ##### Database NPC Controller Synchronizer
// -----> Aktualisiert Dropdown-Inhalt und Aktivzustand nach Kategorie- oder Datenbankwechseln.
function updateDatabaseNpcController({ controller, criminalDatabase, devOptions }) {
    if (!controller) return;

    const options = createDatabaseNpcOptions(criminalDatabase, devOptions.trafficType);
    const validNpcIds = Object.values(options);

    if (!validNpcIds.includes(devOptions.databaseNpcId)) {
        devOptions.databaseNpcId = RANDOM_DATABASE_NPC_ID;
    }

    controller.options(options);

    if (isDatabaseTrafficType(devOptions.trafficType)) {
        controller.enable();
    } else {
        controller.disable();
    }
}

// ##### Forced Database NPC Normalizer
// -----> Übersetzt die lil-gui Zufallsoption in undefined für die Traffic-Generatoren.
function getForcedDatabaseNpcId(databaseNpcId) {
    return databaseNpcId === RANDOM_DATABASE_NPC_ID
        ? undefined
        : databaseNpcId;
}

// ##### Apply Button State Synchronizer
// -----> Aktiviert die Aktion nur, wenn die aktuelle Auswahl wirklich angehalten wurde.
function updateApplyToStoppedNpcController({ controller, selectedTrafficEntity }) {
    if (!controller) return;

    if (selectedTrafficEntity?.stopped) {
        controller.enable();
    } else {
        controller.disable();
    }
}

// ##### Focus Selection Factory
// -----> Baut das Boolean-Objekt, an das die einzelnen lil-gui Checkboxen gebunden werden.
function createFocusSelection(selectedFocusAreas) {
    return Object.fromEntries(
        INSPECTION_FOCUS_AREAS.map(({ id }) => [id, selectedFocusAreas.includes(id)])
    );
}

// ##### Selected Focus Area Collector
// -----> Wandelt die aktivierten Checkboxen zurück in inspectionProfile.focusAreas.
function getSelectedFocusAreas(focusSelection) {
    return INSPECTION_FOCUS_AREAS
        .filter(({ id }) => focusSelection[id])
        .map(({ id }) => id);
}

// ##### lil-gui Display Refresh
// -----> Aktualisiert sichtbare Control-Werte nach abgeleiteten oder externen State-Änderungen.
function updateControllerDisplays(controllers) {
    controllers.forEach((controller) => controller.updateDisplay());
}
