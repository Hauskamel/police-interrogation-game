import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "vitest";

import { resetGameClock } from "@game/shared";
import { HOME_COUNTRY, TRAVEL_PURPOSES } from "../data";
import { generateMigrationProfile } from "./generateMigrationProfile.js";

describe("generateMigrationProfile", () => {
    beforeEach(() => {
        faker.seed(20260810);
        resetGameClock();
    });

    it("does not require immigration permits for domestic NPCs", () => {
        const profile = generateMigrationProfile({
            countryOfOrigin: HOME_COUNTRY
        });

        expect(profile.status).toBe("domestic");
        expect(profile.requiresResidencePermit).toBe(false);
        expect(profile.requiresWorkPermit).toBe(false);
    });

    it("does not require a permit for a short transit", () => {
        const profile = generateMigrationProfile({
            countryOfOrigin: "Auren",
            options: {
                forcedTravelPurpose: TRAVEL_PURPOSES.TRANSIT,
                forcedStayDurationDays: 3
            }
        });

        expect(profile.plannedStayDays).toBe(3);
        expect(profile.requiresResidencePermit).toBe(false);
        expect(profile.requiresWorkPermit).toBe(false);
    });

    it("requires a residence permit for a long private stay", () => {
        const profile = generateMigrationProfile({
            countryOfOrigin: "Belvar",
            options: {
                forcedTravelPurpose: TRAVEL_PURPOSES.LONG_STAY,
                forcedStayDurationDays: 180
            }
        });

        expect(profile.requiresResidencePermit).toBe(true);
        expect(profile.requiresWorkPermit).toBe(false);
        expect(profile.localAddress).toBeTruthy();
    });

    it("requires both permits and employment data for work", () => {
        const profile = generateMigrationProfile({
            countryOfOrigin: "Norvik",
            options: {
                forcedTravelPurpose: TRAVEL_PURPOSES.WORK,
                forcedStayDurationDays: 365
            }
        });

        expect(profile.requiresResidencePermit).toBe(true);
        expect(profile.requiresWorkPermit).toBe(true);
        expect(profile.employment).toEqual({
            occupation: expect.any(String),
            employer: expect.any(String)
        });
    });

    it("derives a long stay from the forced residence-permit requirement", () => {
        const profile = generateMigrationProfile({
            countryOfOrigin: "Auren",
            options: {
                forcedRequiresResidencePermit: true,
                forcedRequiresWorkPermit: false
            }
        });

        expect(profile.travelPurpose).toBe(TRAVEL_PURPOSES.LONG_STAY);
        expect(profile.requiresResidencePermit).toBe(true);
        expect(profile.requiresWorkPermit).toBe(false);
    });

    it("makes a forced work permit depend on a residence permit", () => {
        const profile = generateMigrationProfile({
            countryOfOrigin: "Norvik",
            options: {
                forcedRequiresResidencePermit: true,
                forcedRequiresWorkPermit: true
            }
        });

        expect(profile.travelPurpose).toBe(TRAVEL_PURPOSES.WORK);
        expect(profile.requiresResidencePermit).toBe(true);
        expect(profile.requiresWorkPermit).toBe(true);
    });
});
