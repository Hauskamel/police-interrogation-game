import { BaseHeadlineWithText } from "./base";
import { formatDateForDisplay } from "@game/shared";

export function CarDocuments ({ car, owner }) {
    const ownerProfile = owner?.presented;
    const vehicleProfile = car?.presented;

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
                        <BaseHeadlineWithText headline="Halter Vorname" data={ownerProfile?.firstName} fieldId="vehicleRegistration.ownerFirstName" />
                        <BaseHeadlineWithText headline="Halter Nachname" data={ownerProfile?.lastName} fieldId="vehicleRegistration.ownerLastName" />
                    </div>
                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Halteradresse" data={ownerProfile?.address} fieldId="vehicleRegistration.ownerAddress" />
                    </div>
                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Kennzeichen" data={vehicleProfile?.carDocumentsData?.plateNumber} fieldId="vehicleRegistration.plateNumber" />
                        <BaseHeadlineWithText headline="Registriernummer" data={vehicleProfile?.carDocumentsData?.carRegistrationNumber} fieldId="vehicleRegistration.registrationNumber" />
                        
                    </div>
                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Hersteller" data={vehicleProfile?.brand} fieldId="vehicleRegistration.brand" />
                        <BaseHeadlineWithText headline="Modell" data={vehicleProfile?.model} fieldId="vehicleRegistration.model" />
                    </div>
                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Ausstellungsdatum" data={formatDateForDisplay(vehicleProfile?.carDocumentsData.formattedIssueDate)} selectionValue={vehicleProfile?.carDocumentsData.formattedIssueDate} fieldId="vehicleRegistration.issueDate" />
                    </div>

                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Baujahr" data={vehicleProfile?.yearOfConstruction} fieldId="vehicleRegistration.yearOfConstruction" />
                        <BaseHeadlineWithText headline="PS" data={vehicleProfile?.ps} fieldId="vehicleRegistration.ps" />
                        <BaseHeadlineWithText headline="Gewicht (kg)" data={vehicleProfile?.weight} fieldId="vehicleRegistration.weight" />
                    </div>
                </div>
            </div>
        </>
    )
}
