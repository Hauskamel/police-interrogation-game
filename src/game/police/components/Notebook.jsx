import { useState } from "react";
// import { WantedList } from "./pages/WantedList";

import { LuNotebook } from "react-icons/lu";

/**
 * ##### Notebook
 * -----> Polizeiliches Notizbuch fuer Spielinformationen und spaetere Wanted-List-Daten.
 */
export function Notebook () {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
        <>
            <button 
                type="button"
                className={`flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition cursor-pointer
                    ${isOpen
                        ? "bg-blue-600 text-white border-blue-700"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    }
                `}
                onClick={() => setIsOpen(prev => !prev)}
                aria-expanded={isOpen}
            >
                <LuNotebook 
                    className="h-5 w-5 shrink-0"
                    aria-hidden="true"
                />
                Handbuch
            </button>

            { isOpen &&
                <div className="fixed bottom-25 right-4 z-[750] h-105 w-150 bg-[url(/images/notebook.png)] bg-contain bg-cover bg-no-repeat">
                    <div className="w-1/2 h-full pt-15 pl-10 pr-10 text-gray-800 border-r border-gray-300">
                        {/* <WantedList /> */}
                    </div>
                </div>
            }
        </>
    )
    
}
