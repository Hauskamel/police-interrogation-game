import { BaseHeadlineWithText } from "../base-components/BaseHeadlineWithText";

export function DriversLicence ({ driver }) {
    
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
                            <img
                                src={`/images/driver/${driverProfile.driverImage}`}
                                alt="Licence Photo"
                                className="col-span-2 w-28 h-28"
                            />
                        </div>
                        {/* Todo: create randomized licence classes with one matching the vehicle */}
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
                                    {/* TODO: "global-id" muss dokumentiert werden, sonst kennt si koa sau mehr aus */}
                                    <BaseHeadlineWithText useCase="driversLicence" id={1} global-id="driverFirstName" headline="Vorname" data={driverProfile.firstName}></BaseHeadlineWithText>
                                    <BaseHeadlineWithText useCase="driversLicence" id={2} global-id="driverLastName" headline="Nachname" data={driverProfile.lastName}></BaseHeadlineWithText>
                                </div>
                            </div>

                            <div className="w-1/1 flex">
                                <BaseHeadlineWithText useCase="driversLicence" id={3} global-id="birthday" headline="Geburtsdatum" data={driverProfile.birthDate}></BaseHeadlineWithText>
                                <BaseHeadlineWithText useCase="driversLicence" id={4} global-id="licenceNumber" headline="Lizenznummer" data={driverProfile.licenseNumber}></BaseHeadlineWithText>
                            </div>
                            
                            <BaseHeadlineWithText useCase="driversLicence" id={5} global-id="issueDate" headline="Ausgabedatum" data={driverProfile.address}></BaseHeadlineWithText>
                            <BaseHeadlineWithText useCase="driversLicence" id={5} global-id="address" headline="Adresse" data={driverProfile.issueDate}></BaseHeadlineWithText>
                        </div>
                        <div className="mt-2 flex justify-between">
                            <BaseHeadlineWithText useCase="driversLicence" id={6} global-id="eyeColor" headline="Augenfarbe" data={driverProfile.eyeColor}></BaseHeadlineWithText>
                            <BaseHeadlineWithText useCase="driversLicence" id={7} global-id="gender" headline="Geschlecht" data={driverProfile.gender}></BaseHeadlineWithText>
                            <BaseHeadlineWithText useCase="driversLicence" id={8} global-id="height" headline="Höhe (cm)" data={driverProfile.height}></BaseHeadlineWithText>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}