import { useEffect, useState } from "react";
import { WantedList } from "../pages/WantedList";

import { FaPersonBooth } from "react-icons/fa";

export function Notebook () {
    const [isOpen, setIsOpen] = useState(false)

    


    return (
        <>
            <button 
                className="fixed bottom-5 right-35 flex gap-2 bg-white/90 p-2 rounded-xl shadow-lg border border-gray-300"
                onClick={() => setIsOpen(true ? false : true)}
            >
                <FaPersonBooth 
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xl transition
                        ${isOpen
                            ? "bg-blue-600 text-white border-blue-700"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }
                    `}
                />
            </button>

            <div className="fixed bottom-8 right-40">
                
                <WantedList></WantedList>
            </div>
            
        </>
    )
    
}