import { LaptopMenu } from "./screen-components/laptop-menu/LaptopMenu.jsx";
// import { DatabaseScreen } from "../police-laptop/screen-components/database-screen/DatabaseScreen.jsx";
import { HomeScreen } from "../police-laptop/screen-components/home-screen/HomeScreen.jsx";
import { useEffect, useState } from "react";



export function LaptopScreen () {
    const [activeMenuIdx,setActiveMenuIdx] = useState(0);

    // TODO: 'components' auslagern und neues key/value pair "menuTitle" o.ä dazuschreiben, dass diese auch aus dem "LaptopMenu" component entfernt werden können
    // und in Zukunft die Menüpunkter leichter ergänzt, abgeändert werden können
    const components = [
        {screenComponent: <HomeScreen />},
        // {screenComponent: <DatabaseScreen />},
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