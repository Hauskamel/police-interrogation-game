import { useCallback } from "react";

export function DatabaseListElement ({setHoveredElement, hoveredElem, profile}) {
    const image = profile.driverImage;
    const firstName = profile.firstName;
    const lastName = profile.lastName;

    // handling mouse event
    // using a callback function with the 
    const handleMouseEnter = useCallback((e) => {
        e.stopPropagation();
        setHoveredElement(e);
    }, [setHoveredElement])

    const handleMouseLeave = useCallback((e) => {
        e.stopPropagation();
        setHoveredElement(null);
    }, [setHoveredElement])

    return (
        <>
            <div 
                className={`flex items-center ${hoveredElem ? "bg-blue-400" : "bg-laptop-list-element"} w-full p-2`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* This block (image + names) takes 50% of the row */}
                <div className="w-1/2 flex items-center">
                    <img
                    src={`/images/driver/${image}`}
                    className="w-20 h-20 object-cover"
                    alt={`${firstName} ${lastName}`}
                    />

                    {/* Names stacked vertically */}
                    <div className="flex flex-col ml-3 text-left">
                        <div className="text-white">{firstName}</div>
                        <div className="text-white">{lastName}</div>
                    </div>
                </div>

                {/* The remaining 50% can hold other content or be left empty */}
                <div className="w-1/2" />
            </div>
        </>
    )
}