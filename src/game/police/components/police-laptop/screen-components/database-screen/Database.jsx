// import { useMemo, useState } from "react";
// import { DatabaseListElement } from "./DatabaseListElement.jsx"


// export function Database ({ userInput }) {
//     const criminalDatabase = useNpcStore(state => state.criminalDatabase);

//     const [hoveredIdx, setHoveredIdx] = useState(null);
//     const [clickedIdx, setClickedIdx] = useState(null);

//     const filteredDatabase = useMemo(() => {
//         if (!userInput) return;
//         const term = String(userInput).toLowerCase();

//         return criminalDatabase.filter(row => {
//             const keywords = row?.searchKeyWords ?? "";
//             return String(keywords).toLowerCase().includes(term); // returns true or false for each "row" --> 'filteredDatabase' only returns the elements that are "true"
//         })
//     }, [userInput, criminalDatabase])

//     const profileArray = filteredDatabase?.length > 0
//         ? filteredDatabase
//         : criminalDatabase


//     return (
//         <>
//         {
//             profileArray.map((entityProfile, i) => {
//                 return (
//                     <DatabaseListElement
//                         hoveredElem={hoveredIdx === i}
//                         setHoveredElement={isHovering => {setHoveredIdx(isHovering ? i : null)}}
//                         setClickedElement={isClicked => {setClickedIdx(isClicked ? i : null)}}
//                         clickedElement={clickedIdx === i}
//                         entityProfile={entityProfile}
//                         key={entityProfile.id}
//                     />
//                 )
//             })

           
//         }
            
//         </>
//     )
// }
