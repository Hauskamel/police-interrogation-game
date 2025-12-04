import { useCallback, useState } from "react";
import { useNpcStore } from "../../../store"

import { ListElement } from "./ListElement";


export function Database ({}) {
    const criminalDatabase = useNpcStore(state => state.criminalDatabase);
      
    const [hoveredIdx, setHoveredIdx] = useState(null);

    return (
        <>
            <div>
                {criminalDatabase.map((row, i) => {
                    const driverProfile = row.driverProfile.realProfile;

                    return (
                        <ListElement
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