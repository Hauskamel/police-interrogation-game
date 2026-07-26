// ##### Inspection Focus Area Definitions
// -----> Beschreibt alle aktuell im lil-gui auswählbaren Prüfbereiche.
// ---> complexity und deceptionRisk sind Debug-Gewichte, keine Kampf- oder Gefahrenwerte.
export const INSPECTION_FOCUS_AREAS = [
    {
        id: "routine_documents",
        label: "Routine-Dokumente",
        complexityLevel: 1,
        deceptionRisk: 0
    },
    {
        id: "expired_dates",
        label: "Ablaufdaten",
        complexityLevel: 1,
        deceptionRisk: 0.05
    },
    {
        id: "address_consistency",
        label: "Adressabgleich",
        complexityLevel: 2,
        deceptionRisk: 0.1
    },
    {
        id: "vehicle_documents",
        label: "Fahrzeugpapiere",
        complexityLevel: 2,
        deceptionRisk: 0.2
    },
    {
        id: "behavior",
        label: "Aussage & Verhalten",
        complexityLevel: 2,
        deceptionRisk: 0.15
    },
    {
        id: "inconsistencies",
        label: "Allgemeine Widersprüche",
        complexityLevel: 3,
        deceptionRisk: 0.3
    },
    {
        id: "identity_check",
        label: "Identitätsprüfung",
        complexityLevel: 3,
        deceptionRisk: 0.35
    },
    {
        id: "document_consistency",
        label: "Dokumentkonsistenz",
        complexityLevel: 3,
        deceptionRisk: 0.4
    },
    {
        id: "wanted_database",
        label: "Fahndungsdatenbank",
        complexityLevel: 4,
        deceptionRisk: 0.25
    }
];

// ##### Inspection Profile Derivation
// -----> Leitet passende Debug-Werte aus einem oder mehreren Prüfbereichen ab.
// ---> Zusätzliche Bereiche erhöhen den Prüfaufwand und leicht das Risiko versteckter Widersprüche.
export function deriveInspectionProfile(focusAreas) {
    const uniqueFocusAreas = Array.from(new Set(focusAreas)).filter(Boolean);
    const definitions = uniqueFocusAreas
        .map((focusArea) => INSPECTION_FOCUS_AREAS.find(({ id }) => id === focusArea))
        .filter(Boolean);

    if (definitions.length === 0) {
        return {
            complexityLevel: 1,
            deceptionRisk: 0,
            focusAreas: []
        };
    }

    const highestComplexity = Math.max(...definitions.map(({ complexityLevel }) => complexityLevel));
    const breadthBonus = Math.ceil((definitions.length - 1) / 2);
    const highestDeceptionRisk = Math.max(...definitions.map(({ deceptionRisk }) => deceptionRisk));
    const combinedRisk = highestDeceptionRisk + ((definitions.length - 1) * 0.05);

    return {
        complexityLevel: clamp(highestComplexity + breadthBonus, 1, 5),
        deceptionRisk: Number(clamp(combinedRisk, 0, 1).toFixed(2)),
        focusAreas: uniqueFocusAreas
    };
}

// ##### Number Clamp
// -----> Hält abgeleitete Debug-Werte innerhalb der Grenzen der lil-gui Regler.
function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
}
