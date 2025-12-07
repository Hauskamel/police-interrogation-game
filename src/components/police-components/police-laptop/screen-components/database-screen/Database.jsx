import { use, useEffect, useState } from "react";
import { useNpcStore } from "../../../../../store"

import { DatabaseListElement } from "./DatabaseListElement.jsx"


export function Database ({ userInput }) {
    const criminalDatabase = useNpcStore(state => state.criminalDatabase);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const allSearchKeyWords = criminalDatabase.map((profile, i) => {
        const array = [profile.searchKeyWords.join(""), i]
        return array
    })
    
    
    console.log(allSearchKeyWords);
    



    // console.log(allSearchKeyWords);
    

    
    useEffect(() => {
        crawlDatabase()
    }, [userInput])

    const updateScreen = () => {

    }


    
    const crawlDatabase = () => {
        const dbCopy = criminalDatabase;

        dbCopy.filter(row => {

        })
    }
    
    




    // console.log("database: ", criminalDatabase);
    
    



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