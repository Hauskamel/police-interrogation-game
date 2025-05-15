import {BaseTextbox} from './BaseTextbox';
import {useCarStore} from "../store";

export const CarControlTextbox = ({selectedCar, onClose}) => {
    const cars = useCarStore((state) => state.cars)
    const stopCar = useCarStore((state) => state.stopCar);
    const continueCar = useCarStore((state) => state.continueCar);
    const setVisibilityStatusDriversLicense = useCarStore((state) => state.setVisibilityStatusDriversLicense)
    const setVisibilityStatusVehicleDocuments = useCarStore((state) => state.setVisibilityStatusVehicleDocuments)

    const stoppedCar = cars.find((car) => car.stopped)

    return (
        <>
            <BaseTextbox title="Fahrzeug Optionen" margin="bottom-6" onClose={onClose} >
                <p className="text-gray-500 text-xs">ID: {selectedCar.id}</p>
                <div className="flex gap-2">
                    {!stoppedCar && (
                        <button
                            onClick={() => {
                                stopCar(selectedCar.id);
                            }}
                            className="w-full !bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-800 transition font-semibold shadow-md cursor-pointer"
                        >
                            Anhalten
                        </button>
                    )}

                    {!stoppedCar || selectedCar.id === stoppedCar.id && (
                        <button
                            onClick={() => {
                                continueCar(selectedCar.id);
                                onClose();
                            }}
                            className="w-full bg-lime-600 text-white py-2 px-4 rounded-xl hover:bg-lime-700 transition font-semibold shadow-md cursor-pointer"
                        >
                            Weiterfahren
                        </button>
                    )}
                    
                </div>

                {stoppedCar && stoppedCar.position.z === -3 && (
                    <div className="flex gap-2">
                        <button 
                            onClick={() => {
                                setVisibilityStatusDriversLicense(selectedCar.id, true)
                            }} 
                            className="w-full bg-sky-600 text-white py-2 px-4 rounded-xl hover:bg-sky-700 transition font-semibold shadow-md cursor-pointer"
                        >
                            Führerschein
                        </button>


                        <button 
                            onClick={() => {
                                setVisibilityStatusVehicleDocuments(selectedCar.id, true)
                            }} 
                            className="w-full bg-sky-600 text-white py-2 px-4 rounded-xl hover:bg-sky-700 transition font-semibold shadow-md cursor-pointer"
                        >
                            Fahrzeugpapiere
                        </button>
                    </div>
                )}
            </BaseTextbox>
        </>
    );
};