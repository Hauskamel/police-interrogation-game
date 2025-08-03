// NOTE: THIS ALGORYTHM MIGHT BE ALTERED TO WORK FOR BOTH - DRIVER AND CAR
// NOTE: ----- for testing purposes its only for the car -----


// this is the actual/original/legitimate profile of the car 
const generateRealCarProfile = () => {
    // ########## CAR INFORMATION ##########
    // #####################################
    // car brand
    const brandName = getRandomCarBrand();
    const carProfile = carProfiles[brandName]

    // car model
    const brandModel =  carProfile.models[Math.floor(Math.random() * carProfile.models.length)]

    // car registration
    const carRegistrationNumber = faker.vehicle.vrm();

    // car plate
    const plateNumber = "AC - " + carRegistrationNumber.slice(2).replace(/^(.{2})/, '$1 ')

    const profile = {
        brandName,
        brandModel,
        plateNumber,
        carRegistrationNumber,
        plateNumber
    }
    return profile;
}



const randomPercentage = () => {
    return Math.floor(Math.random() * 100);
}

if (randomPercentage > 50) {
    createFakeProfile();
}




const createFakeProfile = () => {
    const chancesOfError = [100, 20, 10, 5];

    if (randomPercentage >= chancesOfError[0]) {
        chancesOfError.slice(0, 1);
        console.log();
        
    }
}