import { useState } from "react";
import { WantedList } from "../pages/WantedList";


import { LuNotebook } from "react-icons/lu";



export function Notebook () {
    const [isOpen, setIsOpen] = useState(false)

    


    return (
        <>
            <button 
                className="fixed bottom-5 right-35 flex gap-2 bg-white/90 p-2 rounded-xl shadow-lg border border-gray-300"
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
                <div id="notebook" class="fixed bottom-25 right-4 w-150 h-100 flex shadow-lg border border-gray-400 bg-white rounded-lg overflow-hidden">
    
                    <div class="w-1/2 h-full p-4 bg-yellow-100 border-r border-gray-300">
                        <WantedList />
                    </div>

    
                    <div class="w-1/2 h-full p-4 bg-yellow-50">
                        <p class="text-sm text-gray-800">Das ist die rechte Seite</p>
                    </div>

                </div>
            }
            
            
        </>
    )
    
}