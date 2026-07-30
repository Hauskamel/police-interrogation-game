# Technische Änderungen: Kontrollsession Phase 1

Datum: 2026-07-30

## Zusammenfassung

Die erste Kontrollsession wurde zu einem geschlossenen Gameplay-Grundsystem
erweitert. Neben Dokumentmanipulationen berücksichtigt die Auswertung jetzt
Führerscheingültigkeit und aktive Fahndungen aus dem Police Laptop.

Die bestehenden NPC-, Fahrzeug-, Crime-, Dokument- und Traffic-Generatoren bleiben
unverändert. Die Kontrolllogik arbeitet ausschließlich mit Referenzen auf deren
Ergebnisse.

## Inspection-Domain

```text
src/game/inspections/
├── components/
│   └── InspectionWorkspace.jsx
├── data/
│   ├── findingDefinitions.js
│   ├── index.js
│   └── inspectionConstants.js
├── generators/
│   └── createInspectionSession.js
└── utils/
    └── evaluateInspection.js
```

Die frühere Bezeichnung `discrepancy` wurde durch `finding` ersetzt. Ein Finding
kann eine Dokumentabweichung, ein Gültigkeitsproblem oder ein Polizeitreffer sein
und ist deshalb fachlich allgemeiner.

## Session Factory und Store

`createInspectionSession` erzeugt:

```js
{
    inspectionId,
    trafficEntityId,
    status,
    startedAt,
    completedAt: null,
    openedDocuments: [],
    markedFindingIds: [],
    playerDecision: null,
    resolution: null
}
```

`src/stores/inspectionStore.js` hält weiterhin nur eine aktive und die zuletzt
abgeschlossene Kontrolle:

```js
{
    activeInspection,
    lastCompletedInspection
}
```

Store-Aktionen:

- `startInspection`
- `registerOpenedDocument`
- `toggleFinding`
- `completeInspection`
- `cancelActiveInspection`
- `dismissCompletedInspection`
- `resetInspectionState`

`resetInspectionState` verhindert beim Start eines neuen Spiels, dass ein alter
Kontrollbericht erhalten bleibt.

## Finding-Definitionen

`findingDefinitions.js` gruppiert Feststellungen in:

- `document`
- `validity`
- `police`

Dokument- und Gültigkeitsfeststellungen sind manuell auswählbar. Der
`active_wanted_record` wird nicht als Checkbox angeboten. Er wird durch die bewusste
Abschlussentscheidung `Fahndungstreffer melden` ausgedrückt.

## Police-Laptop-Anbindung

Die zunächst eingebauten Aktionen zum Hinzufügen von Personen-, Fahrzeug- und
Fahndungsakten wurden wieder vollständig entfernt. Dazu gehören:

- `PoliceRecordControl`
- `togglePoliceRecord`
- `linkedPoliceRecords`
- `INSPECTION_POLICE_RECORD_TYPES`
- Aktenauswertung und Aktenliste im Kontrollbericht

`PoliceDatabaseScreen.jsx` ist damit wieder ausschließlich für Suche, Navigation und
Informationsdarstellung verantwortlich. Datenbankklicks werden nicht als
Identitätsaussage interpretiert.

## Evaluator

`evaluateInspection` wird erst nach der bestätigten Spielerentscheidung
ausgeführt. Er kombiniert drei Quellen:

1. manipulierte Felder aus dem internen `documentState`,
2. das Führerschein-Ablaufdatum zum Stichtag `startedAt`,
3. die gegen `criminalDatabase` aufgelöste aktive Fahndung.

Die Entscheidung `Fahndungstreffer melden` fügt auf Auswertungsseite die vom Spieler
behauptete Polizeifeststellung hinzu. Dadurch kann der Evaluator unterscheiden:

```text
aktive Fahndung + Fahndungstreffer gemeldet
→ richtig erkannt

aktive Fahndung + andere Maßnahme
→ Fahndung übersehen

keine aktive Fahndung + Fahndungstreffer gemeldet
→ falsch beanstandet und falsche Maßnahme
```

Unbekannte World-Truth-Straftaten werden nicht ausgewertet, weil sie für den Spieler
noch nicht feststellbar sind.

Die erwartete Entscheidung verwendet folgende Priorität:

```text
aktive Fahndung
→ report_wanted_hit

Dokumentenmanipulation
→ request_additional_review

abgelaufener Führerschein
→ deny_continuation

kein handlungsrelevanter Befund
→ allow_to_continue
```

Eine bekannte Person oder Vorstrafe ohne aktive Fahndung führt nicht automatisch zu
einer Maßnahme.

Die `resolution` enthält kategorisierte Findings und ungeöffnete Dokumente. Sie
enthält keine Recherche- oder Aktenzuordnungen.

## UI und Kontrollbericht

`InspectionWorkspace.jsx` verwendet die neutralere Bezeichnung
`Feststellungen`. Der Entscheidungsdialog nennt die Dienstregel der ersten Phase
direkt.

Der Bericht trennt:

- Dokumentenprüfung
- Gültigkeitsprüfung
- Polizeiabgleich
- geöffnete Dokumente

Nach der Entscheidung bleibt das Fahrzeug angehalten, bis der Bericht geschlossen
wird.

## Lifecycle

`App.jsx` bricht eine aktive Session ab, wenn ihre TrafficEntity technisch entfernt
oder nicht mehr angehalten ist. Der Traffic Store verhindert zusätzlich eine zweite
gleichzeitig kontrollierte TrafficEntity.

## Browserprüfung

Geprüfter Fahndungsfall:

1. gesuchten Datenbank-NPC ohne Dokumentfälschung an der Station erzeugt,
2. Kontrolle gestartet und alle drei Dokumente geöffnet,
3. Fahrer anhand seines Namens im Police Laptop gesucht,
4. aktive Fahndung in der Personenakte erkannt,
5. ohne zusätzliche Zuordnung `Fahndungstreffer melden` ausgewählt,
6. vollständig korrekten Bericht mit Polizeifund erhalten.

Geprüfter Gegenfall:

1. Zivilisten ohne aktive Fahndung kontrolliert,
2. trotzdem `Fahndungstreffer melden` ausgewählt,
3. Fahndungsbehauptung als falsch beanstandet und Kontrolle als fehlerhaft bewertet.

Bereits geprüft bleiben:

- manipulierter Dokumentfall mit `Weitere Prüfung melden`
- unauffälliger Fall mit Teilbewertung bei ungeöffneten Dokumenten
- keine Browser-Laufzeitfehler in den Kontrollabläufen
- `npm run lint` erfolgreich
- `npm run build` erfolgreich

Der Build enthält weiterhin nur die bekannten Warnungen zur Bundlegröße und zur
externen `three-stdlib`-Abhängigkeit.
