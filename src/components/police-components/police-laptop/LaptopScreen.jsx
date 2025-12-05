import { LaptopMenu } from "./screen-components/laptop-menu/LaptopMenu.jsx";
import { Home } from "../police-laptop/screen-components/Home.jsx";
import { DatabaseScreen } from "../police-laptop/screen-components/database-screen/DatabaseScreen.jsx";
import { HomeScreen } from "../police-laptop/screen-components/home-screen/HomeScreen.jsx";



export function LaptopScreen () {



    

    // <HomeScreen />


    return (
        <>
            <div
                className="bg-laptop absolute top-0 h-screen w-screen grid grid-cols-3 gap-3"
            >
                <div className='col-span-1'>
                    <Home />
                    <LaptopMenu />
                </div>

                <div className='col-span-2'>
                    
                    
                </div>
            </div>
        </>
    )
}