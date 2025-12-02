import { useGameStore } from "../../../store";
import { PoliceLaptopScreen } from "./PoliceLaptopScreen";
import { useState } from "react";


export function PoliceLaptop () {
    const [isOpen, setIsOpen] = useState(false);
    const gameState = useGameStore(state => state.gameState)


    return (
            <>  
                {gameState === "LAPTOP" &&
                    <div 
                            className="absolute bottom-[25px] right-4 w-[90%] h-[90%] bg-no-repeat bg-cover bg-[url('/images/police-car-laptop.png')]"
                    >
                        <PoliceLaptopScreen />
                    </div>
                }
            </>
    )
}