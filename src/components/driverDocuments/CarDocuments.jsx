import { useState } from "react"
import { BaseHeadlineText } from "../base-components/BaseHeadlineText"

export function CarDocuments ({car, driver}) {
    const [setId, id] = useState(0)

    let carProfile = car.realProfile;
    if (car.fakeProfile) carProfile = car.fakeProfile;
    
    let driverProfile = driver.realProfile;
    if (driver.fakeProfile) driverProfile = driver.fakeProfile;

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

                        <BaseHeadlineText headline="Fahrzeughalter" globalHeadline="" data={[driverProfile?.firstName, driverProfile?.lastName]} useCase="cardocument" id={1} />                       
                        <BaseHeadlineText headline="Kennzeichen" data={carProfile?.plateNumber} useCase="cardocument" id={2} />

                        <div className="flex">
                            <BaseHeadlineText headline="Hersteller" data={carProfile?.brandName} useCase="cardocument" id={3} />
                            <BaseHeadlineText headline="Hersteller" data={carProfile?.brandName} useCase="cardocument" id={4}/>
                        </div>

                        <BaseHeadlineText headline="Registriernummer" data={carProfile?.carRegistrationNumber} useCase="cardocument" id={2} />

                    </div>
                </div>
            </div>
        </>
    )
}