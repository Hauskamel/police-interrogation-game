import { useCallback, useState } from "react";
import { useNpcStore } from "../../../store"

import { ListElement } from "./ListElement";


export function Database ({}) {
    const criminalDatabase = useNpcStore(state => state.criminalDatabase);

    const dbContent = criminalDatabase.map((row, i) => {
        const driverProfile = row.driverProfile.realProfile

        const handleHoverChange = (e) =>  {
            console.log(e);
        }

        

        return (
            <>
                <ListElement 
                    hovering={(hovering) => {handleHoverChange(hovering)}} 
                    profile={driverProfile}
                    key={i} />  
            </>
        )
    })
    

    return (
        <>
            <div>
                {dbContent}
            </div>
        </>
    )
}