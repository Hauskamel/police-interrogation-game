import {BaseTextbox} from "./BaseTextbox.jsx";
import { BaseImageInformation } from "../base-components/BaseImageInformation.jsx";

export const CarOccupantsInformationTextbox = ({
    selectedPersona, 
    stoppedPersona
}) => {
    if (stoppedPersona?.id !== selectedPersona?.id) return;

    return (
        <>
            <BaseTextbox title={"Fahrzeuginsassen"} isCloseable={false}>
                <div className="flex">
                    {!stoppedPersona ?
                        <>
                            <img src={`/images/driver/driver-unknown.jpg`} className="w-16 h-16 rounded-full"/>
                            <p className="text-gray-500 text-xs">unknown</p>
                        </>
                        :
                        <BaseImageInformation entity={stoppedPersona} />
                    }
                </div>
            </BaseTextbox>
        </>
    )
}