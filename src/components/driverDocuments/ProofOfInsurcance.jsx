import { BaseHeadlineText } from "../base-components/BaseHeadlineText";


export function ProofOfInsurance ({car, driver}) {

    return (
        <>  <div
                className="w-[300px] h-[250px] bg-[url(/images/vehicle-document-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-4 text-black text-left">
                <div>
                    <BaseHeadlineText useCase="proofOfInsurance" id={1} headline="Fahrzeughalter" data={[driver.firstName, driver.lastName]} />                        
                    <BaseHeadlineText useCase="proofOfInsurance" id={2} headline="Kennzeichen" data={car.realProfile.plateNumber} />
                </div>
            </div>
        </>
    )

}