import { carBrands } from "../../../data/carBrands.js";
import { faker } from "@faker-js/faker";
import getRandomCarBrand from "../../getter/getRandomCarBrand.js";


// -----> generator for the cars profile.
//        This function returns the real car profile and if random chances are < 50% also the fake profile
export const generateCarProfile = () => {
    // ########## CAR INFORMATION ##########
    // #####################################
    // car brand
    const brandName = getRandomCarBrand();
    const carProfile = carBrands[brandName];

    
    // issue date
    const minIssueYear = 1950;
    const maxIssueYear = Math.min(minIssueYear + 21, new Date().getFullYear());
    const issueFrom = new Date(`${minIssueYear}-01-01`);
    const issueTo = new Date(`${maxIssueYear}-12-31`);
    const issueDate = faker.date.between({ from: issueFrom, to: issueTo });
    const formattedIssueDate = issueDate.toISOString().split('T')[0];

    console.log(formattedIssueDate);
    

    
    // car model
    const brandModel = carProfile.models[Math.floor(Math.random() * carProfile.models.length)];

    // car registration
    const carRegistrationNumber = faker.vehicle.vrm();

    // car plate
    const plateNumber = "AC - " + carRegistrationNumber.slice(2).replace(/^(.{2})/, '$1 ');

    const realProfile = {
        brandName,
        brandModel,
        plateNumber,
        carRegistrationNumber,
        formattedIssueDate
    }
    
    return { realProfile }
}