import { describe, expect, it } from "vitest";

import {
    createStreetbayPullOverRoute,
    getTrafficRoutes,
    TRAFFIC_ROUTE_SPAWNS
} from "./trafficRoutes.js";

describe("traffic routes", () => {
    it("provides two straight lanes in each direction", () => {
        expect(TRAFFIC_ROUTE_SPAWNS).toEqual([
            { direction: "left", lane: 1 },
            { direction: "left", lane: 2 },
            { direction: "right", lane: 1 },
            { direction: "right", lane: 2 }
        ]);

        getTrafficRoutes().forEach(({ route }) => {
            const start = route.getPointAt(0);
            const middle = route.getPointAt(0.5);
            const end = route.getPointAt(1);

            expect(middle.z).toBe(start.z);
            expect(end.z).toBe(start.z);
            expect(middle.y).toBe(start.y);
            expect(end.y).toBe(start.y);
        });
    });

    it("ends the pull-over path at the police origin", () => {
        const drivingRoute = getTrafficRoutes()[0].route;
        const pullOverRoute = createStreetbayPullOverRoute(
            drivingRoute.getPointAt(0.5)
        );

        expect(pullOverRoute.getPointAt(1).toArray()).toEqual([0, 0, 0]);
    });
});
