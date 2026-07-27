// ##### Wanted Record Statuses
// -----> Beschreibt den Lebenszyklus eines eigenständigen Fahndungsdatensatzes.
// ---> Nur ACTIVE-Records dürfen aktuell als gesuchte NPCs im Traffic-System erscheinen.
export const WANTED_RECORD_STATUSES = {
    ACTIVE: "active",
    REVOKED: "revoked",
    EXPIRED: "expired",
    RESOLVED: "resolved"
};
