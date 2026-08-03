import { faker } from "@faker-js/faker";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetGameClock } from "@game/shared";

import { generateIssueAndExpiryDate } from "./generateIssueAndExpiryDate.js";


describe("generateIssueAndExpiryDate", () => {
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

    it("creates a valid card inside the current license cycle", () => {
        const dates = generateIssueAndExpiryDate("1990-04-12", {
            forceExpired: false
        });

        expect(dates.licensedSince).toBe("2008-04-12");
        expect(dates.formattedIssueDate >= dates.licensedSince).toBe(true);
        expect(dates.formattedIssueDate <= "2026-08-03").toBe(true);
        expect(dates.formattedExpiryDate >= "2026-08-03").toBe(true);
    });

    it("keeps an intentionally expired card within the recent expiry window", () => {
        const dates = generateIssueAndExpiryDate("1970-01-15", {
            forceExpired: true
        });

        expect(dates.formattedIssueDate >= dates.licensedSince).toBe(true);
        expect(dates.formattedExpiryDate >= "2023-08-03").toBe(true);
        expect(dates.formattedExpiryDate < "2026-08-03").toBe(true);
    });
});
