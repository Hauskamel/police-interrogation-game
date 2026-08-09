export const NPC_PHOTO_CATALOG = {
    "driver1.jpg": photo("driver1.jpg", "[16,19]", "blond", "blue"),
    "driver2.jpg": photo("driver2.jpg", "[20,29]", "brown", "green"),
    "driver3.jpg": photo("driver3.jpg", "[20,29]", "black", "brown", ["scar_right_cheek"]),
    "driver4.jpg": photo("driver4.jpg", "[30,39]", "brunette", "brown", ["mole_below_left_eye"]),
    "driver5.jpg": photo("driver5.jpg", "[40,49]", "blond", "green"),
    "driver6.jpg": photo("driver6.jpg", "[40,49]", "black", "blue", ["scar_nose_bridge"]),
    "driver7.jpg": photo("driver7.jpg", "[50,59]", "brown", "brown"),
    "driver8.jpg": photo("driver8.jpg", "[50,59]", "brunette", "green", ["scar_center_chin"]),
    "driver9.jpg": photo("driver9.jpg", "[60,85]", "black", "brown"),
    "driver10.jpg": photo("driver10.jpg", "[60,85]", "blond", "blue", ["scar_right_temple"]),
    "driver11.jpg": photo("driver11.jpg", "[30,39]", "blond", "blue", ["scar_left_eyebrow"])
};

export const NPC_PHOTO_METADATA = NPC_PHOTO_CATALOG;

export const DISTINGUISHING_MARK_LABELS = {
    scar_right_cheek: "Narbe an der rechten Wange",
    mole_below_left_eye: "Muttermal unter dem linken Auge",
    scar_nose_bridge: "Narbe auf dem Nasenrücken",
    scar_center_chin: "Narbe mittig am Kinn",
    scar_right_temple: "Narbe an der rechten Schläfe",
    scar_left_eyebrow: "Narbe über der linken Augenbraue"
};

export function getNpcPhotoComparisonValue(fileName) {
    const metadata = NPC_PHOTO_CATALOG[fileName];
    if (!metadata) return null;

    return {
        photoIdentity: metadata.fileName,
        eyeColor: metadata.eyeColor,
        hairColor: metadata.hairColor,
        distinguishingMarks: [...metadata.distinguishingMarks]
    };
}

function photo(fileName, ageRange, hairColor, eyeColor, distinguishingMarks = []) {
    return {
        fileName,
        sex: "male",
        ageRange,
        hairColor,
        eyeColor,
        distinguishingMarks
    };
}
