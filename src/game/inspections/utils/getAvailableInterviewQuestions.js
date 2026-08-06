import {
    INTERVIEW_QUESTIONS,
    INSPECTION_DOCUMENT_TYPES
} from "../data";

// ##### Available Interview Questions
// -----> Leitet sichtbare Fragen ausschließlich aus bereits erfolgten Kontrollhandlungen ab.
// ---> Die UI erhält dadurch keine verborgenen Hinweise auf das aktive Szenario.
export function getAvailableInterviewQuestions({
    openedDocuments = [],
    findings = []
} = {}) {
    const findingIds = findings.map((finding) => finding.findingId);

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

            if (requirement === "addressContradictionFound") {
                return findingIds.includes("inconsistent_driver_statement");
            }

            return true;
        });
    });
}
