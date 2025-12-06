import { useEffect, useState } from "react";
import { MenuListElement } from "./MenuListElement.jsx"



export function LaptopMenu ({setActiveMenuIdx}) {
    const menuComponents = ["Home", "Database", "PLACEHOLDER", "PLACEHOLDER"];
    const [clickedIdx, setClickedIdx] = useState(0);


    useEffect(() => {
        setActiveMenuIdx(clickedIdx)
    }, [clickedIdx, setClickedIdx])
    

    return (
        <>
            <div className="mt-10">
            {
                menuComponents.map((_, i) => {

                    
                    return (
                        <>
                            <MenuListElement 
                                clickedElem={clickedIdx === i}
                                setClickedElement={
                                    (isClicked) => {setClickedIdx(isClicked ? i : null)}
                                } // TODO: Hier mal die Logik nachschlagen
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