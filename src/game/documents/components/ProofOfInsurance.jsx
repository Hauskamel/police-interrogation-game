import { BaseHeadlineWithText } from "./base";
import { formatDateForDisplay } from "@game/shared";

// ##### Proof Of Insurance
// -----> Zeigt die vorgelegte Police; echte Registerdaten bleiben dem Police Laptop vorbehalten.
export function ProofOfInsurance({ insurance, owner }) {
    const insuranceProfile = insurance?.presented;
    const ownerProfile = owner?.presented;

    return (
        <>  
            <div className="w-[300px] h-[390px] bg-[url(/images/vehicle-document-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-4 text-black text-left">
                <h4 className="mb-1">Versicherungsnachweis</h4>
                <p className="mb-4 text-xs text-gray-600">Kraftfahrzeug-Haftpflicht</p>
                <div className="col-span-2 flex flex-col text-gray-800 text-sm text-left mb-5">
                    <div className="flex mb-3">
                        <BaseHeadlineWithText headline="Versicherungsnehmer" data={ownerProfile?.firstName} />
                        <BaseHeadlineWithText headline="Nachname" data={ownerProfile?.lastName} />
                    </div>
                    <BaseHeadlineWithText headline="Versicherer" data={insuranceProfile?.provider} individualWidth="w-full" />
                    <BaseHeadlineWithText headline="Policennummer" data={insuranceProfile?.policyNumber} individualWidth="w-full" />
                    <BaseHeadlineWithText headline="Versichertes Kennzeichen" data={insuranceProfile?.insuredPlateNumber} individualWidth="w-full" />
                    <div className="mt-3 flex">
                        <BaseHeadlineWithText headline="Gültig ab" data={formatDateForDisplay(insuranceProfile?.validFrom)} />
                        <BaseHeadlineWithText headline="Gültig bis" data={formatDateForDisplay(insuranceProfile?.validUntil)} />
                    </div>
                </div>
            </div>
        </>
    );
}
