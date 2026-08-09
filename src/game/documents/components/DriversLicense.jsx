import { BaseHeadlineWithText, BaseImage } from "./base";
import { formatDateForDisplay } from "@game/shared";
import { getNpcPhotoComparisonValue } from "@game/npcs/data";

export function DriversLicense ({ driver }) {
    const driverProfile = driver?.presented;
    
    return (
        <>
            {/* TODO: dynamisches Hintergrundbild, Farbe für die Republik & ein sich anpassendes Icon je nach Stadt */}
            <div className="w-[450px] h-[250px] bg-[url(/images/drivers-licence-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-1">
                <div>
                    <div className="font-bold text-lg text-gray-800">Führerschein</div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="col-span-1 flex flex-col items-center justify-center">
                        <div className="border-2 border-gray-600 flex items-center justify-center text-xs text-gray-700">
                            <BaseImage
                                data={driverProfile?.npcImage}
                                alt="Passfoto des Fahrers"
                                fieldId="driversLicense.photo"
                                selectionValue={getNpcPhotoComparisonValue(
                                    driverProfile?.npcImage
                                )}
                            />
                        </div>
                    </div>
                    
                    <div className="col-span-2 text-gray-800 text-sm text-left">
                        <div className="mt-1">
                            <div className="w-1/1">
                                <div className="w-1/1 justify-between flex">
                                    <BaseHeadlineWithText headline="Vorname" data={driverProfile?.firstName} fieldId="driversLicense.firstName" />
                                    <BaseHeadlineWithText headline="Nachname" data={driverProfile?.lastName} fieldId="driversLicense.lastName" />
                                </div>
                            </div>

                            <div className="grid w-full grid-cols-3 gap-1">
                                <BaseHeadlineWithText headline="Geburtsdatum" data={formatDateForDisplay(driverProfile?.birthDate)} selectionValue={driverProfile?.birthDate} fieldId="driversLicense.birthDate" />
                                <BaseHeadlineWithText headline="Lizenznummer" data={driverProfile?.driversLicense?.licenseNumber} fieldId="driversLicense.licenseNumber" />
                            </div>
                            <BaseHeadlineWithText headline="Adresse" data={driverProfile?.address} fieldId="driversLicense.address" individualWidth="w-full" />
                            <div className="w-1/1 flex">
                                <BaseHeadlineWithText headline="Fahrerlaubnis seit" data={formatDateForDisplay(driverProfile?.driversLicense?.licensedSince)} selectionValue={driverProfile?.driversLicense?.licensedSince} fieldId="driversLicense.licensedSince" />
                                <BaseHeadlineWithText headline="Ausgabedatum" data={formatDateForDisplay(driverProfile?.driversLicense?.issueDate)} selectionValue={driverProfile?.driversLicense?.issueDate} fieldId="driversLicense.issueDate" />
                                <BaseHeadlineWithText headline="Ablaufdatum" data={formatDateForDisplay(driverProfile?.driversLicense?.expiryDate)} selectionValue={driverProfile?.driversLicense?.expiryDate} fieldId="driversLicense.expiryDate" />
                            </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                            <BaseHeadlineWithText headline="Augenfarbe" data={driverProfile?.eyeColor} fieldId="driversLicense.eyeColor" />
                            <BaseHeadlineWithText headline="Geschlecht" data={driverProfile?.sex}></BaseHeadlineWithText>
                            <BaseHeadlineWithText headline="Größe (m)" data={driverProfile?.height ? driverProfile.height / 100 : undefined}></BaseHeadlineWithText>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
