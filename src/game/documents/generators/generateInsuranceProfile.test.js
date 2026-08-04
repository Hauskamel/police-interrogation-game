import { faker } from "@faker-js/faker";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetGameClock } from "@game/shared";

import { generateInsuranceProfile } from "./generateInsuranceProfile.js";


describe("generateInsuranceProfile", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-08-03T08:00:00.000Z"));
        resetGameClock();
        faker.seed(20260803);
    });

    afterEach(() => {
        vi.useRealTimers();
        resetGameClock();
    });

    it("creates an active policy for the requested holder and vehicle", () => {
        const insuranceProfile = generateInsuranceProfile({
            vehicleId: "vehicle--one",
            policyHolderNpcId: "npc--owner",
            insuredPlateNumber: "AC - AB 1234",
            forceExpired: false
        });

        expect(insuranceProfile.real.policyHolderNpcId).toBe("npc--owner");
        expect(insuranceProfile.real.vehicleId).toBe("vehicle--one");
        expect(insuranceProfile.real.insuredPlateNumber).toBe("AC - AB 1234");
        expect(insuranceProfile.real.status).toBe("active");
        expect(insuranceProfile.real.validUntil > "2026-08-03").toBe(true);
        expect(insuranceProfile.presented).toEqual(insuranceProfile.real);
        expect(insuranceProfile.presented).not.toBe(insuranceProfile.real);
    });

    it("marks a deliberately expired policy consistently", () => {
        const insuranceProfile = generateInsuranceProfile({
            vehicleId: "vehicle--one",
            policyHolderNpcId: "npc--owner",
            insuredPlateNumber: "AC - AB 1234",
            forceExpired: true
        });

        expect(insuranceProfile.real.status).toBe("expired");
        expect(insuranceProfile.real.validUntil < "2026-08-03").toBe(true);
        expect(insuranceProfile.real.validFrom < insuranceProfile.real.validUntil).toBe(
            true
        );
    });
});
