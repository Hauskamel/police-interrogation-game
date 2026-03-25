// import { useEffect } from "react";
// import { randInt } from "three/src/math/MathUtils.js";

// import { useCarStore, useNpcStore } from "../store.js";
// import { npcWithVehicleGenerator } from "../utils/generators/profileGenerators/npcWithVehicleGeneratorGenerator.js";


// // this function has an interval that puts random generated "entities" into the 'addCar' state for the useCarStore
// export function useVehicleEntityGenerator (direction, lane) {
//     const addCar = useCarStore((state) => state.addCar);
//     const criminalDatabase = useNpcStore((state) => state.criminalDatabase);

//     // creates new entity
//     useEffect(() => {
//         let respawnTime = randInt(5000, 10000);
//         const intervalId = setInterval(() => {


//             // TODO: PART FOR SPAWNING ENTITIS NEEDS TO BE REWRITTEN
//             // ######################################
//             // ######################################
//             // NEW VERSION:
//             // ######################################
//             // ######################################
//             const spawnCriminal = Math.random() < 0.5; // is npc either a 'normal' civilian or a criminal/smuggler
//             let newEntity;

//             if (!spawnCriminal) {
//                 newEntity = npcWithVehicleGenerator();
//             } else {
//                 // spawn a criminal
//                 const spawnSmuggler = Math.random() < 0.5; // decide wether criminal is a smuggler;
//             }



//             newEntity = {...newEntity, spawn: {direction, lane}};

//             addCar(newEntity);

//         }, respawnTime, criminalDatabase);
        
//         return () => clearInterval(intervalId);
//     }, [addCar, criminalDatabase]);
// }