import { useState } from "react"
import { BaseHeadlineWithText } from "../base-components/BaseHeadlineWithText"

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
                    <h1>St. Patricia</h1>
                </div>

                <div className="col-span-2 flex flex-col text-gray-800 text-sm text-left">
                    <div className="mt-5">
                        <div className="flex">
                            <BaseHeadlineWithText useCase="cardocument" id={1} global-id="driverFirstName" headline="Vorname" hiddenHeadline="Vorname &" data={driverProfile.firstName}></BaseHeadlineWithText>
                            <BaseHeadlineWithText useCase="cardocument" id={2} global-id="driverLastName" headline="Nachname" data={driverProfile.lastName}></BaseHeadlineWithText>
                        </div>
                        <div className="flex">
                            <BaseHeadlineWithText headline="Kennzeichen" global-id="licencePlate" data={carProfile?.plateNumber} useCase="cardocument" id={3} />
                            <BaseHeadlineWithText headline="Hersteller" global-id="manufacturer" data={carProfile?.brandName} useCase="cardocument" id={4} />
                        </div>
                        <div className="flex">
                            <BaseHeadlineWithText headline="Model" global-id="carModel" data={carProfile?.brandModel} useCase="cardocument" id={5}/>
                            <BaseHeadlineWithText headline="Registriernummer" global-id="registationNumber" data={carProfile?.carRegistrationNumber} useCase="cardocument" id={6} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}