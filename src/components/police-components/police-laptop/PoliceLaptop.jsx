import { PoliceLaptopScreen } from "./PoliceLaptopScreen";


export function PoliceLaptop () {
    const [isOpen, setIsOpen] = useState(false);

    return (
            <>
                <button 
                    onClick={() => setIsOpen(prev => !prev)}
                    className="gap-2 bg-white/90 p-2 rounded-xl shadow-lg border border-gray-300"
                >
                    <IoIosRadio 
                        className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xl transition
                            ${isOpen
                                ? "bg-blue-600 text-white border-blue-700"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }
                        `}
                    />
                </button>
    
                
                {isOpen &&
                    <div className="fixed bottom-25 bg-no-repeat bg-cover right-4 bg-[url(/images/policeradio.png)] w-45 h-120">
                        <Display />
                    </div>
                }
                
                
            </>
    )
}