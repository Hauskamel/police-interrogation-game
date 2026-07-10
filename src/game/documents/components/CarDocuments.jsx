import { BaseHeadlineWithText } from "./base";

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
                        <BaseHeadlineWithText headline="Vorname" data={driverProfile.firstName} />
                        <BaseHeadlineWithText headline="Nachname" data={driverProfile.lastName} />
                    </div>
                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Kennzeichen" data={carProfile?.carDocumentsData.plateNumber} />
                        <BaseHeadlineWithText headline="Registriernummer" data={carProfile?.carDocumentsData.carRegistrationNumber} />
                        
                    </div>
                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Hersteller" data={carProfile?.brand} />
                        <BaseHeadlineWithText headline="Model" data={carProfile?.model} />
                    </div>
                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Ausstellungsdatum" data={carProfile?.carDocumentsData.formattedIssueDate} />
                    </div>

                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="PS" data={carProfile?.ps} />
                        <BaseHeadlineWithText headline="Gewicht (kg)" data={carProfile?.weight} />
                    </div>
                </div>
            </div>
        </>
    )
}
