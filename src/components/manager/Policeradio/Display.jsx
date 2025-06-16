import { useEffect, useState } from "react"
import { Radiooption } from "./Radiooption"

import { RADIO_DISPLAY_CONTENT } from "../../../utils/policeRadioDisplayContent";

export function Display () {
    const [activeOptionIndex, setActiveOptionIndex] = useState(0);

    function onKeyDown (e) {
        const keyCode = e.keyCode;
        if (keyCode !== 40 && keyCode !== 38) return;
        

        switch (keyCode) {
            case 38:
                setActiveOptionIndex(activeOptionIndex > 0 ? activeOptionIndex - 1 : RADIO_DISPLAY_CONTENT.length - 1)
            break;

            case 40:
                setActiveOptionIndex(activeOptionIndex < RADIO_DISPLAY_CONTENT.length-1 ? activeOptionIndex + 1 : 0)
            break;
        }
    };

    
return (
    <div
        className="bg-orange-100 tracking-tighter text-yellow-300 font-mono mt-48 ml-7 shadow-xl w-33">
        { RADIO_DISPLAY_CONTENT.map((option,i) => (
			<div
                onKeyDown={e => onKeyDown(e)}
                tabIndex={activeOptionIndex}
                key={option.label}
                className="mb-1 outline-none">
                <Radiooption title={option.label} index={i} activeOptionIndex={activeOptionIndex} />
            </div>
        ))
        }
    </div>
    )
}