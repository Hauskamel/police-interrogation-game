import {
    createDocumentState,
    createPresentedProfiles,
    generateInsuranceProfile
} from "@game/documents/generators";
import { createEntityId } from "@game/shared";
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
        forcedHasForgery: options.forcedHasForgery
    });
    const { driverProfile, insuranceProfile, vehicleProfile } = createPresentedProfiles({
        driverProfile: baseDriverProfile,
        vehicleProfile: baseVehicleProfileWithId,
        insuranceProfile: baseInsuranceProfile,
        documentState
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
        inspectionProfile,
        stopped: false,
        ...(worldTruthRecords ? { worldTruthRecords } : {})
    };
}
