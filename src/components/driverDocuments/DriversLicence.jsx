import { BaseHeadlineText } from "../base-components/BaseHeadlineText";

export function DriversLicence ({ driver }) {
    
    let driverProfile = driver.realProfile;
    if (driver.fakeProfile) driverProfile = driver.fakeProfile;
    
    return (
        <>
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

                    <div className="col-span-2 flex flex-col text-gray-800 text-sm text-left">
                        <div className="mt-1 w-1/2">
                            {/* // TODO: jede 'BaseHeadlineText' muss mit einer globalen headline ausgestattet werden, damit die Informationen dokumentübergreifend verglichen werden können */}
                            {/* Problematisch wird hierbei die Verwendung von Vor- & Nachnamen */}
        
                            {/* TODO: "global-id" muss dokumentiert werden, sonst kennt si koa sau mehr aus */}
                            <BaseHeadlineText useCase="driversLicence" id={1} global-id="driverName" headline="Name" data={[driverProfile.firstName, driverProfile.lastName]}></BaseHeadlineText>
                            <BaseHeadlineText useCase="driversLicence" id={2} global-id="birthday" headline="Geburtsdatum" data={driverProfile.birthDate}></BaseHeadlineText>
                            <BaseHeadlineText useCase="driversLicence" id={3} global-id="licenceNumber" headline="Lizenznummer" data={driverProfile.licenseNumber}></BaseHeadlineText>
                            <BaseHeadlineText useCase="driversLicence" id={4} global-id="issueDate" headline="Ausgabedatum" data={driverProfile.issueDate}></BaseHeadlineText>
                        </div>
                        <div className="mt-4 flex justify-between w-1/2">
                            <BaseHeadlineText useCase="driversLicence" id={1} global-id="eyeColor" headline="Augenfarbe" data={driverProfile.eyeColor}></BaseHeadlineText>
                            <BaseHeadlineText useCase="driversLicence" id={1} global-id="gender" headline="Geschlecht" data={driverProfile.gender}></BaseHeadlineText>
                            <BaseHeadlineText useCase="driversLicence" id={1} global-id="height" headline="Höhe in cm" data={driverProfile.height}></BaseHeadlineText>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}