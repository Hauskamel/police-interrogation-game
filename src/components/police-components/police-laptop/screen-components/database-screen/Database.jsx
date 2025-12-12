import { useMemo, useState } from "react";
import { useNpcStore } from "../../../../../store";
import { DatabaseListElement } from "./DatabaseListElement.jsx"


export function Database ({ userInput }) {
    const criminalDatabase = useNpcStore(state => state.criminalDatabase);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [clickedIdx, setClickedIdx] = useState(null);

    const filteredDatabase = useMemo(() => {
        if (!userInput) return;
        const term = String(userInput).toLowerCase();

        return criminalDatabase.filter(row => {
            const keywords = row?.searchKeyWords ?? "";
            return String(keywords).toLowerCase().includes(term); // returns true or false for each "row" --> 'filteredDatabase' only returns the elements that are "true"
        })
    }, [userInput, criminalDatabase])

    const loopedArray = filteredDatabase?.length > 0
        ? filteredDatabase
        : criminalDatabase













    
    

    return (
        <>
        {
            loopedArray.map((row, i) => {
                const driverProfile = row.driverProfile.realProfile;


                

                
                

                return ( !clickedIdx ?
                    <DatabaseListElement
                        hoveredElem={hoveredIdx === i}
                        setHoveredElement={isHovering => {setHoveredIdx(isHovering ? i : null)}}
                        setClickedElement={isClicked => {setClickedIdx(isClicked ? i : null)}}
                        clickedElement={clickedIdx === i}
                        profile={driverProfile}
                        key={row.id}
                    />

                    :

                    <p>Test</p>
                    
                    
                )
            })

           
        }
            
        </>
    )
}