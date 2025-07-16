import { useState } from "react";
import { WantedList } from "../pages/WantedList";

import { LuNotebook } from "react-icons/lu";





export function Notebook () {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
        <>
            <button 
                className="fixed bottom-5 right-50 flex gap-2 bg-white/90 p-2 rounded-xl shadow-lg border border-gray-300"
                onClick={() => setIsOpen(prev => !prev)}
            >
                <LuNotebook 
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xl transition
                        ${isOpen
                            ? "bg-blue-600 text-white border-blue-700"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }
                    `}
                />
            </button>

            { isOpen &&
                <div className="fixed bottom-25 bg-no-repeat bg-cover right-4 bg-[url(/images/notebook.png)] w-150 h-105  bg-contain">
                    <div className="w-1/2 h-full pt-15 pl-10 pr-10 text-gray-800 border-r border-gray-300">
                        <WantedList />
                    </div>
                </div>
            }
            
            
        </>
    )
    
}