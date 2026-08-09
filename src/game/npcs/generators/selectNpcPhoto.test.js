import { describe, expect, it } from "vitest";

import { selectNpcPhoto } from "./selectNpcPhoto.js";

describe("selectNpcPhoto", () => {
    it("can select the scarred blond, blue-eyed portrait from its exact pool", () => {
        const photo = selectNpcPhoto(
            "male",
            "[30,39]",
            "blond",
            "blue",
            () => 0.99
        );

        expect(photo).toBe("driver11.jpg");
    });
});
