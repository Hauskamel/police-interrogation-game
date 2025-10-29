import { useNpcStore } from "../../store"
import { BaseHeadlineWithText } from "../base-components/BaseHeadlineWithText.jsx"
import { BaseImage } from "../base-components/BaseImage.jsx"


export function WantedList () {
    const wantedList = useNpcStore((state) => state.wantedList)

    return (
        <>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Wanted List</h2>

            {wantedList.map((car, index) => {
                return (
                    <>
                        <div key={index}>
                            <BaseImage useCase="wantedList" data={car.driverProfile.realProfile.driverImage} stoppedCar={car} />
                            <BaseHeadlineWithText useCase="carDocument" documentDataField="driverFirstName" headline="" data={car.driverProfile.realProfile.firstName} />
                        </div>
                    </>
                )
            })}
        </>
    )
}