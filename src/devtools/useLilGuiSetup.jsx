import { useCallback, useEffect, useRef } from "react";

import GUI from "lil-gui";

import { createDocumentState, createPresentedProfiles } from "@game/documents/generators";
import {
    generateTrafficEntity,
    getActiveWantedRecords,
    getKnownOffenderNpcIds,
    getUnavailableControlScenarioTypes,
    isNpcKnownToPolice,
    POLICE_STATUSES,
    TRAFFIC_ENTITY_TYPES
} from "@game/traffic";
import {
    commitTrafficEntityRecords,
    getActiveTrafficIdentityExclusions,
    selectSelectedTrafficEntity,
    useControlScenarioStore,
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
    requiresResidencePermit: false,
    requiresWorkPermit: false,
    complexityLevel: 1,
    deceptionRisk: 0,
    focusAreas: ["routine_documents"]
};

export const useLilGuiSetup = () => {
    const guiRef = useRef(null);
    const controllersRef = useRef([]);
    const applyToStoppedNpcControllerRef = useRef(null);
    const databaseNpcControllerRef = useRef(null);
    const residencePermitControllerRef = useRef(null);
    const workPermitControllerRef = useRef(null);
    const selectedTrafficEntityRef = useRef(null);
    const concealedTrafficEntityIdRef = useRef(null);
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

    // Übergibt einen vorbereiteten Dev-Spawn an Weltzustand, Auswahl und Kontrollstation.
    // `concealFromGui` verhindert bei Blindtests, dass lil-gui den erzeugten Fall verrät.
    const commitTrafficEntityAtStation = useCallback((trafficEntity, options = {}) => {
        const trafficState = useTrafficStore.getState();

        // An der Kontrollstation darf zu jedem Zeitpunkt nur ein Fahrzeug stehen.
        if (trafficState.trafficEntities.some((entity) => entity.stopped)) {
            return null;
        }

        let committedEntity = {
            ...trafficEntity,
            spawn: {
                direction: "left",
                lane: 0,
                spawnForDevPurposes: true
            }
        };

        committedEntity = commitTrafficEntityRecords(committedEntity);
        if (!committedEntity) return null;

        committedEntity = addTrafficEntity(committedEntity);
        if (!committedEntity) return null;

        concealedTrafficEntityIdRef.current = options.concealFromGui
            ? committedEntity.id
            : null;
        setSelectedVehicleId(committedEntity.id);
        stopTrafficEntity(committedEntity.id);

        return committedEntity;
    }, [
        addTrafficEntity,
        setSelectedVehicleId,
        stopTrafficEntity
    ]);

    const spawnConfiguredTrafficEntityAtStation = useCallback(() => {
        const devOptions = devSpawnOptionsRef.current;
        const identityExclusions = getActiveTrafficIdentityExclusions(
            useTrafficStore.getState()
        );
        let newEntity = generateTrafficEntity({
            criminalDatabase,
            ...identityExclusions,
            forcedType: devOptions.trafficType,
            forcedHasForgery: devOptions.hasForgedDocuments,
            forcedRequiresResidencePermit: devOptions.requiresResidencePermit,
            forcedRequiresWorkPermit: devOptions.requiresWorkPermit,
            forcedDatabaseNpcId: getForcedDatabaseNpcId(devOptions.databaseNpcId)
        });

        // Ein bekannter Straftäter ist nur gültig, wenn der Generator wirklich einen Datenbank-NPC liefern konnte.
        // Ohne initialisierte Fahndungsliste wird kein unbekannter Fallback fälschlich als bekannt markiert.
        if (newEntity.trafficType !== devOptions.trafficType) return;

        newEntity = applyDevSpawnOverrides(newEntity, devOptions);
        commitTrafficEntityAtStation(newEntity);
    }, [
        commitTrafficEntityAtStation,
        criminalDatabase
    ]);

    // Erzeugt einen vom Pacing-Director gewaehlten Kontrollfall fuer einen echten Blindtest.
    // NPC-Typ und Auffaelligkeit bleiben in lil-gui verborgen.
    const spawnRandomTrafficEntityAtStation = useCallback(() => {
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
        const randomEntity = generateTrafficEntity({
            criminalDatabase,
            ...identityExclusions,
            controlScenario
        });
        if (!randomEntity) return;

        commitTrafficEntityAtStation(randomEntity, {
            concealFromGui: true
        });

        // Der Fall beeinflusst das Pacing erst, nachdem der Spieler die Kontrolle abschließt.
    }, [commitTrafficEntityAtStation, criminalDatabase]);

    // Wendet die vollständige aktuelle Dev-Konfiguration auf die angehaltene Auswahl an.
    // Der Button nutzt denselben Generatorpfad wie ein Spawn, erhält aber den Weltzustand der TrafficEntity.
    const applyOptionsToStoppedNpc = useCallback(() => {
        const trafficState = useTrafficStore.getState();
        const selectedEntity = selectSelectedTrafficEntity(trafficState);
        const stoppedEntity = trafficState.trafficEntities.find(
            (entity) => entity.id === selectedEntity?.id && entity.stopped
        );

        if (!stoppedEntity) return;

        concealedTrafficEntityIdRef.current = null;
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
        guiContent.spawnRandomNpcAtStation = () => {
            spawnRandomTrafficEntityAtStation();
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
                concealedTrafficEntityIdRef.current = null;
                guiContent.databaseNpcId = RANDOM_DATABASE_NPC_ID;
                enforcePoliceKnowledgeForDatabaseNpc(guiContent);
                updateDatabaseNpcController({
                    controller: databaseNpcControllerRef.current,
                    criminalDatabase,
                    devOptions: guiContent
                });
                updatePermitRequirementControllers({
                    controllers: [
                        residencePermitControllerRef.current,
                        workPermitControllerRef.current
                    ],
                    trafficType: guiContent.trafficType
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
            .onChange(() => {
                concealedTrafficEntityIdRef.current = null;
                replaceSelectedTrafficScenarioFromGui({
                    selectedTrafficEntityRef,
                    updateTrafficEntity,
                    criminalDatabase,
                    focusSelection: focusSelectionRef.current,
                    devOptions: guiContent
                });
            });

        databaseNpcControllerRef.current = databaseNpcController;
        updateDatabaseNpcController({
            controller: databaseNpcController,
            criminalDatabase,
            devOptions: guiContent
        });

        const knownToPoliceController = spawnFolder
            .add(guiContent, "knownToPolice")
            .name("Ist Polizei bekannt?")
            .onChange(() => {
                concealedTrafficEntityIdRef.current = null;
                updateSelectedTrafficEntityFromGui({
                    selectedTrafficEntityRef,
                    updateTrafficEntity,
                    devOptions: guiContent
                });
            });

        const forgedDocumentsController = spawnFolder
            .add(guiContent, "hasForgedDocuments")
            .name("Gefälschte Papiere?")
            .onChange(() => {
                concealedTrafficEntityIdRef.current = null;
                updateSelectedTrafficEntityFromGui({
                    selectedTrafficEntityRef,
                    updateTrafficEntity,
                    devOptions: guiContent
                });
            });

        const residencePermitController = spawnFolder
            .add(guiContent, "requiresResidencePermit")
            .name("Benötigt Aufenthaltserlaubnis")
            .onChange((requiresResidencePermit) => {
                concealedTrafficEntityIdRef.current = null;

                // Ohne Aufenthaltstitel kann fachlich keine Arbeitserlaubnis bestehen.
                if (!requiresResidencePermit) {
                    guiContent.requiresWorkPermit = false;
                }

                updateControllerDisplays(controllersRef.current);
                replaceSelectedTrafficScenarioFromGui({
                    selectedTrafficEntityRef,
                    updateTrafficEntity,
                    criminalDatabase,
                    focusSelection: focusSelectionRef.current,
                    devOptions: guiContent
                });
            });

        const workPermitController = spawnFolder
            .add(guiContent, "requiresWorkPermit")
            .name("Benötigt Arbeitserlaubnis")
            .onChange((requiresWorkPermit) => {
                concealedTrafficEntityIdRef.current = null;

                // Erwerbstaetigkeit setzt automatisch einen gueltigen Aufenthaltstitel voraus.
                if (requiresWorkPermit) {
                    guiContent.requiresResidencePermit = true;
                }

                updateControllerDisplays(controllersRef.current);
                replaceSelectedTrafficScenarioFromGui({
                    selectedTrafficEntityRef,
                    updateTrafficEntity,
                    criminalDatabase,
                    focusSelection: focusSelectionRef.current,
                    devOptions: guiContent
                });
            });

        residencePermitControllerRef.current = residencePermitController;
        workPermitControllerRef.current = workPermitController;
        updatePermitRequirementControllers({
            controllers: [residencePermitController, workPermitController],
            trafficType: guiContent.trafficType
        });

        const complexityController = spawnFolder
            .add(guiContent, "complexityLevel", 1, 5, 1)
            .name("Complexity Level")
            .onChange(() => {
                concealedTrafficEntityIdRef.current = null;
                updateSelectedTrafficEntityFromGui({
                    selectedTrafficEntityRef,
                    updateTrafficEntity,
                    devOptions: guiContent
                });
            });

        const deceptionController = spawnFolder
            .add(guiContent, "deceptionRisk", 0, 1, 0.05)
            .name("Deception Risk")
            .onChange(() => {
                concealedTrafficEntityIdRef.current = null;
                updateSelectedTrafficEntityFromGui({
                    selectedTrafficEntityRef,
                    updateTrafficEntity,
                    devOptions: guiContent
                });
            });

        const focusFolder = spawnFolder.addFolder("Fokus Areas");
        const focusControllers = INSPECTION_FOCUS_AREAS.map(({ id, label }) =>
            focusFolder
                .add(focusSelectionRef.current, id)
                .name(label)
                .onChange(() => {
                    concealedTrafficEntityIdRef.current = null;
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

        spawnFolder
            .add(guiContent, "spawnCarAtPoliceman")
            .name("Spawn konfigurierten NPC");
        spawnFolder
            .add(guiContent, "spawnRandomNpcAtStation")
            .name("Spawn Random NPC (Blindtest)");

        controllersRef.current = [
            trafficTypeController,
            databaseNpcController,
            knownToPoliceController,
            forgedDocumentsController,
            residencePermitController,
            workPermitController,
            complexityController,
            deceptionController,
            ...focusControllers
        ];

        return () => {
            controllersRef.current = [];
            applyToStoppedNpcControllerRef.current = null;
            databaseNpcControllerRef.current = null;
            residencePermitControllerRef.current = null;
            workPermitControllerRef.current = null;
            spawnFolder.destroy();
        };
    }, [
        applyOptionsToStoppedNpc,
        criminalDatabase,
        gui,
        spawnConfiguredTrafficEntityAtStation,
        spawnRandomTrafficEntityAtStation,
        updateTrafficEntity
    ]);

    // Übernimmt beim Wechsel des ausgewählten Fahrzeugs dessen Werte zurück in lil-gui.
    // Dadurch bleiben GUI und Debug-Panel auch bei normalen Traffic-Spawns synchron.
    useEffect(() => {
        if (!selectedTrafficEntity) return;

        // Ein Blindtest darf seine intern ausgewürfelte Kategorie nicht über lil-gui offenlegen.
        if (concealedTrafficEntityIdRef.current === selectedTrafficEntity.id) {
            updateApplyToStoppedNpcController({
                controller: applyToStoppedNpcControllerRef.current,
                selectedTrafficEntity
            });
            return;
        }

        concealedTrafficEntityIdRef.current = null;

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
        updatePermitRequirementControllers({
            controllers: [
                residencePermitControllerRef.current,
                workPermitControllerRef.current
            ],
            trafficType: selectedTrafficEntity.trafficType
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
    const migrationProfile = trafficEntity.driverProfile?.real?.migrationProfile;

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
            requiresResidencePermit: Boolean(
                migrationProfile?.requiresResidencePermit
            ),
            requiresWorkPermit: Boolean(migrationProfile?.requiresWorkPermit),
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
        ...getActiveTrafficIdentityExclusions(
            useTrafficStore.getState(),
            selectedTrafficEntity.id
        ),
        forcedType: devOptions.trafficType,
        forcedHasForgery: devOptions.hasForgedDocuments,
        forcedRequiresResidencePermit: devOptions.requiresResidencePermit,
        forcedRequiresWorkPermit: devOptions.requiresWorkPermit,
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
    const normalizedGeneratedEntity = commitTrafficEntityRecords(generatedEntity, {
        ignoreTrafficEntityId: selectedTrafficEntity.id
    });
    if (!normalizedGeneratedEntity) return;

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
        insuranceProfile: trafficEntity.insuranceProfile,
        vehicleProfile: trafficEntity.vehicleProfile,
        forcedHasForgery: devOptions.hasForgedDocuments
    });
    const profiles = createPresentedProfiles({
        driverProfile: trafficEntity.driverProfile,
        insuranceProfile: trafficEntity.insuranceProfile,
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
        requiresResidencePermit: Boolean(
            trafficEntity.driverProfile?.real?.migrationProfile
                ?.requiresResidencePermit
        ),
        requiresWorkPermit: Boolean(
            trafficEntity.driverProfile?.real?.migrationProfile
                ?.requiresWorkPermit
        ),
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

// Datenbank-NPCs besitzen bereits kanonische Migrationsdaten, die das Devtool nicht ueberschreibt.
function updatePermitRequirementControllers({ controllers, trafficType }) {
    controllers.filter(Boolean).forEach((controller) => {
        if (isDatabaseTrafficType(trafficType)) {
            controller.disable();
        } else {
            controller.enable();
        }
    });
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
