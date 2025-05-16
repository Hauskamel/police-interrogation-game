import {useEffect, useState} from "react";
import { Minus, Plus } from 'lucide-react';

export const BaseTextbox = ({ title, width, height, margin, onClose, children, carId, isCloseable = true, isMinimizable = false, withoutHeader = false }) => {
    const [isVisible, setIsVisible] = useState(true); // for fade state
    const [minimized, setMinimized] = useState(false);
    const [shouldRender, setShouldRender] = useState(true); // control unmount

    const handleClose = () => {
        setIsVisible(false);                // trigger fade-out
        setTimeout(() => {
            setShouldRender(false);         // unmount after animation
            onClose();                      // optional callback
        }, 150);                            // match fade-out duration
    };

    useEffect(() => {
        setShouldRender(true);
        setIsVisible(true);
    }, [carId]);

    if (!shouldRender) return null;

    return (
        <div
            className={`${margin} absolute left-8 z-30 sm:w-80 bg-pink-50 border border-pink-200 rounded-3xl shadow-lg p-5 space-y-4 ${isVisible ? 'animate-fade-in' : 'animate-fade-out'}`}
            style={{
                width: `${width}px`,
                height: minimized ? '50px' : `${height}px`
        }}
        >
            {!withoutHeader && (
                <div className="flex justify-between items-center">
                    {title && (
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                            {title}
                        </h3>
                    )}
                    <div>
                        {isMinimizable && (
                            <button
                                onClick={() => setMinimized((m) => !m)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                {/* Todo: add icons for + and - */}
                                {minimized ? <Plus size={18} /> : <Minus size={18} />}
                            </button>
                        )}

                        {isCloseable && handleClose && (
                            <button
                                onClick={handleClose}
                                className="text-gray-900 hover:text-gray-800 transition-colors text-lg cursor-pointer"
                                aria-label="Close"
                            >
                                ✖
                            </button>
                        )}
                    </div>
                </div>
            )}

            {!minimized && (
                <div className="space-y-3 text-sm">{children}</div>
            )}
        </div>
    );
};