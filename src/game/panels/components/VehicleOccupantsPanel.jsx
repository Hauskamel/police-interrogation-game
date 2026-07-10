import { BaseControlPanel } from "./BaseControlPanel.jsx";
import { BaseImage } from "@game/documents/components/base";
import { useCarStore } from "@stores";

/**
 * ##### Vehicle Occupants Panel
 * -----> Zeigt die sichtbaren Insasseninformationen des angehaltenen Fahrzeugs.
 */
export const VehicleOccupantsPanel = ({stoppedCar}) => {
    const selectedCar = useCarStore(state => state.selectedCar);

    return (
        <>
            <BaseControlPanel title={"Fahrzeuginsassen"} isCloseable={false}>
                <div className="flex">
                    {!stoppedCar ?
                        <>
                            {/* If the car has not reached the police man yet the user sees a question mark */}
                            <img src={`/images/driver/driver-unknown.jpg`} className="w-16 h-16 rounded-full"/>
                        </>
                        :
                        // The car has reached the police man so now there is information about the driver visible
                        <>
                            <BaseImage data={stoppedCar.driverProfile.realProfile.driverImage} />
                        </>                        
                    }
                </div>
            </BaseControlPanel>
        </>
    )
}
