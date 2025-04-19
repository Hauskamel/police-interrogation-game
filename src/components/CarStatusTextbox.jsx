import { useEffect } from "react";
import {BaseTextbox} from "./BaseTextbox.jsx";


export function CarStatusTextbox ( {carId, status, onClose} ) {

    return (
        <>
            <BaseTextbox title={"Fahrer- & Fahrzeuginformation"}>
                {/* // TODO: Fahrernamen generieren lassen  */}
                <p className="text-gray-500 text-xs">Fahrername: {carId}</p>
                <p className="text-gray-500 text-xs">Fahrer betrunken: {status.drunk ? "true" : "false"}</p>
                <p className="text-gray-500 text-xs">Fahrer high: {status.high ? "true" : "false"}</p>
                <p className="text-gray-500 text-xs">Fahrer gesucht: {status.wanted ? "true" : "false"}</p>
            </BaseTextbox>
        </>
    )
}