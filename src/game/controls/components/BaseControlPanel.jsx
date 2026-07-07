import { useEffect } from "react";
import { useClosePanel } from "../hooks";

import { useGuiVisibilityStatesStore } from "../../../stores";

/**
 * ##### Base Control Panel
 * -----> Wiederverwendbarer 2D-Container fuer Interaktions-Panels.
 * @param {boolean} isCloseable - to determine wether 'X' for closing is available or not (default: true)
 * @param {function} onClose - Callback function when panel is closed
 */
export const BaseControlPanel = ({ 
        title, 
        width, 
        height, 
        margin, 
        children,
        onClose,
        isCloseable = true
}) => {
    const setPanelVisibility = useGuiVisibilityStatesStore(state => state.setControlPanelVisibilityState);
    const controlPanelsAreVisible = useGuiVisibilityStatesStore(state => state.controlPanelsVisible);

    const handleClose = () => {
        useClosePanel(setPanelVisibility, onClose);
    };

    useEffect(() => {
        setPanelVisibility(true);
    }, [setPanelVisibility]);

    return (
        <div
            className={`${margin} absolute left-8 z-1 sm:w-80 bg-white rounded-3xl shadow-lg p-5 space-y-4 ${controlPanelsAreVisible ? 'animate-fade-in' : 'animate-fade-out'}`}
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
