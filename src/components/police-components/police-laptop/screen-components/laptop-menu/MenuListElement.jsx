import { useCallback } from "react";


export function MenuListElement ({setClickedElement, clickedElem, title}) {

    const handleClick = useCallback ((e) => {
        e.stopPropagation();
        setClickedElement(e)
    })


    return (
        <>
            <div className={`mb-5 ${clickedElem ? "bg-laptop-menu-list-element-selected" : "bg-laptop-menu-list-element-unselected"}`}
                onClick={handleClick}    
            >
                <p>{title}</p>
            </div>
            
        </>
    )
}