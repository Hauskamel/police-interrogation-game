// // the reason why i decided to have the 'criminalDatabase' AND the 'wantedList' is that i can adjust the 'wantedList' later on 
// // for example for a mission where a certain character is wanted but has not most crimeLevel 



// import { useEffect } from "react";
// import { useNpcStore } from "../../store"
// import { BaseHeadlineWithText } from "../base-components/BaseHeadlineWithText.jsx"
// import { BaseImage } from "../base-components/BaseImage.jsx"


// export function WantedList () {
//     const criminalDatabase = useNpcStore(state => state.criminalDatabase);
//     const setWantedList = useNpcStore(state => state.setWantedList);


//     return (
//         <>
//             <h2 className="text-lg font-bold text-gray-900 tracking-tight">Wanted List</h2>

//             {finalWantedList.map((car, index) => {
//                 return (
//                     <>
//                         <div 
//                             className="flex"
//                             key={index}>
//                             <BaseImage useCase="wantedList" data={car.driverProfile.realProfile.driverImage} stoppedCar={car} />
//                             <BaseHeadlineWithText useCase="carDocument" documentDataField="driverFirstName" headline="" data={car.driverProfile.realProfile.firstName} />
//                             <BaseHeadlineWithText useCase="carDocument" documentDataField="driverFirstName" headline="" data={car.driverProfile.realProfile.lastName} />
//                         </div>
//                     </>
//                 )
//             })}
//         </>
//     )
// }