import * as THREE from "three";

export function setVehicleSpawnPosition (car) {
    let position, rotation;

    if (car.spawn.direction === "left") {
        rotation = new THREE.Euler(0, Math.PI / 2, 0);
        const xy = [70, 0]; // y and z position
        
        
        switch (car.spawn.lane) {
            case 0:      // x,  y, z
                position = [0, 0, undefined]; // spawning at police lane 
                                // due to the "drive forward" animation is still handeled by just changing the z position of the car
                                // the z position of the controlled car is controlled via the 'useVehicleAnimation' hook
                break;
            case 1:            
                position = [...xy, 9];
                break;
            case 2:
                position = [...xy, 14];
                break;
            case 3:
                position = [...xy, 20];
                break;
        }

    } else if (car.spawn.direction === "right") {
        rotation = new THREE.Euler(0, - Math.PI / 2, 0);
        const xy = [-70, 0]; // y and z position
        
        switch (car.spawn.lane) {
            case 1:            
                position = [...xy, 30];
                break;
            case 2:
                position = [...xy, 36];
                break;
            case 3:
                position = [...xy, 42];
                break;
        }
    } else {
        return;
    }

    return { position, rotation }
}