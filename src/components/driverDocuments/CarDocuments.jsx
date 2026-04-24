import { useState } from "react"
import { BaseHeadlineWithText } from "../base-components/BaseHeadlineWithText"

export function CarDocuments ({ car, driver }) {
    let driverProfile = driver.realProfile;
    let carProfile = car.realProfile;

    return (
        <>
            <div
                className="w-[300px] h-[450px] bg-[url(/images/vehicle-document-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-4">
                <div className="text-black text-left mb-3">
                    <h4>Fahrzeugschein</h4>
                    <h3>Zugelassen für folgendes Fahrzeug:</h3>
                </div>

                <div className="col-span-2 flex flex-col text-gray-800 text-sm text-left mb-5">
                    <div className="flex mb-3">
                        <BaseHeadlineWithText useCase="carDocument" documentDataField="driverFirstName" headline="Vorname" data={driverProfile.firstName} />
                        <BaseHeadlineWithText useCase="carDocument" documentDataField="driverLastName" headline="Nachname" data={driverProfile.lastName} />
                    </div>
                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Kennzeichen" documentDataField="licensePlate" data={carProfile?.carDocumentsData.plateNumber} useCase="carDocument" />
                        <BaseHeadlineWithText headline="Registriernummer" documentDataField="registationNumber" data={carProfile?.carDocumentsData.carRegistrationNumber} useCase="carDocument" />
                        
                    </div>
                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Hersteller" documentDataField="manufacturer" data={carProfile?.brand} useCase="carDocument" />
                        <BaseHeadlineWithText headline="Model" documentDataField="carModel" data={carProfile?.model} useCase="carDocument" />
                    </div>
                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Ausstellungsdatum" documentDataField="issueDate" data={carProfile?.carDocumentsData.formattedIssueDate} useCase="carDocument" />
                    </div>

                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="PS" documentDataField="ps" data={carProfile?.ps} useCase="carDocument" />
                        <BaseHeadlineWithText headline="Gewicht (kg)" documentDataField="weight" data={carProfile?.weight} useCase="carDocument" />
                    </div>
                </div>
            </div>
        </>
    )
}