import { useCallback } from "react";

export function ListElement ({hovering, profile}) {
    const image = profile.driverImage;
    const firstName = profile.firstName;
    const lastName = profile.lastName;

    const [hovering, setHovering] = useState(false);

    const handleMouseEnter = useCallback((e) => {
        e.stopPropagation();
        setHovering(true);
    })

    const handleMouseLeave = useCallback ((e) => {
        e.stopPropagation();
        setHovering(false);
    })


    return (
        <>
            <div 
                className={`flex items-center ${hovering ? "bg-blue-500" : "bg-blue-300"} w-full p-2`}
                key={i}
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