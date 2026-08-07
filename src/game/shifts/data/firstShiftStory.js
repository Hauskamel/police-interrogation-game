export const FIRST_SHIFT_STORY = {
    id: "pharmacy-van",
    title: "Schwerpunkt: Apothekeneinbrüche",
    briefing: "Nach mehreren Apothekeneinbrüchen wird ein grauer Lieferwagen mit beschädigtem rechten Rücklicht gesucht. Kontrollieren Sie regulär und dokumentieren Sie belastbare Hinweise.",
    targetInspectionCount: 5,
    encounters: [
        {
            id: "late-shift-witness",
            title: "Feierabendverkehr",
            summary: "Die erste Kontrolle wirkt wie Routine. Der Fahrtgrund kann einen ersten Zeugenhinweis liefern.",
            responses: {
                travel_reason: {
                    text: "Ich komme von der Spätschicht in der Adler-Apotheke. Hinter dem Gebäude stand ein grauer Lieferwagen mit kaputtem rechten Rücklicht.",
                    clueId: "gray_van"
                }
            }
        },
        {
            id: "station-witness",
            title: "Hinweis am Nordbahnhof",
            summary: "Eine weitere reguläre Kontrolle kann den Aufenthaltsort des Lieferwagens eingrenzen.",
            responses: {
                travel_reason: {
                    text: "Ich war am Nordbahnhof. Dort fuhr ein grauer Lieferwagen sehr hastig vom Ladebereich weg.",
                    clueId: "north_station"
                },
                gray_van_follow_up: {
                    text: "Ja, das rechte Rücklicht war beschädigt. Vom Kennzeichen habe ich nur B-K 7 erkennen können.",
                    clueId: "plate_fragment"
                }
            }
        },
        {
            id: "workshop-lead",
            title: "Spur zur Werkstatt",
            summary: "Ein Gespräch über das Fahrzeug kann die bisherige Beschreibung mit einer Werkstatt verbinden.",
            responses: {
                vehicle_owner: {
                    text: "Der Wagen gehört mir. Ich arbeite in der Werkstatt am Güterring. Vor zwei Tagen hatten wir dort einen grauen Lieferwagen mit einem rechten Rücklichtschaden.",
                    clueId: "workshop"
                },
                plate_fragment_follow_up: {
                    text: "B-K 7 passt. Der Auftrag lief auf den Namen M. Hartung. Die vollständigen Daten liegen im Auftragsbuch.",
                    clueId: "customer_name"
                }
            }
        },
        {
            id: "route-confirmation",
            title: "Route zum Südring",
            summary: "Der bekannte Name eröffnet eine gezielte Nachfrage nach der Fahrtroute.",
            responses: {
                travel_reason: {
                    text: "Ich liefere nachts Backwaren aus. In der Tatnacht stand am Güterring ein grauer Lieferwagen; später sah ich ihn Richtung Südring fahren.",
                    clueId: "south_route"
                },
                customer_name_follow_up: {
                    text: "Hartung? Der Name steht am Briefkasten der alten Lagerhalle am Südring 18.",
                    clueId: "warehouse"
                }
            }
        },
        {
            id: "case-handoff",
            title: "Belastbarer Ermittlungsansatz",
            summary: "Die letzte Kontrolle entscheidet, ob aus einzelnen Beobachtungen ein verwertbarer Ansatz wird.",
            responses: {
                travel_reason: {
                    text: "Ich fahre zum Südring. Bei der alten Lagerhalle wird nachts regelmäßig Ware aus einem grauen Lieferwagen umgeladen.",
                    clueId: "night_unloading"
                },
                warehouse_follow_up: {
                    text: "Südring 18, Hinterhof. Der Lieferwagen kommt meistens kurz nach Mitternacht.",
                    clueId: "handoff_ready"
                }
            }
        }
    ]
};

export const SHIFT_NARRATIVE_QUESTIONS = {
    gray_van_follow_up: {
        id: "gray_van_follow_up",
        label: "Lieferwagen",
        playerText: "Ist Ihnen an dem grauen Lieferwagen noch etwas aufgefallen?",
        requiredClueIds: ["gray_van"]
    },
    plate_fragment_follow_up: {
        id: "plate_fragment_follow_up",
        label: "Kennzeichenfragment",
        playerText: "Kennen Sie einen grauen Lieferwagen mit dem Kennzeichenfragment B-K 7?",
        requiredClueIds: ["plate_fragment"]
    },
    customer_name_follow_up: {
        id: "customer_name_follow_up",
        label: "M. Hartung",
        playerText: "Ist Ihnen der Name M. Hartung im Zusammenhang mit dem Güterring bekannt?",
        requiredClueIds: ["customer_name"]
    },
    warehouse_follow_up: {
        id: "warehouse_follow_up",
        label: "Lagerhalle",
        playerText: "Was wissen Sie über die alte Lagerhalle am Südring 18?",
        requiredClueIds: ["warehouse"]
    }
};

export const SHIFT_CLUE_LABELS = {
    gray_van: "Grauer Lieferwagen mit beschädigtem rechten Rücklicht",
    north_station: "Beobachtung am Ladebereich des Nordbahnhofs",
    plate_fragment: "Kennzeichenfragment B-K 7",
    workshop: "Reparaturspur zur Werkstatt am Güterring",
    customer_name: "Werkstattauftrag auf M. Hartung",
    south_route: "Fahrtroute in Richtung Südring",
    warehouse: "Verbindung zur Lagerhalle am Südring 18",
    night_unloading: "Nächtliche Umladungen an der Lagerhalle",
    handoff_ready: "Zeit und Ort der nächsten erwarteten Umladung"
};
