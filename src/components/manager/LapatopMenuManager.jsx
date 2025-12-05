import { useEffect, useState } from "react";
import { MenuListElement } from "../police-components/police-laptop/screen-components/laptop-menu/MenuListElement.jsx"


export function LaptopMenuManager () {
    const menuComponents = ["Database", "History", "PLACEHOLDER"];

    const [clickedIdx, setClickedIdx] = useState(null);

    useEffect(() => {
        console.log(clickedIdx);
    }, [setClickedIdx, clickedIdx])


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