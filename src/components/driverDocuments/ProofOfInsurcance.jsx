import { BaseHeadlineWithText } from "../base-components/BaseHeadlineWithText";


export function ProofOfInsurance ({car, driver}) {

    return (
        <>  <div
                className="w-[300px] h-[250px] bg-[url(/images/vehicle-document-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-4 text-black text-left">
                <div className="col-span-2 flex flex-col text-gray-800 text-sm text-left mb-5">
                    <div className="flex mb-3">
                        <BaseHeadlineWithText useCase="cardocument" id={1} documentDataField="driverFirstName" headline="Vorname" hiddenHeadline="Vorname &" data={driverProfile.firstName}></BaseHeadlineWithText>
                        <BaseHeadlineWithText useCase="cardocument" id={2} documentDataField="driverLastName" headline="Nachname" data={driverProfile.lastName}></BaseHeadlineWithText>
                    </div>
                </div>
            </div>
        </>
    )

}