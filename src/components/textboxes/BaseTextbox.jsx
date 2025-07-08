import {useEffect} from "react";
import { closeTextbox } from "../../helpers/closeTextbox";

import { useTextboxStore } from "../../store";

/**
 * 2D Textbox on white background
 * can be filled with text & buttons
 * @param {boolean} isCloseable - to determine wether 'X' for closing is available or not (default: true)
 * @param {function} onClose - Callback function when textbox is closed
 */


export const BaseTextbox = ({ 
        title, 
        width, 
        height, 
        margin, 
        children,
        onClose,
        isCloseable = true
}) => {
    // textboxes
    const setTextboxVisibililty = useTextboxStore(state => state.setTextboxVisibilityState)
    const isVisible = useTextboxStore(state => state.textboxesVisible)


    const handleClose = () => {
        closeTextbox(setTextboxVisibililty,onClose);
    };

    useEffect(() => {
        setTextboxVisibililty(true);
    }, [setTextboxVisibililty]);


    return (
        <div
            className={`${margin} absolute left-8 z-30 sm:w-80 bg-pink-50 border border-pink-200 rounded-3xl shadow-lg p-5 space-y-4 ${isVisible ? 'animate-fade-in' : 'animate-fade-out'}`}
            style={{
                width: `${width}px`,
                height: `${height}px`
        }}
        >
            <div className="flex justify-between items-center">
                {title && (
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                        {title}
                    </h3>
                )}
                <div>

                    {isCloseable && handleClose && (
                        <button
                            onClick={() => handleClose()}
                            className="text-gray-900 hover:text-gray-800 transition-colors text-lg cursor-pointer"
                            aria-label="Close"
                        >
                            ✖
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-3 text-sm">{children}</div>
        </div>
    );
};