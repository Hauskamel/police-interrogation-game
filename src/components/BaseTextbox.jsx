
export const BaseTextbox = ({ title, onClose, children }) => {
    return (
        <div className="absolute bottom-8 left-8 z-30 w-72 sm:w-80 bg-pink-50 border border-pink-200 rounded-3xl shadow-lg p-5 animate-fade-in space-y-4">
            <div className="flex justify-between items-center">
                {title && (
                    <h3 className="text-lg font-bold text-pink-600 tracking-tight">
                        {title}
                    </h3>
                )}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-pink-400 hover:text-pink-600 transition-colors text-lg"
                        aria-label="Close"
                    >
                        ✖
                    </button>
                )}
            </div>

            <div className="space-y-3 text-sm text-pink-700">{children}</div>
        </div>
    );
};