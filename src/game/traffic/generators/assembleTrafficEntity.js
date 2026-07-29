import { createDocumentState, createPresentedProfiles } from "@game/documents/generators";
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
    worldTruthRecords
}) {
    const { vehicleOwnerProfile, ownership } = createVehicleOwnership(
        baseDriverProfile,
        options
    );
    const baseVehicleProfile = generateVehicleProfile({
        registeredOwnerNpcId: ownership.registeredOwnerNpcId
    });
    const documentState = createDocumentState({
        trafficType,
        driverProfile: baseDriverProfile,
        vehicleProfile: baseVehicleProfile,
        forcedHasForgery: options.forcedHasForgery
    });
    const { driverProfile, vehicleProfile } = createPresentedProfiles({
        driverProfile: baseDriverProfile,
        vehicleProfile: baseVehicleProfile,
        documentState
    });
    const id = createEntityId("traffic");
    const npcId = driverProfile.real.npcId;
    const vehicleId = createEntityId("vehicle");

    // vehicleId wird in real und presented gespiegelt, damit Wahrheit und Dokumentansicht dieselbe Fahrzeug-Referenz kennen.
    const vehicleProfileWithId = {
        real: {
            ...vehicleProfile.real,
            vehicleId
        },
        presented: {
            ...vehicleProfile.presented,
            vehicleId
        }
    };

    return {
        id,
        npcId,
        vehicleId,
        trafficType,
        driverProfile,
        vehicleOwnerProfile,
        vehicleProfile: vehicleProfileWithId,
        ownership,
        truth,
        police,
        documentState,
        inspectionProfile,
        stopped: false,
        ...(worldTruthRecords ? { worldTruthRecords } : {})
    };
}
