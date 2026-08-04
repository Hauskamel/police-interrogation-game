import { createNpcPresentedProfile } from "./createNpcPresentedProfile.js";
import { createInsurancePresentedProfile } from "./createInsurancePresentedProfile.js";
import { createVehiclePresentedProfile } from "./createVehiclePresentedProfile.js";

// ##### Presented Profiles Factory
// -----> Erzeugt die sichtbaren NPC- und Fahrzeugprofile aus real und documentState.
// ---> Traffic-Generatoren nutzen diese Schicht, statt selbst Dokumentfelder zu manipulieren.
export function createPresentedProfiles({
    driverProfile,
    insuranceProfile,
    vehicleProfile,
    documentState
}) {
    return {
        driverProfile: {
            real: driverProfile.real,
            presented: createNpcPresentedProfile(driverProfile.real, documentState)
        },
        insuranceProfile: {
            real: insuranceProfile.real,
            presented: createInsurancePresentedProfile(
                insuranceProfile.real,
                documentState
            )
        },
        vehicleProfile: {
            real: vehicleProfile.real,
            presented: createVehiclePresentedProfile(vehicleProfile.real, documentState)
        }
    };
}
