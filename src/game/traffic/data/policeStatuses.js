// ##### Police Statuses
// -----> Beschreibt, was die Polizei aktuell über den NPC weiß.
// ---> Das ist bewusst getrennt von der Wahrheit, weil ein Täter unbekannt sein kann.
export const POLICE_STATUSES = {
    UNKNOWN: "unknown",
    KNOWN: "known",
    SUSPECTED: "suspected",
    WANTED: "wanted",
    CLEARED: "cleared",
    ARRESTED: "arrested",
    ESCAPED: "escaped"
};

// ##### Police Knowledge Resolver
// -----> Leitet aus dem fachlichen Polizeistatus ab, ob die Person polizeibekannt ist.
// ---> Verhindert ein separates knownToPolice-Flag, das dem Status widersprechen könnte.
export function isNpcKnownToPolice(status) {
    return Boolean(status) && status !== POLICE_STATUSES.UNKNOWN;
}
