import { BaseHeadlineWithText } from "../base-components/BaseHeadlineWithText";
import { BaseImage } from "../base-components/BaseImage";

export function DriversLicense ({ driver }) {
    let driverProfile = driver.realProfile;
    if (driver.fakeProfile) driverProfile = driver.fakeProfile;
    
    return (
        <>
            {/* TODO: dynamisches Hintergrundbild, Farbe für die Republik & ein sich anpassendes Icon je nach Stadt */}
            <div className="w-[450px] h-[250px] bg-[url(/images/drivers-licence-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-4">
                <div>
                    <div className="font-bold text-lg text-gray-800">Führerschein</div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="col-span-1 flex flex-col items-center justify-center">
                        <div className="border-2 border-gray-600 flex items-center justify-center text-xs text-gray-700">
                            <BaseImage useCase="driversLicense" data={driver.realProfile.driverImage} />
                        </div>
                        {/* Todo: create randomized license classes with one matching the vehicle */}
                        <div className="mt-1">
                            <div className="font-semibold text-sm text-gray-800">D / M</div>
                        </div>
                    </div>
                    
                    <div className="col-span-2 text-gray-800 text-sm text-left">
                        <div className="mt-1">
                            {/* // TODO: jede 'BaseHeadlineWithText' muss mit einer globalen headline ausgestattet werden, damit die Informationen dokumentübergreifend verglichen werden können */}
                            {/* Problematisch wird hierbei die Verwendung von Vor- & Nachnamen */}
                            <div className="w-1/1">
                                <div className="w-1/1 justify-between flex">
                                    <BaseHeadlineWithText useCase="driversLicense" documentDataField="driverFirstName" headline="Vorname" data={driverProfile.firstName}></BaseHeadlineWithText>
                                    <BaseHeadlineWithText useCase="driversLicense" documentDataField="driverLastName" headline="Nachname" data={driverProfile.lastName}></BaseHeadlineWithText>
                                </div>
                            </div>

                            <div className="w-1/1 flex">
                                <BaseHeadlineWithText useCase="driversLicense" documentDataField="birthday" headline="Geburtsdatum" data={driverProfile.birthDate}></BaseHeadlineWithText>
                                <BaseHeadlineWithText useCase="driversLicense" documentDataField="licenseNumber" headline="Lizenznummer" data={driverProfile.licenseNumber}></BaseHeadlineWithText>
                            </div>
                            <BaseHeadlineWithText useCase="driversLicense" documentDataField="issueDate" headline="Adresse" data={driverProfile.address} individualWidth="w-1/1" ></BaseHeadlineWithText>
                            <BaseHeadlineWithText useCase="driversLicense" documentDataField="address" headline="Ausgabedatum" data={driverProfile.issueDate}></BaseHeadlineWithText>
                        </div>
                        <div className="mt-2 flex justify-between">
                            <BaseHeadlineWithText useCase="driversLicense" documentDataField="eyeColor" headline="Augenfarbe" data={driverProfile.eyeColor}></BaseHeadlineWithText>
                            <BaseHeadlineWithText useCase="driversLicense" documentDataField="gender" headline="Geschlecht" data={driverProfile.gender}></BaseHeadlineWithText>
                            <BaseHeadlineWithText useCase="driversLicense" documentDataField="height" headline="Höhe (cm)" data={driverProfile.height}></BaseHeadlineWithText>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}