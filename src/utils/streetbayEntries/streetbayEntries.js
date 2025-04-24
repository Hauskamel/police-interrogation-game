import * as THREE from "three";

// entry coordinates of bay entry
const entry1Coordinates = [15, 0,  -.6]


// Create a Curve with the given Vector3 coordinates
export const streetbayEntry = new THREE.CatmullRomCurve3([
    new THREE.Vector3(entry1Coordinates[0], entry1Coordinates[1], entry1Coordinates[2]),
    new THREE.Vector3(entry1Coordinates[0] - 2, entry1Coordinates[1], entry1Coordinates[2]),
    new THREE.Vector3(entry1Coordinates[0] - 5, entry1Coordinates[1], entry1Coordinates[2] - 2.4),
    new THREE.Vector3(entry1Coordinates[0] - 7, entry1Coordinates[1], entry1Coordinates[2] - 2.4),
]);