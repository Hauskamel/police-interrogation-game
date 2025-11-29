import { BaseTextbox } from "./BaseTextbox.jsx";
import { BaseImage } from "../base-components/BaseImage.jsx";
import { BaseHeadlineWithText } from "../base-components/BaseHeadlineWithText.jsx";
import { useCarStore } from "../../store.js";

export const CarOccupantsInformationTextbox = ({stoppedCar}) => {
    const selectedCar = useCarStore(state => state.selectedCar);

    return (
        <>
            <BaseTextbox title={"Fahrzeuginsassen"} isCloseable={false}>
                <div className="flex">
                    {!stoppedCar ?
                        <>
                            {/* If the car has not reached the police man yet the user sees a question mark */}
                            <img src={`/images/driver/driver-unknown.jpg`} className="w-16 h-16 rounded-full"/>
                        </>
                        :
                        // The car has reached the police man so now there is information about the driver visible
                        <>
                            <BaseImage useCase="carOccupantsInformationTextbox" data={stoppedCar.driverProfile.realProfile.driverImage} stoppedCar={stoppedCar} />
                        </>                        
                    }
                </div>
            </BaseTextbox>
        </>
    )
}