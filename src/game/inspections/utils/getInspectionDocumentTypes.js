import {
    INSPECTION_DOCUMENT_TYPES,
    REQUIRED_INSPECTION_DOCUMENTS
} from "../data";

// ##### Required Inspection Documents
// -----> Basisdokumente gelten immer; Einreiseerlaubnisse nur bei fachlicher Pflicht.
export function getRequiredInspectionDocumentTypes(trafficEntity) {
    const migrationProfile = trafficEntity?.driverProfile?.real?.migrationProfile;
    const requiredDocuments = [...REQUIRED_INSPECTION_DOCUMENTS];

    if (migrationProfile?.requiresResidencePermit) {
        requiredDocuments.push(INSPECTION_DOCUMENT_TYPES.RESIDENCE_PERMIT);
    }

    if (migrationProfile?.requiresWorkPermit) {
        requiredDocuments.push(INSPECTION_DOCUMENT_TYPES.WORK_PERMIT);
    }

    return requiredDocuments;
}

// Die Erlaubnis-Buttons erscheinen erst, nachdem der Fahrer seinen Aufenthalt erklaert hat.
// Dadurch verraet die UI keine Dokumentpflicht, bevor der Spieler das Thema angesprochen hat.
export function getRequestableInspectionDocumentTypes({
    trafficEntity,
    askedQuestionIds = []
}) {
    const requestableDocuments = [...REQUIRED_INSPECTION_DOCUMENTS];
    if (!askedQuestionIds.includes("foreign_stay")) return requestableDocuments;

    const driverProfile = trafficEntity?.driverProfile;
    const migrationProfile = driverProfile?.real?.migrationProfile;
    if (
        migrationProfile?.requiresResidencePermit
        || driverProfile?.presented?.residencePermit
    ) {
        requestableDocuments.push(INSPECTION_DOCUMENT_TYPES.RESIDENCE_PERMIT);
    }

    if (
        migrationProfile?.requiresWorkPermit
        || driverProfile?.presented?.workPermit
    ) {
        requestableDocuments.push(INSPECTION_DOCUMENT_TYPES.WORK_PERMIT);
    }

    return requestableDocuments;
}
