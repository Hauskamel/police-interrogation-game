import * as THREE from "three";
import { STREETBAY_ENTRY_1 } from "../config/positions";


// Create a Curve with the given Vector3 coordinates
export const streetbayEntryCoordinates = new THREE.CubicBezierCurve3(
    new THREE.Vector3(STREETBAY_ENTRY_1[0], STREETBAY_ENTRY_1[1], STREETBAY_ENTRY_1[2]),
    new THREE.Vector3(STREETBAY_ENTRY_1[0] - 2, STREETBAY_ENTRY_1[1], STREETBAY_ENTRY_1[2]),
    new THREE.Vector3(STREETBAY_ENTRY_1[0] - 5, STREETBAY_ENTRY_1[1], STREETBAY_ENTRY_1[2] - 2.4),
    new THREE.Vector3(STREETBAY_ENTRY_1[0] - 7, STREETBAY_ENTRY_1[1], STREETBAY_ENTRY_1[2] - 2.4),
);