import { BaseHeadlineValueText } from "../base-components/BaseHeadlineValueText"

export function CarDocuments ({car, driver}) {



    return (
        <>
            <div
                className="w-[300px] h-[450px] bg-[url(/images/vehicle-document-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-4">
                <div className="text-black text-left">
                    <h4>Fahrzeugschein</h4>
                    <h3>Republik</h3>
                    <h1>Arcadia</h1>
                </div>

                <div className="col-span-2 flex flex-col text-gray-800 text-sm text-left">
                    <div className="mt-5">

                        <BaseHeadlineValueText headline="Fahrzeughalter" data={[{firstName: driver.firstName}, {lastName: driver.lastName}]} />                        
                        <BaseHeadlineValueText headline="Nummernschild" data={car.plateNumber} />

                        <div className="flex">
                            <BaseHeadlineValueText headline="Hersteller" data={car.brandName} />
                            <BaseHeadlineValueText headline="Modell" data={car.brandModel} />
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}