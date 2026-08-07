// ##### Inspection Service Rules
// -----> Enthält die im Handbuch sichtbaren Regeln in derselben Fachsprache wie der Evaluator.
export const INSPECTION_RULE_SECTIONS = [
    {
        id: "procedure",
        label: "Kontrollablauf",
        title: "Ablauf einer Kontrolle",
        intro: "Eine Maßnahme ist nur nachvollziehbar, wenn die erforderlichen Prüfschritte durchgeführt wurden.",
        rules: [
            "Fordern Sie Führerschein, Fahrzeugpapiere und Versicherungsnachweis an.",
            "Vergleichen Sie sichtbare Angaben miteinander oder mit amtlichen Registerdaten.",
            "Dokumentieren Sie eine Diskrepanz, bevor Sie sie als Begründung verwenden.",
            "Polizeibekanntheit allein rechtfertigt keine Maßnahme.",
            "Beenden Sie die Kontrolle mit einer Maßnahme und den belegten Gründen."
        ]
    },
    {
        id: "documents",
        label: "Dokumente",
        title: "Pflichtdokumente",
        intro: "Alle drei Nachweise müssen zur Kontrolle vorgelegt und prüfbar sein.",
        rules: [
            "Abgelaufene, vergessene oder verlorene Pflichtnachweise verhindern die Weiterfahrt.",
            "Eine anfängliche Weigerung darf einmal mit einer erneuten Aufforderung geklärt werden.",
            "Eine endgültige Weigerung verhindert die Weiterfahrt.",
            "Ein Nachweis für eine andere Person oder ein anderes Fahrzeug gilt nicht als vorgelegt.",
            "Manipulierte oder erheblich beschädigte Dokumente werden sichergestellt."
        ]
    },
    {
        id: "measures",
        label: "Maßnahmen",
        title: "Zulässige Maßnahmen",
        intro: "Bei mehreren Feststellungen gilt die schwerwiegendste passende Maßnahme.",
        rules: [...INSPECTION_DECISION_POLICY]
            .reverse()
            .map((policyEntry) => policyEntry.ruleText)
    },
    {
        id: "research",
        label: "Recherche",
        title: "Datenbank und Funk",
        intro: "Recherche unterstützt die Kontrolle, ersetzt aber keine bewusste Feststellung.",
        rules: [
            "Im Police Laptop sind nur amtliche und polizeibekannte Informationen sichtbar.",
            "Das Öffnen einer Personenakte gilt nicht automatisch als Identifizierung.",
            "Funkabfragen prüfen einen markierten Wert gegen freigegebene Register.",
            "Ein unbekannter Straftäter kann ohne erkennbare Auffälligkeit kontrolliert werden.",
            "Verborgene World-Truth-Daten werden nicht gegen den Spieler gewertet."
        ]
    }
];
import { INSPECTION_DECISION_POLICY } from "./inspectionDecisionPolicy.js";
