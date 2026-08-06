import {
    createDocumentState,
    createPresentedProfiles,
    generateInsuranceProfile
} from "@game/documents/generators";
import { createEntityId } from "@game/shared";
import { createControlInteractionProfile } from "@game/inspections/generators";
import { generateVehicleProfile } from "@game/vehicles/generators";

import { createVehicleOwnership } from "./createVehicleOwnership.js";

// ##### Traffic Entity Assembler
// -----> Führt die gemeinsame Orchestrierung aller vier Traffic-Factories aus.
// ---> Erzeugt Halter, Fahrzeug, Dokumentzustand, presented-Profile und die Weltinstanz.
export function assembleTrafficEntity({
    baseDriverProfile,
    trafficType,
    truth,
    police,
    inspectionProfile,
    options = {},
    worldTruthRecords,
    baseVehicleProfile: registeredVehicleProfile
}) {
    const { vehicleOwnerProfile, ownership } = createVehicleOwnership(
        baseDriverProfile,
        options
    );
    // Polizeibekannte NPCs können ihr bereits registriertes Datenbank-Fahrzeug verwenden.
    // Für alle anderen Traffic-Fälle wird weiterhin ein neues Fahrzeug generiert.
    const baseVehicleProfile = registeredVehicleProfile
        ?? generateVehicleProfile({
            registeredOwnerNpcId: ownership.registeredOwnerNpcId
        });
    const id = createEntityId("traffic");
    const npcId = baseDriverProfile.real.npcId;
    const vehicleId = baseVehicleProfile.real.vehicleId ?? createEntityId("vehicle");
    const baseVehicleProfileWithId = {
        real: {
            ...baseVehicleProfile.real,
            vehicleId
        },
        presented: {
            ...baseVehicleProfile.presented,
            vehicleId
        }
    };
    const baseInsuranceProfile = generateInsuranceProfile({
        vehicleId,
        policyHolderNpcId: ownership.registeredOwnerNpcId,
        insuredPlateNumber: baseVehicleProfileWithId.real.carDocumentsData.plateNumber,
        forceExpired: options.forcedInsuranceExpired
    });
    const documentState = createDocumentState({
        trafficType,
        driverProfile: baseDriverProfile,
        vehicleProfile: baseVehicleProfileWithId,
        insuranceProfile: baseInsuranceProfile,
        forcedHasForgery: options.forcedHasForgery,
        forcedForgeryTarget: options.forcedForgeryTarget
    });
    const { driverProfile, insuranceProfile, vehicleProfile } = createPresentedProfiles({
        driverProfile: baseDriverProfile,
        vehicleProfile: baseVehicleProfileWithId,
        insuranceProfile: baseInsuranceProfile,
        documentState
    });
    const controlInteractionProfile = createControlInteractionProfile({
        controlScenario: options.controlScenario,
        driverProfile,
        vehicleOwnerProfile
    });
    return {
        id,
        npcId,
        vehicleId,
        trafficType,
        driverProfile,
        vehicleOwnerProfile,
        vehicleProfile,
        insuranceProfile,
        ownership,
        truth,
        police,
        documentState,
        ...controlInteractionProfile,
        inspectionProfile: createInspectionProfileForScenario(
            inspectionProfile,
            options.controlScenario
        ),
        controlScenario: options.controlScenario
            ? {
                type: options.controlScenario.type,
                category: options.controlScenario.category,
                complexityLevel: options.controlScenario.complexityLevel,
                deceptionRisk: options.controlScenario.deceptionRisk,
                focusAreas: [...options.controlScenario.focusAreas]
            }
            : null,
        stopped: false,
        ...(worldTruthRecords ? { worldTruthRecords } : {})
    };
}

// Kontrollfall-Metadaten ersetzen nur die spielbezogene Pruefkomplexitaet, nicht die NPC-Wahrheit.
function createInspectionProfileForScenario(baseProfile, controlScenario) {
    if (!controlScenario) return baseProfile;

    return {
        complexityLevel: controlScenario.complexityLevel,
        deceptionRisk: controlScenario.deceptionRisk,
        focusAreas: [...controlScenario.focusAreas]
    };
}
