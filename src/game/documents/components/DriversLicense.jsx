import { BaseHeadlineWithText, BaseImage } from "./base";

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
                            <BaseImage data={driverProfile?.npcImage} />
                        </div>
                    </div>
                    
                    <div className="col-span-2 text-gray-800 text-sm text-left">
                        <div className="mt-1">
                            <div className="w-1/1">
                                <div className="w-1/1 justify-between flex">
                                    <BaseHeadlineWithText headline="Vorname" data={driverProfile?.firstName}></BaseHeadlineWithText>
                                    <BaseHeadlineWithText headline="Nachname" data={driverProfile?.lastName}></BaseHeadlineWithText>
                                </div>
                            </div>

                            <div className="w-1/1 flex">
                                <BaseHeadlineWithText headline="Geburtsdatum" data={driverProfile?.birthDate}></BaseHeadlineWithText>
                                <BaseHeadlineWithText headline="Lizenznummer" data={driverProfile?.driversLicense?.licenseNumber}></BaseHeadlineWithText>
                            </div>
                            <BaseHeadlineWithText headline="Adresse" data={driverProfile?.address} individualWidth="w-1/1" ></BaseHeadlineWithText>
                            <div className="w-1/1 flex">
                                <BaseHeadlineWithText headline="Ausgabedatum" data={driverProfile?.driversLicense?.issueDate}></BaseHeadlineWithText>
                                <BaseHeadlineWithText headline="Ablaufdatum" data={driverProfile?.driversLicense?.expiryDate}></BaseHeadlineWithText>
                            </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                            <BaseHeadlineWithText headline="Augenfarbe" data={driverProfile?.eyeColor}></BaseHeadlineWithText>
                            <BaseHeadlineWithText headline="Geschlecht" data={driverProfile?.sex}></BaseHeadlineWithText>
                            <BaseHeadlineWithText headline="Größe (m)" data={driverProfile?.height ? driverProfile.height / 100 : undefined}></BaseHeadlineWithText>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
