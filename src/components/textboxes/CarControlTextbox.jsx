import {BaseTextbox} from './BaseTextbox.jsx';
import {useCarStore} from "../../store.js";
import { POLICE_CHECKPOINT } from '../../config/positions.js';

export const CarControlTextbox = ({selectedCar, onClose}) => {
    const stopCar = useCarStore((state) => state.stopCar);
    const continueCar = useCarStore((state) => state.continueCar);
    const stoppedCar = useCarStore((state) => state.cars.find(car => car.stopped));

    return (
        <>
            <BaseTextbox title="Fahrzeug Optionen" margin="bottom-6" onClose={onClose} >
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

                {stoppedCar && stoppedCar.position.z === POLICE_CHECKPOINT && (
                    <div className="flex gap-2">
                        <button 
                            className="w-full bg-sky-600 text-white py-2 px-4 rounded-xl hover:bg-sky-700 transition font-semibold shadow-md cursor-pointer"
                        >
                            Verhaften
                        </button>
                    </div>
                )}
            </BaseTextbox>
        </>
    );
};