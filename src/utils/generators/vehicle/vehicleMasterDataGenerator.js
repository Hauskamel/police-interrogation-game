import { faker } from "@faker-js/faker";

export function vehicleMasterData () {
    // car registration
    const carRegistrationNumber = faker.vehicle.vrm();

    // car plate
    const plateNumber = "AC - " + carRegistrationNumber.slice(2).replace(/^(.{2})/, '$1 ');


    const vehicleMasterData = {
        plateNumber,
        carRegistrationNumber
    }

    return vehicleMasterData
    
}