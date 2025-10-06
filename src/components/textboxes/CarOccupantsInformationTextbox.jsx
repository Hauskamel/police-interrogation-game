import {BaseTextbox} from "./BaseTextbox.jsx";
import { BaseImageWithInformation } from "../base-components/BaseImageWithInformation.jsx";

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
                            <p className="text-gray-500 text-xs">unknown</p>
                        </>
                        :
                        // The car has reached the police man so now there is information about the driver visible
                        <BaseImageWithInformation stoppedCar={stoppedCar} />
                    }
                </div>
            </BaseTextbox>
        </>
    )
}