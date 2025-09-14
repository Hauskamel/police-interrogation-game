
// ---> toManipulate generator for random choices
const randomChance = (percent) => {
    return Math.random() < percent / 100
}

// ---> applies manipulation(s) to the passed profile
export const applyRandomManipulations = (profile, manipulations) => {    

    const chancesOfManipulation = manipulations.map((_, i) => Math.floor(100 / (i+1))); // (i+1) to ensure 1 manipulation min.

    let toManipulate;
    let manipulationsCopy = manipulations.map((_,i) => i)
    
    let manipulatedProfile = profile
    do {
        toManipulate = randomChance(chancesOfManipulation[0]) // takes current max chance of manipulation --> returns true or false
        
        // ---> EXIT, if the randomChance is higher than given
        if (!toManipulate) {
            return manipulatedProfile;
        };
        chancesOfManipulation.shift() // removes first/current max toManipulate
        
        const randomIndex = manipulationsCopy[Math.floor(Math.random() * manipulationsCopy.length)]; // function to select a random key from the 'manipulations' array (key = function in array)
        manipulationsCopy = manipulationsCopy.filter(n => n !== randomIndex); // remove the executed function to not allow to execute again -> otherwise a field coule be manipulated twice 
        const manipulation = manipulations[randomIndex]; // store that function into a variable
        
        manipulatedProfile = manipulation(manipulatedProfile); // execute function via variable to manipulate the profile
    } while (toManipulate)
}