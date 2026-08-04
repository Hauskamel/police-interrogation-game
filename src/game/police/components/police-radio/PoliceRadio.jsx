import { useState } from "react"
import { Display } from "./Display";
import { IoIosRadio } from "react-icons/io";

export function PoliceRadio () {
    const [isOpen, setIsOpen] = useState(false)

    return (
            <>
                <button 
                    type="button"
                    onClick={() => setIsOpen(prev => !prev)}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition cursor-pointer
                        ${isOpen
                            ? "bg-blue-600 text-white border-blue-700"
                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                        }
                    `}
                    aria-expanded={isOpen}
                >
                    <IoIosRadio 
                        className="h-5 w-5 shrink-0"
                        aria-hidden="true"
                    />
                    Funkgerät
                </button>
    
                
                { isOpen &&
                    <div className="fixed bottom-25 right-4 z-[750] h-120 w-45 bg-[url(/images/policeradio.png)] bg-cover bg-no-repeat">
                        <Display />
                    </div>
                }
                
                
            </>
        )

}
