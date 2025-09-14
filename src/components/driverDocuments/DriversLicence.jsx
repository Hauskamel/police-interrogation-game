import { BaseHeadlineText } from "../base-components/BaseHeadlineText";

export function DriversLicence ({ driver }) {


    console.log(driver);
    
    

    return (
        <>
            <div className="w-[450px] h-[250px] bg-[url(/images/drivers-licence-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-4">
                <div>
                    <div className="font-bold text-lg text-gray-800">Führerschein</div>
                    <div className="text-xs italic text-gray-700">Republik Arcadia</div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="col-span-1 flex flex-col items-center justify-center">
                        <div className="border-2 border-gray-600 flex items-center justify-center text-xs text-gray-700">
                            <img
                                src={`/images/driver/${driver.driverImage}`}
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
                        <div className="mt-1">





                            <BaseHeadlineText useCase="driversLicence" id={1} headline="Name" data={[driver.firstName, driver.lastName]}></BaseHeadlineText>
                            <BaseHeadlineText useCase="driversLicence" id={2} headline="Geburtsdatum" data={driver.birthDate}></BaseHeadlineText>
                            <BaseHeadlineText useCase="driversLicence" id={3} headline="Lizenznummer" data={driver.licenseNumber}></BaseHeadlineText>
                            <BaseHeadlineText useCase="driversLicence" id={4} headline="Ausgabedatum" data={driver.issueDate}></BaseHeadlineText>





                        </div>
                        <div className="mt-4 flex justify-between w-4/5">
                            <span>
                                <strong>AugF</strong><br/>
                                {driver.eyeColor}
                            </span>
                            <span>
                                <strong>G</strong><br/>
                                {driver.gender}
                            </span>
                            <span>
                                <strong>H in cm</strong><br/>
                                {driver.height}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}