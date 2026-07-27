import { BaseHeadlineWithText } from "./base";

export function ProofOfInsurance ({car, driver}) {
    const driverProfile = driver?.presented;

    return (
        <>  
            <div className="w-[300px] h-[250px] bg-[url(/images/vehicle-document-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-4 text-black text-left">
                <div className="col-span-2 flex flex-col text-gray-800 text-sm text-left mb-5">
                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Vorname" data={driverProfile?.firstName} />
                        <BaseHeadlineWithText headline="Nachname" data={driverProfile?.lastName} />
                    </div>
                </div>
            </div>
        </>
    )
}
