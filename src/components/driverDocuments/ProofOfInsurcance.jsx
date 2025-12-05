import { BaseHeadlineWithText } from "../base-components/BaseHeadlineWithText";

export function ProofOfInsurance ({car, driver}) {
    
    let carProfile = car.realProfile;
    if (car.fakeProfile) carProfile = car.fakeProfile;
    
    let driverProfile = driver.realProfile;
    if (driver.fakeProfile) driverProfile = driver.fakeProfile;

    return (
        <>  
            <div className="w-[300px] h-[250px] bg-[url(/images/vehicle-document-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-4 text-black text-left">
                <div className="col-span-2 flex flex-col text-gray-800 text-sm text-left mb-5">
                    <div className="flex mb-3">
                        <BaseHeadlineWithText useCase="carDocument" documentDataField="driverFirstName" headline="Vorname" data={driverProfile.firstName} />
                        <BaseHeadlineWithText useCase="carDocument" documentDataField="driverLastName" headline="Nachname" data={driverProfile.lastName} />
                    </div>
                </div>
            </div>
        </>
    )
}