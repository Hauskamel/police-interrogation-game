
import {BaseTextbox} from './BaseTextbox.jsx';
import {useCarStore, useGameStore} from "../../store.js";
import { useEffect } from 'react';


export const PolicecarControlTextbox = ({
    onClose
}) => {
    const selectedCar = useCarStore(state => state.selectedCar);
    const playersPoliceCar = useCarStore(state => state.playersPoliceCar);

    const gameState =  useGameStore(state => state.gameState);
    const gameMode = useGameStore(state => state.gameMode);
    const laptopMode = useGameStore(state => state.laptopMode);

    if (selectedCar?.id !== playersPoliceCar?.id) return;

    return (
        <>
            <BaseTextbox 
                title="Polizeifahrzeug Optionen" 
                margin="bottom-6" 
                onClose={onClose} 
            >
                {gameState === "LAPTOP" ?
                    <button
                        onClick={() => {
                            gameMode()
                    }}
                        className="w-full !bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-red-800 transition font-semibold shadow-md cursor-pointer"
                    >
                        Laptop schließen
                    </button>
                :
                    <button
                        onClick={() => {
                            laptopMode()
                    }}
                        className="w-full !bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-red-800 transition font-semibold shadow-md cursor-pointer"
                    >
                        Laptop öffnen
                    </button>
                }
                
            </BaseTextbox>
        </>
    )

}