import { BaseHeadlineWithText, BaseImage } from "./base";
import { formatDateForDisplay } from "@game/shared";
import { getNpcPhotoComparisonValue } from "@game/npcs/data";
import { HOME_COUNTRY } from "@game/npcs/data";

export function DriversLicense({ driver }) {
    const driverProfile = driver?.presented;
    const isForeignLicense = driverProfile?.driversLicense?.issuingCountry
        && driverProfile.driversLicense.issuingCountry !== HOME_COUNTRY;
    const backgroundImage = isForeignLicense
        ? "/images/documents/foreign-drivers-license.png"
        : "/images/drivers-licence-bg.jpg";
    
    return (
        <div
            className="h-[270px] w-[480px] rounded-2xl border-2 border-white bg-cover p-3 text-left text-xs leading-tight text-gray-800 shadow-md"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <h4 className="text-center text-lg font-bold">Führerschein</h4>

            <div className="mt-2 grid grid-cols-[105px_1fr] gap-4">
                <div className="flex items-start justify-center pt-1">
                    <div className="border-2 border-gray-600">
                        <BaseImage
                            data={driverProfile?.npcImage}
                            alt="Passfoto des Fahrers"
                            className="h-[105px] w-[85px] object-cover"
                            fieldId="driversLicense.photo"
                            selectionValue={getNpcPhotoComparisonValue(
                                driverProfile?.npcImage
                            )}
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2">
                        <BaseHeadlineWithText headline="Vorname" data={driverProfile?.firstName} fieldId="driversLicense.firstName" />
                        <BaseHeadlineWithText headline="Nachname" data={driverProfile?.lastName} fieldId="driversLicense.lastName" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <BaseHeadlineWithText headline="Geburtsdatum" data={formatDateForDisplay(driverProfile?.birthDate)} selectionValue={driverProfile?.birthDate} fieldId="driversLicense.birthDate" />
                        <BaseHeadlineWithText headline="Lizenznummer" data={driverProfile?.driversLicense?.licenseNumber} fieldId="driversLicense.licenseNumber" />
                    </div>

                    <div className="grid grid-cols-[1fr_2fr] gap-2">
                        <BaseHeadlineWithText headline="Ausstellungsstaat" data={driverProfile?.driversLicense?.issuingCountry} fieldId="driversLicense.issuingCountry" />
                        <BaseHeadlineWithText headline="Adresse" data={driverProfile?.address} fieldId="driversLicense.address" />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <BaseHeadlineWithText headline="Fahrerlaubnis seit" data={formatDateForDisplay(driverProfile?.driversLicense?.licensedSince)} selectionValue={driverProfile?.driversLicense?.licensedSince} fieldId="driversLicense.licensedSince" />
                        <BaseHeadlineWithText headline="Ausgabedatum" data={formatDateForDisplay(driverProfile?.driversLicense?.issueDate)} selectionValue={driverProfile?.driversLicense?.issueDate} fieldId="driversLicense.issueDate" />
                        <BaseHeadlineWithText headline="Ablaufdatum" data={formatDateForDisplay(driverProfile?.driversLicense?.expiryDate)} selectionValue={driverProfile?.driversLicense?.expiryDate} fieldId="driversLicense.expiryDate" />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <BaseHeadlineWithText headline="Augenfarbe" data={driverProfile?.eyeColor} fieldId="driversLicense.eyeColor" />
                        <BaseHeadlineWithText headline="Geschlecht" data={driverProfile?.sex} />
                        <BaseHeadlineWithText headline="Größe (m)" data={driverProfile?.height ? driverProfile.height / 100 : undefined} />
                    </div>
                </div>
            </div>
        </div>
    );
}
