import { useGameStore } from "../../../store";
import { PoliceLaptopScreen } from "./PoliceLaptopScreen";
import { Searchbar } from "./Searchbar";
import { useState } from "react";


export function PoliceLaptop () {
    const [isOpen, setIsOpen] = useState(false);

    const gameState = useGameStore(state => state.gameState)


    function getInput (input) {


        console.log(input);
        

    }




    return (
            <>  
                {gameState === "LAPTOP" &&
                    <div className="fixed bottom-25 bg-no-repeat bg-cover right-4 bg-[url(/images/police-car-laptop.png)]">
                        <Searchbar input={getInput} />
                        <PoliceLaptopScreen  />
                    </div>
                }
            </>
    )
}