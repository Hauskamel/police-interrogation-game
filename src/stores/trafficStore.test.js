import { beforeEach, describe, expect, it } from "vitest";

import {
    selectSelectedTrafficEntity,
    useTrafficStore
} from "./trafficStore.js";


describe("trafficStore invariants", () => {
    beforeEach(() => {
        resetTrafficStore();
    });

    it("rejects a second active entity with the same NPC", () => {
        const firstEntity = createTrafficEntity();
        const duplicateNpcEntity = createTrafficEntity({
            id: "traffic--two",
            vehicleId: "vehicle--two"
        });

        expect(useTrafficStore.getState().addTrafficEntity(firstEntity)).toBe(firstEntity);
        expect(
            useTrafficStore.getState().addTrafficEntity(duplicateNpcEntity)
        ).toBeNull();
        expect(useTrafficStore.getState().trafficEntities).toEqual([firstEntity]);
    });

    it("rejects a second active entity with the same vehicle", () => {
        const firstEntity = createTrafficEntity();
        const duplicateVehicleEntity = createTrafficEntity({
            id: "traffic--two",
            npcId: "npc--two"
        });

        useTrafficStore.getState().addTrafficEntity(firstEntity);
        const storedDuplicate = useTrafficStore
            .getState()
            .addTrafficEntity(duplicateVehicleEntity);

        expect(storedDuplicate).toBeNull();
        expect(useTrafficStore.getState().trafficEntities).toHaveLength(1);
    });

    it("allows only one stopped traffic entity", () => {
        const firstEntity = createTrafficEntity();
        const secondEntity = createTrafficEntity({
            id: "traffic--two",
            npcId: "npc--two",
            vehicleId: "vehicle--two"
        });

        useTrafficStore.getState().addTrafficEntity(firstEntity);
        useTrafficStore.getState().addTrafficEntity(secondEntity);
        useTrafficStore.getState().stopTrafficEntity(firstEntity.id);
        useTrafficStore.getState().stopTrafficEntity(secondEntity.id);

        const stoppedEntities = useTrafficStore
            .getState()
            .trafficEntities
            .filter((entity) => entity.stopped);

        expect(stoppedEntities).toHaveLength(1);
        expect(stoppedEntities[0].id).toBe(firstEntity.id);
    });

    it("derives the selected entity from its ID instead of storing a copy", () => {
        const trafficEntity = createTrafficEntity();
        useTrafficStore.getState().addTrafficEntity(trafficEntity);
        useTrafficStore.getState().setSelectedVehicleId(trafficEntity.id);

        expect(selectSelectedTrafficEntity(useTrafficStore.getState())).toBe(
            trafficEntity
        );
    });
});

function createTrafficEntity(overrides = {}) {
    return {
        id: "traffic--one",
        npcId: "npc--one",
        vehicleId: "vehicle--one",
        stopped: false,
        ...overrides
    };
}

function resetTrafficStore() {
    useTrafficStore.setState({
        playerPoliceVehicle: undefined,
        trafficEntities: [],
        selectedVehicleId: null,
        revealedDriverIdentityByTrafficEntityId: {}
    });
}
