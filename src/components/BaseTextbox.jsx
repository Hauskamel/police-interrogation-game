import {useEffect, useState} from "react";

export const BaseTextbox = ({ title, onClose, children, carId }) => {
    const [isVisible, setIsVisible] = useState(true); // for fade state
    const [shouldRender, setShouldRender] = useState(true); // control unmount

    const handleClose = () => {
        setIsVisible(false); // trigger fade-out
        setTimeout(() => {
            setShouldRender(false); // unmount after animation
            onClose();              // optional callback
        }, 150); // match fade-out duration
    };

    useEffect(() => {
        setShouldRender(true);
        setIsVisible(true);
    }, [carId]);

    if (!shouldRender) return null;

    return (
        <div className={`absolute bottom-8 left-8 z-30 w-72 sm:w-80 bg-pink-50 border border-pink-200 rounded-3xl shadow-lg p-5 space-y-4 ${isVisible ? 'animate-fade-in' : 'animate-fade-out'}`}>
            <div className="flex justify-between items-center">
                {title && (
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                        {title}
                    </h3>
                )}
                {handleClose && (
                    <button
                        onClick={handleClose}
                        className="text-gray-900 hover:text-gray-800 transition-colors text-lg cursor-pointer"
                        aria-label="Close"
                    >
                        ✖
                    </button>
                )}
            </div>

            <div className="space-y-3 text-sm">{children}</div>
        </div>
    );
};