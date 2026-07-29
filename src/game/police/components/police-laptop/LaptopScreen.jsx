import { useState } from "react";

import { HomeScreen } from "./screen-components/home-screen/HomeScreen.jsx";
import { LaptopMenu } from "./screen-components/laptop-menu/LaptopMenu.jsx";

export function LaptopScreen () {
    const [activeMenuIdx,setActiveMenuIdx] = useState(0);

    // TODO: Die Laptop-Navigation gemeinsam mit den künftigen Screens neu aufbauen.
    // ---> Der alte, auskommentierte Datenbank-Prototyp wurde bewusst vollständig entfernt.
    const components = [
        {screenComponent: <HomeScreen />},
        {screenComponent: null},
        {screenComponent: null}                      
    ]


    return (
        <>
            <div
                className="bg-laptop absolute top-0 h-screen w-screen grid grid-cols-3 gap-3"
            >
                <div className='col-span-1'>
                    <LaptopMenu setActiveMenuIdx={setActiveMenuIdx} />
                </div>

                <div className='col-span-2'>
                    {components[activeMenuIdx]?.screenComponent ? components[activeMenuIdx].screenComponent : "Coming soon..."}
                </div>
            </div>
        </>
    )
}
