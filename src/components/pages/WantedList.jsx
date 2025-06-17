import { useWantedListStore } from "../../store"


export function WantedList () {
    const wantedList = useWantedListStore((state) => state.wantedList)


    return (
        <>

            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Wanted List</h2>

            {wantedList.map(criminal => {
                return (
                    <div
                        className="flex mb-5">
                        <img src={`/images/driver/${criminal.driverProfile.licenceImage}`} className="w-20 h-20"/>
                        <div>
                            <p className="text-gray-500 text-xs">{criminal.driverProfile.firstName} {criminal.driverProfile.lastName}</p>
                            <p className="text-gray-500 text-xs">Größe: {criminal.driverProfile.height}</p>
                        </div>

                    </div>
                )
            })}


        </>
    )
}