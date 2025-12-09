import { use, useEffect, useState } from "react";
import { useNpcStore } from "../../../../../store"

import { DatabaseListElement } from "./DatabaseListElement.jsx"


export function Database ({ userInput }) {
    const criminalDatabase = useNpcStore(state => state.criminalDatabase);    
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [filteredDatabase, setFilteredDatabase] = useState(null);

    useEffect(() => {
        const dbCopy = criminalDatabase;
        const dbFiltered = dbCopy.filter((row) => row.searchKeyWords.includes(userInput) ? row : null);
        setFilteredDatabase(dbFiltered);
    }, [userInput])

    return (
        <>
        {filteredDatabase?.length > 0 ? 
         <div>
                {filteredDatabase.map((row, i) => {
                    const driverProfile = row.driverProfile.realProfile;

                    return (
                        <DatabaseListElement
                            hoveredElem={hoveredIdx === i}
                            setHoveredElement={isHovering => {setHoveredIdx(isHovering ? i : null)}}
                            profile={driverProfile}
                            key={i}
                        />
                    )
                })}
            </div>
        :
            <div>
                {criminalDatabase.map((row, i) => {
                    const driverProfile = row.driverProfile.realProfile;

                    return (
                        <DatabaseListElement
                            hoveredElem={hoveredIdx === i}
                            setHoveredElement={isHovering => {setHoveredIdx(isHovering ? i : null)}}
                            profile={driverProfile}
                            key={i}
                        />
                    )
                })}
            </div>
        }
        </>
    )
}