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
                    onClick={() => stopCar(carId)}
                    className="w-full bg-pink-400 text-white py-2 px-4 rounded-xl hover:bg-pink-500 transition font-semibold shadow-md"
                >
                    Anhalten
                </button>
                <button
                    onClick={() => continueCar(carId)}
                    className="w-full bg-green-300 text-green-900 py-2 px-4 rounded-xl hover:bg-green-400 transition font-semibold shadow-md"
                >
                    Weiterfahren
                </button>
            </div>
        </BaseTextbox>
    );
};