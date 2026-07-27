// ##### Traffic Entity Types
// -----> Beschreibt, warum eine TrafficEntity im Straßenverkehr erzeugt wurde.
// ---> Aktuell gibt es nur normale Zivilisten, bekannte Gesuchte und unbekannte Täter.
export const TRAFFIC_ENTITY_TYPES = {
    CIVILIAN: "civilian",
    UNKNOWN_OFFENDER: "unknownOffender",
    KNOWN_OFFENDER: "knownOffender",
    WANTED_OFFENDER: "wantedOffender"
};
