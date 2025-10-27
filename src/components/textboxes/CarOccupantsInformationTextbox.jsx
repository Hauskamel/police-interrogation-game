import {BaseTextbox} from "./BaseTextbox.jsx";
import { BaseImageWithText } from "../base-components/BaseImageWithText.jsx";

export const CarOccupantsInformationTextbox = ({
    selectedCar,
    stoppedCar
}) => {
    if (stoppedCar?.id !== selectedCar?.id) return;

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
                        <BaseImageWithText stoppedCar={stoppedCar} />
                    }
                </div>
            </BaseTextbox>
        </>
    )
}