# Spielsystem: Kontrollsession Phase 1

Stand: 2026-07-30

## Ziel

Die Kontrollsession verbindet eine angehaltene TrafficEntity mit den Handlungen und
der Abschlussentscheidung des Spielers. Sie erzeugt keine NPCs, Fahrzeuge oder
Dokumente und speichert keine zweite Kopie dieser Profile.

Der erste geschlossene Gameplay-Ablauf lautet:

```text
Fahrzeug anhalten
→ Kontrolle beginnen
→ Dokumente öffnen
→ Auffälligkeiten markieren
→ administrative Entscheidung treffen
→ Kontrolle auswerten
→ Bericht schließen und Fahrzeug freigeben
```

## Session-Modell

```js
{
    inspectionId,
    trafficEntityId,
    status,
    startedAt,
    completedAt,
    openedDocuments,
    markedDiscrepancies,
    playerDecision,
    resolution
}
```

### `inspectionId`

Identifiziert die konkrete Kontrolle unabhängig von NPC und Fahrzeug.

### `trafficEntityId`

Verweist auf die kontrollierte Kombination aus Fahrer, Fahrzeug und Halter. Profile,
Dokumentzustände und Polizeistatus werden darüber aufgelöst und nicht in die Session
kopiert.

### `status`

Phase 1 verwendet:

- `active`
- `completed`
- `cancelled`

Es kann immer nur eine Session aktiv sein.

### `startedAt` und `completedAt`

Die Zeitpunkte ermöglichen bereits eine sichtbare Kontrolldauer. Später können sie
für Schichten, Statistiken und chronologische Kontrollhistorien verwendet werden.

### `openedDocuments`

Enthält jeden tatsächlich geöffneten Dokumenttyp genau einmal:

- `driversLicense`
- `carDocuments`
- `proofOfInsurance`

Alle drei Dokumente sind in Phase 1 weiterhin immer verfügbar. Fehlende,
vergessene oder verweigerte Dokumente sind noch nicht Bestandteil dieses Systems.

### `markedDiscrepancies`

Speichert die vom Spieler beanstandeten Prüfpunkte. Die Auswahl enthält immer alle
möglichen Punkte und verrät deshalb nicht, ob tatsächlich eine Fälschung vorliegt:

- Name
- Adresse
- Geburtsdatum
- Führerscheinnummer
- Kennzeichen
- Zulassungsnummer
- Fahrzeughersteller oder Modell

### `playerDecision`

Der Spieler kann zwischen vier administrativen Maßnahmen wählen:

- Weiterfahrt erlauben
- Verwarnung aussprechen
- Weiterfahrt verweigern
- weitere Prüfung melden

Die markierten Prüfpunkte werden als strukturierte Begründungen übernommen.

### `resolution`

Die Auswertung wird erst nach Bestätigung der Entscheidung erstellt. Sie enthält:

- Gesamtbewertung
- korrekte oder falsche Entscheidung
- richtig erkannte Auffälligkeiten
- übersehene Auffälligkeiten
- falsch beanstandete Angaben
- nicht geöffnete Dokumente

Mögliche Gesamtbewertungen:

- `correct`
- `partially_correct`
- `incorrect`

Eine zufällig richtige Entscheidung wird nur teilweise korrekt bewertet, wenn
Dokumente ungeprüft blieben.

## Informationsgrenze

Während einer laufenden Kontrolle kennt die Session nur Spielerhandlungen und
Referenzen auf bestehende Spieldaten. Sie zeigt keine tatsächlichen
`affectedFields`.

Erst der Evaluator darf nach der bestätigten Entscheidung den internen
`documentState` der TrafficEntity lesen. Der Police Laptop bleibt weiterhin auf
`criminalDatabase` beschränkt und erhält keinen Zugriff auf World Truth.

## Dienstregel in Phase 1

Damit die Entscheidung eindeutig bewertbar ist, gilt:

```text
Unauffällige Dokumente
→ Weiterfahrt erlauben

Begründeter Manipulationsverdacht
→ Weitere Prüfung melden
```

Verwarnung und verweigerte Weiterfahrt sind bereits als Maßnahmen vorhanden, aber
für die aktuellen reinen Dokumentfälle nicht die erwartete Standardentscheidung.

## Nicht Bestandteil von Phase 1

- vergessene oder fehlende Dokumente
- verweigerte Dokumentvorlage
- Befragungen und Aussagen
- freie Spielernotizen
- Datenbank-Abfragehistorie
- Schichten und Karriereauswertung
- Fallakten und Beweisketten
- persistente Kontrollhistorie
- mehrere parallele Kontrollen
- Speichern einer laufenden Kontrolle

## Erweiterbarkeit

Die Session kann später ohne Austausch des Grundmodells ergänzt werden:

```js
{
    submittedDocumentIds,
    databaseQueries,
    interviewEntries,
    playerNotes,
    shiftId,
    relatedCaseIds,
    finalSnapshot
}
```

Generatoren bleiben dabei vorgelagert:

```text
Generatoren
→ TrafficEntity
→ InspectionSession
→ InspectionEvaluator
```

Die Session dokumentiert Gameplay. Sie übernimmt keine Generierungsverantwortung.
