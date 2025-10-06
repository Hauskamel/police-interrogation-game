import { BaseHeadlineWithText } from "../base-components/BaseHeadlineWithText";


export function ProofOfInsurance ({car, driver}) {

    return (
        <>  <div
                className="w-[300px] h-[250px] bg-[url(/images/vehicle-document-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-4 text-black text-left">
                <div>
                    <BaseHeadlineWithText useCase="proofOfInsurance" id={1} headline="Fahrzeughalter" data={[driver.firstName, driver.lastName]} />                        
                    <BaseHeadlineWithText useCase="proofOfInsurance" id={2} headline="Kennzeichen" data={car.realProfile.plateNumber} />
                </div>
            </div>
        </>
    )

}