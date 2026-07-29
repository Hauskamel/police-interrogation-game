import { faker } from "@faker-js/faker";

// ##### Vehicle Registration Data Generator
// -----> Erstellt die amtliche Registrierungsnummer und das dazugehörige Kennzeichen.
// ---> Wird beim Aufbau eines echten Fahrzeugprofils verwendet.
export function generateVehicleRegistrationData() {
    const carRegistrationNumber = faker.vehicle.vrm();
    const plateNumber = "AC - " + carRegistrationNumber
        .slice(2)
        .replace(/^(.{2})/, "$1 ");

    return {
        plateNumber,
        carRegistrationNumber
    };
}
