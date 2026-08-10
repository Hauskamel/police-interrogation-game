import {
    INTERVIEW_QUESTIONS,
    INSPECTION_DOCUMENT_TYPES
} from "../data";
import { HOME_COUNTRY } from "@game/npcs/data";

// ##### Available Interview Questions
// -----> Leitet sichtbare Fragen ausschließlich aus bereits erfolgten Kontrollhandlungen ab.
// ---> Die UI erhält dadurch keine verborgenen Hinweise auf das aktive Szenario.
export function getAvailableInterviewQuestions({
    openedDocuments = [],
    findings = [],
    driverProfile = null,
    askedQuestionIds = []
} = {}) {
    const findingIds = findings.map((finding) => finding.findingId);
    const presentedDriver = driverProfile?.presented;
    const migrationProfile = driverProfile?.real?.migrationProfile;

    return INTERVIEW_QUESTIONS.filter((question) => {
        return question.requirements.every((requirement) => {
            if (requirement === "driversLicenseOpened") {
                return openedDocuments.includes(
                    INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE
                );
            }

            if (requirement === "vehicleRegistrationOpened") {
                return openedDocuments.includes(
                    INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION
                );
            }

            if (requirement === "foreignDriversLicenseOpened") {
                const issuingCountry = presentedDriver?.driversLicense?.issuingCountry;

                return openedDocuments.includes(
                    INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE
                ) && Boolean(issuingCountry) && issuingCountry !== HOME_COUNTRY;
            }

            if (requirement === "foreignStayAsked") {
                return askedQuestionIds.includes("foreign_stay");
            }

            if (requirement === "residenceRequired") {
                return Boolean(migrationProfile?.requiresResidencePermit);
            }

            if (requirement === "workPurpose") {
                return Boolean(migrationProfile?.requiresWorkPermit);
            }

            if (requirement === "addressContradictionFound") {
                return findingIds.includes("inconsistent_driver_statement");
            }

            return true;
        });
    });
}
