import { LaptopMenuManager } from "../../manager/LapatopMenuManager.jsx";
import { Patch } from "../police-laptop/screen-components/Patch.jsx";
import { DatabaseScreen } from "../police-laptop/screen-components/database-screen/DatabaseScreen.jsx";


export function LaptopScreen () {

    return (
        <>
            <div
                className="bg-laptop absolute top-0 h-screen w-screen grid grid-cols-3 gap-3"
            >
                <div className='col-span-1'>
                    <Patch />
                    <LaptopMenuManager />
                </div>

                <div className='col-span-2'>
                    <DatabaseScreen />
                </div>
            </div>
        </>
    )
}