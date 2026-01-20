import { useCallback } from "react";

export function DatabaseListElement ({setHoveredElement, setClickedElement, clickedElement, hoveredElem, profile}) {
    const image = profile.driverProfile.realProfile.driverImage;
    const firstName = profile.driverProfile.realProfile.firstName;
    const lastName = profile.driverProfile.realProfile.lastName;

    const crimeTitle = profile.crimeCase.name;
    const crimeDescription = profile.crimeCase.description;

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        setClickedElement(e)
    });

    const handleMouseEnter = useCallback((e) => {
        e.stopPropagation();
        setHoveredElement(e);
    }, [setHoveredElement])

    const handleMouseLeave = useCallback((e) => {
        e.stopPropagation();
        setHoveredElement(null);
    }, [setHoveredElement])

    return ( !clickedElement ?
        <>
            {/* Listelement */}
            <div 
                className={`flex items-center ${hoveredElem ? "bg-blue-400" : "bg-laptop-list-element"} w-full p-2`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
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
        :
        <>
            <div 
                className={`flex items-center ${hoveredElem ? "bg-blue-400" : "bg-laptop-list-element"} w-full p-2`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
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
            <div>
                <p>{crimeTitle}</p>
                <p>{crimeDescription}</p>
            </div>

        </>
        
    )
}