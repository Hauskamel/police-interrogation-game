import { formatDateForDisplay } from "@game/shared";
import { BaseHeadlineWithText, BaseImage } from "./base";

// ##### Residence Permit
// -----> Zeigt die vorgelegte Aufenthaltserlaubnis und ihre Relation zum Fahrer.
export function ResidencePermit({ driver }) {
    const profile = driver?.presented;
    const permit = profile?.residencePermit;

    return (
        <div className="h-[255px] w-[450px] rounded-md border-2 border-white bg-[url(/images/documents/residence-permit.png)] bg-cover p-4 text-left text-zinc-900 shadow-md">
            <header className="mb-3">
                <h4 className="text-lg font-bold">Aufenthaltserlaubnis</h4>
                <p className="text-xs text-zinc-700">Republik Westmark</p>
            </header>
            <div className="grid grid-cols-[90px_1fr] gap-4">
                <BaseImage
                    data={profile?.npcImage}
                    alt="Passfoto des Inhabers"
                />
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    <BaseHeadlineWithText headline="Vorname" data={profile?.firstName} fieldId="residencePermit.firstName" />
                    <BaseHeadlineWithText headline="Nachname" data={profile?.lastName} fieldId="residencePermit.lastName" />
                    <BaseHeadlineWithText headline="Herkunftsland" data={permit?.countryOfOrigin} fieldId="residencePermit.countryOfOrigin" />
                    <BaseHeadlineWithText headline="Nummer" data={permit?.permitNumber} fieldId="residencePermit.permitNumber" />
                    <BaseHeadlineWithText headline="Aufenthaltszweck" data={permit?.purpose} />
                    <BaseHeadlineWithText headline="Wohnanschrift" data={permit?.localAddress} />
                    <BaseHeadlineWithText headline="Gültig ab" data={formatDateForDisplay(permit?.validFrom)} selectionValue={permit?.validFrom} />
                    <BaseHeadlineWithText headline="Gültig bis" data={formatDateForDisplay(permit?.validUntil)} selectionValue={permit?.validUntil} fieldId="residencePermit.validUntil" />
                </div>
            </div>
        </div>
    );
}
