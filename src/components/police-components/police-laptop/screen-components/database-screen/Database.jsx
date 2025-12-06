import { useCallback, useState } from "react";
import { useNpcStore } from "../../../../../store"

import { DatabaseListElement } from "./DatabaseListElement.jsx"


export function Database ({ setSearch }) {
    const criminalDatabase = useNpcStore(state => state.criminalDatabase);
    const [hoveredIdx, setHoveredIdx] = useState(null);



    console.log(setSearch);
    



    return (
        <>
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
        </>
    )
}