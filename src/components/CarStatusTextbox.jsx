import {BaseTextbox} from "./BaseTextbox.jsx";


export function CarStatusTextbox ( {status} ) {


    console.log(status.drunk)


    return (
        <>
            <BaseTextbox title={"Fahrer- & Fahrzeuginformation"}>
                <p className="text-gray-500 text-xs">Fahrername: unknown</p>
                <p className="text-gray-500 text-xs">Fahrer betrunken: {status.drunk}</p>
            </BaseTextbox>
        </>
    )
}