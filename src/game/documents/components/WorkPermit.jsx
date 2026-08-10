import { formatDateForDisplay } from "@game/shared";
import { BaseHeadlineWithText, BaseImage } from "./base";

// ##### Work Permit
// -----> Zeigt Arbeitgeber und die referenzierte Aufenthaltserlaubnis des Fahrers.
export function WorkPermit({ driver }) {
    const profile = driver?.presented;
    const permit = profile?.workPermit;

    return (
        <div className="h-[255px] w-[450px] rounded-md border-2 border-white bg-[url(/images/documents/work-permit.png)] bg-cover p-4 text-left text-zinc-900 shadow-md">
            <header className="mb-3">
                <h4 className="text-lg font-bold">Arbeitserlaubnis</h4>
                <p className="text-xs text-zinc-700">Republik Westmark</p>
            </header>
            <div className="grid grid-cols-[90px_1fr] gap-4">
                <BaseImage
                    data={profile?.npcImage}
                    alt="Passfoto des Inhabers"
                />
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    <BaseHeadlineWithText headline="Vorname" data={profile?.firstName} fieldId="workPermit.firstName" />
                    <BaseHeadlineWithText headline="Nachname" data={profile?.lastName} fieldId="workPermit.lastName" />
                    <BaseHeadlineWithText headline="Nummer" data={permit?.permitNumber} fieldId="workPermit.permitNumber" />
                    <BaseHeadlineWithText headline="Aufenthaltstitel" data={permit?.residencePermitNumber} fieldId="workPermit.residencePermitNumber" />
                    <BaseHeadlineWithText headline="Beruf" data={permit?.occupation} />
                    <BaseHeadlineWithText headline="Arbeitgeber" data={permit?.employer} />
                    <BaseHeadlineWithText headline="Gültig ab" data={formatDateForDisplay(permit?.validFrom)} selectionValue={permit?.validFrom} />
                    <BaseHeadlineWithText headline="Gültig bis" data={formatDateForDisplay(permit?.validUntil)} selectionValue={permit?.validUntil} fieldId="workPermit.validUntil" />
                </div>
            </div>
        </div>
    );
}
