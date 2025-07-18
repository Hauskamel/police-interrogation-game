import { useNpcStore } from "../../store"
import { BaseWantedListProfile } from "../base-components/BaseWantedListProfile"




export function WantedList () {
    const wantedList = useNpcStore((state) => state.wantedList)

    return (
        <>

            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Wanted List</h2>

            {wantedList.map(criminal => {
                return (
                    <BaseWantedListProfile criminal={criminal} />   
                )
            })}


        </>
    )
}