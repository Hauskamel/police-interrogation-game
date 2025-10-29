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
                <div className="text-black text-left mb-3">
                    <h4>Fahrzeugschein</h4>
                    <h3>Zugelassen für:</h3>
                    <h1>St. Patricia</h1>
                </div>

                <div className="col-span-2 flex flex-col text-gray-800 text-sm text-left mb-5">
                    <div className="flex mb-3">
                        <BaseHeadlineWithText useCase="carDocument" documentDataField="driverFirstName" headline="Vorname" data={driverProfile.firstName} />
                        <BaseHeadlineWithText useCase="carDocument" documentDataField="driverLastName" headline="Nachname" data={driverProfile.lastName} />
                    </div>
                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Kennzeichen" documentDataField="licencePlate" data={carProfile?.plateNumber} useCase="carDocument" />
                        <BaseHeadlineWithText headline="Hersteller" documentDataField="manufacturer" data={carProfile?.brandName} useCase="carDocument" />
                    </div>
                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Model" documentDataField="carModel" data={carProfile?.brandModel} useCase="carDocument" />
                        <BaseHeadlineWithText headline="Registriernummer" documentDataField="registationNumber" data={carProfile?.carRegistrationNumber} useCase="carDocument" />
                    </div>
                </div>
            </div>
        </>
    )
}