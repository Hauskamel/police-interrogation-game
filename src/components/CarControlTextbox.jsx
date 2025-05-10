import {BaseTextbox} from './BaseTextbox';
import {useCarStore} from "../store";

export const CarControlTextbox = ({selectedCar, onClose}) => {
    const cars = useCarStore((state) => state.cars)
    const stopCar = useCarStore((state) => state.stopCar);
    const continueCar = useCarStore((state) => state.continueCar);


    const carIsStopped = cars.find((car) => car.stopped)

    return (
        <>
            <BaseTextbox title="Fahrzeug Optionen" className="car-control-textbox" onClose={onClose} >
                <p className="text-gray-500 text-xs">ID: {selectedCar.id}</p>
                <div className="flex gap-2">
                    {!carIsStopped && (
                        <button
                            onClick={() => {
                                stopCar(selectedCar.id);
                            }}
                            className="w-full !bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-800 transition font-semibold shadow-md cursor-pointer"
                        >
                            Anhalten
                        </button>
                    )}
                    
                    {!carIsStopped || selectedCar.id === carIsStopped.id && (
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
            </BaseTextbox>
        </>
    );
};