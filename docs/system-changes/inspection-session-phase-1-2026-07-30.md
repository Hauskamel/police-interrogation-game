# Technische Änderungen: Kontrollsession Phase 1

Datum: 2026-07-30

## Zusammenfassung

Eine neue Inspection-Domain verbindet angehaltene TrafficEntities mit
Dokumentprüfungen, manuellen Auffälligkeitsmarkierungen, Spielerentscheidungen und
einem nachgelagerten Kontrollbericht.

Die bestehenden NPC-, Fahrzeug-, Crime-, Dokument- und Traffic-Generatoren wurden
nicht um Kontrolllogik erweitert.

## Neue Domain

```text
src/game/inspections/
├── components/
│   └── InspectionWorkspace.jsx
├── data/
│   ├── discrepancyDefinitions.js
│   └── inspectionConstants.js
├── generators/
│   └── createInspectionSession.js
└── utils/
    └── evaluateInspection.js
```

### Session Factory

`createInspectionSession` erzeugt den kleinen Startzustand mit stabiler
`inspectionId`, TrafficEntity-Referenz und Startzeit.

### Inspection Store

`src/stores/inspectionStore.js` hält:

```js
{
    activeInspection,
    lastCompletedInspection
}
```

Aktionen:

- `startInspection`
- `registerOpenedDocument`
- `toggleDiscrepancy`
- `completeInspection`
- `cancelActiveInspection`
- `dismissCompletedInspection`

Der Store verhindert eine zweite aktive Kontrollsession. Eine vollständige Historie
wird in Phase 1 bewusst noch nicht gespeichert.

### Evaluator

`evaluateInspection` wird erst nach Bestätigung einer Entscheidung ausgeführt.

Der Evaluator:

1. liest die betroffenen Felder aus dem `documentState`,
2. ordnet sie neutralen Discrepancy-Definitionen zu,
3. vergleicht tatsächliche und markierte Auffälligkeiten,
4. bewertet die administrative Entscheidung,
5. berücksichtigt ungeöffnete Dokumente,
6. erstellt eine `resolution`.

Der Evaluator verändert weder TrafficEntity noch Polizeidatenbank.

## UI-Anbindung

### VehicleControlPanel

Für ein angehaltenes Fahrzeug steht neu `Kontrolle beginnen` zur Verfügung.

Während einer aktiven Session:

- ist die direkte Weiterfahrt gesperrt,
- zeigt das Panel den laufenden Kontrollstatus,
- werden Dokumente und Kontrollleiste freigeschaltet.

Nach der Entscheidung bleibt das Fahrzeug angehalten, bis der Kontrollbericht
geschlossen wird.

### DocumentManager

Dokumente werden erst bei aktiver Session dargestellt. Beim erstmaligen Öffnen wird
der Dokumenttyp in `openedDocuments` registriert.

Die bestehende Aufdeckung der Fahreridentität bleibt erhalten.

### InspectionWorkspace

Die neue Kontrollleiste zeigt:

- laufende Kontrolldauer
- Anzahl markierter Auffälligkeiten
- Einstieg in die Prüfpunkte
- Einstieg in die Abschlussentscheidung

Die Prüfliste bietet immer alle sieben möglichen Abweichungen. Es findet während der
Kontrolle keine automatische Hervorhebung echter Fehler statt.

### Kontrollbericht

Nach Abschluss zeigt ein modaler Bericht:

- gewählte und gegebenenfalls erwartete Maßnahme
- korrekt erkannte Auffälligkeiten
- übersehene Auffälligkeiten
- falsch beanstandete Angaben
- ungeöffnete Dokumente
- Kontrolldauer

Beim Schließen des Berichts wird die TrafficEntity freigegeben und die Session aus
dem aktiven Gameplay entfernt.

## Lifecycle Guard

`App.jsx` prüft, ob die referenzierte TrafficEntity weiterhin existiert und
angehalten ist. Wird sie technisch entfernt oder freigegeben, wird die aktive
Session abgebrochen, damit kein verwaister Kontrollzustand entsteht.

## Browserprüfung

Geprüfter manipulierter Fall:

1. NPC mit erzwungener Dokumentfälschung an der Station erzeugt.
2. Kontrolle gestartet.
3. Alle drei Dokumente geöffnet.
4. manipulierte Zulassungsnummer manuell markiert.
5. `Weitere Prüfung melden` ausgewählt.
6. korrekten Kontrollbericht erhalten.
7. Bericht geschlossen und Fahrzeug freigegeben.

Geprüfter unauffälliger Fall:

1. NPC ohne Dokumentfälschung erzeugt.
2. Kontrolle ohne Dokumentöffnung abgeschlossen.
3. richtige Freigabeentscheidung ausgewählt.
4. wegen ungeprüfter Dokumente nur `partially_correct` erhalten.

Zusätzlich:

- keine Browser-Laufzeitfehler
- `npm run lint` erfolgreich
- `npm run build` erfolgreich

Der Build enthält weiterhin nur die bekannten Warnungen zur Bundlegröße und zur
externen `three-stdlib`-Abhängigkeit.
