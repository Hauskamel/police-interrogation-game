// ##### Interview Questions
// -----> Definiert sichtbare Standardfragen unabhängig von der späteren Antwortquelle.
// ---> requirements steuert nur die Freischaltung in der laufenden Kontrolle.
export const INTERVIEW_QUESTIONS = [
    {
        id: "full_name",
        label: "Name",
        playerText: "Nennen Sie mir bitte Ihren vollständigen Namen.",
        requirements: []
    },
    {
        id: "travel_reason",
        label: "Fahrtgrund",
        playerText: "Wohin sind Sie unterwegs?",
        requirements: []
    },
    {
        id: "address",
        label: "Adresse",
        playerText: "Wie lautet Ihre aktuelle Anschrift?",
        requirements: ["driversLicenseOpened"]
    },
    {
        id: "vehicle_owner",
        label: "Fahrzeughalter",
        playerText: "Wem gehört dieses Fahrzeug?",
        requirements: ["vehicleRegistrationOpened"]
    },
    {
        id: "address_follow_up",
        label: "Adresse nachhaken",
        playerText: "Ihre Anschrift stimmt nicht mit den Unterlagen überein. Möchten Sie Ihre Aussage korrigieren?",
        requirements: ["addressContradictionFound"],
        followUp: true
    }
];
