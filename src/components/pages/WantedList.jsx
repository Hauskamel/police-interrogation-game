import { useNpcStore } from "../../store"
import { BaseImageWithInformation } from "../base-components/BaseImageWithInformation.jsx"


export function WantedList () {
    const wantedList = useNpcStore((state) => state.wantedList)

    return (
        <>

            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Wanted List</h2>

            {wantedList.map((criminal, index) => {
                return (
                    <BaseImageWithInformation stoppedCar={criminal} key={index} />
                )
            })}


        </>
    )
}