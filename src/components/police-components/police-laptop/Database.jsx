import { useNpcStore } from "../../../store"


export function Database () {
    const criminalDatabase = useNpcStore(state => state.criminalDatabase);




    const dbContent = criminalDatabase.map((row, i) => {
        const driverProfile = row.driverProfile.realProfile

        const image = driverProfile.driverImage;
        const firstName = driverProfile.firstName;
        const lastName = driverProfile.lastName;

        return (
            <>
                <div className="flex items-center bg-blue-500 w-full p-2" key={i}>
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
    })
    

    return (
        <>
            <div>
                {dbContent}
            </div>
        </>
    )
}