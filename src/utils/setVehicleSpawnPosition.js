import * as THREE from "three";

export function setVehicleSpawnPosition (car) {
    let position, rotation;

    if (car.spawn.direction === "left") {
        rotation = new THREE.Euler(0, Math.PI, 0);
        const yz = [0, -70]; // y and z position
        
        switch (car.spawn.lane) {
            case 0:      // x,  y, z
                position = [-9, 0, undefined]; // spawning at police lane 
                                // due to the "drive forward" animation is still handeled by just changing the z position of the car
                                // the z position of the controlled car is controlled via the 'useVehicleAnimation' hook
                break;
            case 1:            
                position = [.5, ...yz];
                break;
            case 2:
                position = [6, ...yz];
                break;
            case 3:
                position = [11, ...yz];
                break;
        }

    } else if (car.spawn.direction === "right") {
        rotation = new THREE.Euler(0, 0, 0);
        const yz = [0, 70]; // y and z position
        
        switch (car.spawn.lane) {
            case 1:            
                position = [20, ...yz];
                break;
            case 2:
                position = [23, ...yz];
                break;
            case 3:
                position = [28, ...yz];
                break;
        }
    } else {
        return;
    }

    return { position, rotation }
}