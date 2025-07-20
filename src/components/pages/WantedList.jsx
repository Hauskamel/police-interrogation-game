import { useNpcStore } from "../../store"
import { BaseImageInformation } from "../base-components/BaseImageInformation.jsx"


export function WantedList () {
    const wantedList = useNpcStore((state) => state.wantedList)

    return (
        <>

            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Wanted List</h2>

            {wantedList.map((criminal, index) => {
                return (
                    <BaseImageInformation persona={criminal} key={index} />
                )
            })}


        </>
    )
}