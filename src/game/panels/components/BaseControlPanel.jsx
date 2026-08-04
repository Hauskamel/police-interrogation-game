import { useEffect, useRef, useState } from "react";

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
        isCloseable = true,
        positionClassName = "bottom-6 left-8"
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const closeTimerRef = useRef(null);

    const handleClose = () => {
        if (!onClose) return;

        setIsVisible(false);
        closeTimerRef.current = window.setTimeout(() => {
            onClose();
        }, 150);
    };

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                window.clearTimeout(closeTimerRef.current);
            }
        };
    }, []);

    return (
        <div
            className={`${margin ?? ""} ${positionClassName} fixed z-[700] sm:w-80 bg-white rounded-3xl shadow-lg p-5 space-y-4 ${isVisible ? 'animate-fade-in' : 'animate-fade-out'}`}
            style={{
                width: width ? `${width}px` : undefined,
                height: height ? `${height}px` : undefined
        }}
        >
            <div className="flex justify-between items-center">
                {title && (
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                        {title}
                    </h3>
                )}
                <div>

                    {isCloseable && onClose && (
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
