import { MenuListElement } from "./MenuListElement.jsx"


export function LaptopMenu () {
    const menuComponents = ["Database", "History"]

    return (
        <>
            {
                menuComponents.map(elem => {
                    <MenuListElement 
                        className=""
                    />
                })
            }
        </>
    )
}