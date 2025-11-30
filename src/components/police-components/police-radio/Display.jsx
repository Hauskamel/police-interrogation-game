import { useEffect, useState, useRef } from "react"
import { Radiooption } from "./Radiooption"

import { radioDisplayContent } from "../../../utils/policeRadioDisplayContent";

export function Display () {
    const [activeOptionIndex, setActiveOptionIndex] = useState(0);
    const containerRef = useRef(null)

    function onKeyDown (e) {
        if (e.key === "ArrowUp") {
            setActiveOptionIndex(prev => prev > 0 ? prev - 1 : radioDisplayContent.length - 1)
        } else if (e.key === "ArrowDown") {
            setActiveOptionIndex(prev => prev < radioDisplayContent.length-1 ? prev + 1 : 0)
        }
    };

    
return (
    <div
        ref={containerRef}
        onKeyDown={onKeyDown}
        tabIndex={0}
        className="bg-orange-100 tracking-tighter text-yellow-300 font-mono mt-48 ml-7 shadow-xl w-33"
        role="listbox"
    >
        { radioDisplayContent.map((option,i) => (
            <div
                key={option.label}
                className="mb-1 outline-none">
                <Radiooption title={option.label} index={i} activeOptionIndex={activeOptionIndex} />
            </div>
        ))
        }
    </div>
    )
}