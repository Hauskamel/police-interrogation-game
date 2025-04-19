import { BaseTextbox } from './BaseTextbox';
import { useCarStore } from "../store";

export const CarControlTextbox = ({ carId, onClose }) => {
    const stopCar = useCarStore((state) => state.stopCar);
    const continueCar = useCarStore((state) => state.continueCar);

    return (
        <BaseTextbox title="Fahrzeug Optionen" onClose={onClose}>
            <p className="text-gray-500 text-xs">ID: {carId}</p>
            <div className="flex gap-2">
                <button
                    onClick={() => {
                        stopCar(carId);
                        onClose();
                    }}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-800 transition font-semibold shadow-md cursor-pointer"
                >
                    Anhalten
                </button>
                <button
                    onClick={() => {
                        continueCar(carId);
                        onClose();
                    }}
                    className="w-full bg-lime-600 text-white py-2 px-4 rounded-xl hover:bg-lime-700 transition font-semibold shadow-md cursor-pointer"
                >
                    Weiterfahren
                </button>
            </div>
        </BaseTextbox>
    );
};