import '../../../../assets/css/laptop-screen.css'

import { LaptopMenu } from "../police-laptop/screen-components/laptop-menu/LaptopMenu.jsx";
import { Patch } from "../police-laptop/screen-components/Patch.jsx";
import { DatabaseScreen } from "../police-laptop/screen-components/database-screen/DatabaseScreen.jsx";


export function LaptopScreen () {

    return (
        <>
            <div
                className="bg-laptop absolute top-0 h-screen w-screen grid grid-cols-3 gap-3"
            >
                <div className='flex col-span-1'>
                    <Patch />
                    <LaptopMenu />
                </div>

                <div className='col-span-2'>
                    <DatabaseScreen />
                </div>
            </div>
        </>
    )
}