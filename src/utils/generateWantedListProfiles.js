import { useState, useRef, useEffect } from "react";
import { generateDriverProfile } from "../utils/generateDriverProfile";
import { generateCarProfile } from "./generateCarProfile";

import { useWantedListStore } from "../store";



export function generateWantedListProfiles () {
    const criminals = [];

    while (criminals.length < 3) {
        const profile = {
            driverProfile: generateDriverProfile(),
            carProfile: generateCarProfile(),
            arrested: false
        }
        criminals.push(profile)
    }

    return criminals
}