// ##### Document Integrity Types
// -----> Beschreibt, ob ein Dokument inhaltlich sauber, auffällig oder bewusst manipuliert ist.
// ---> Wird im documentState einer TrafficEntity gespeichert und später für Prüfungen genutzt.
export const DOCUMENT_INTEGRITY_TYPES = {
    VALID: "valid",
    FORGED: "forged"
};
