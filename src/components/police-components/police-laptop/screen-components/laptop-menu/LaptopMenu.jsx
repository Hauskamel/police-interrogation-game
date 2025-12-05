import { useEffect, useState } from "react";
import { MenuListElement } from "./MenuListElement.jsx"

import { DatabaseScreen } from "../database-screen/DatabaseScreen.jsx";


export function LaptopMenu () {
    const menuComponents = ["Database", "History", "PLACEHOLDER"];

    const [openElement, setOpenElement] = useState(() => 
        Object.fromEntries(menuComponents.map(elem => [elem, false]))
    )

    const [clickedIdx, setClickedIdx] = useState(null);

    const toggleMenuElement = (elem) => {
        setOpenElement(prev => ({
            ...prev,
            [elem]: !prev[elem]
        }))
    }


    useEffect(() => {
        console.log(clickedIdx);
    }, [setClickedIdx, clickedIdx])

    const components = {
        database: 
            <DatabaseScreen />,
        
        history:
            <History />,

        placeholder:
            <History />
    }


    return (
        <>
            <div className="mt-10">
            {
                menuComponents.map((comp, i) => {
                    return (
                        <>
                            <MenuListElement 
                                clickedElem={clickedIdx === i}
                                setClickedElement={(isClicked) => setClickedIdx(isClicked ? i : null)} // TODO: Hier mal die Logik nachschlagen
                                title={menuComponents[i]}
                                key={i}
                            />
                        </>
                    )
                    
                })
            }
            </div>
        </>
    )
}