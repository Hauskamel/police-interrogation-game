// ##### Registered Vehicle Resolver
// -----> Löst das erste auf einen Datenbank-NPC registrierte Fahrzeug auf.
// ---> Known- und Wanted-Traffic-Factories verwenden dadurch dieselbe Relationslogik.
export function getRegisteredVehicleRecord(criminalDatabase, databaseNpcRecord) {
    const vehicleId = databaseNpcRecord?.vehicleIds?.[0];

    return criminalDatabase?.vehiclesById?.[vehicleId];
}
