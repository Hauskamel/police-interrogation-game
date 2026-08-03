# Spielsystem: Kontrollsession Phase 1

Stand: 2026-08-03

## Ziel

Die Kontrollsession bildet einen vollständigen, nachvollziehbaren Kontrollvorgang
ab. Sie verbindet eine angehaltene `TrafficEntity` mit den Handlungen des Spielers,
ohne NPC-, Fahrzeug-, Dokument- oder Polizeidaten zu kopieren.

Der aktuelle Gameplay-Ablauf lautet:

```text
Fahrzeug anhalten
→ Kontrolle beginnen
→ Dokumente öffnen und vergleichen
→ Police Laptop durchsuchen
→ Feststellungen erkennen
→ administrative Entscheidung treffen
→ Kontrolle auswerten
→ Bericht schließen und Fahrzeug freigeben
```

Es kann immer nur eine Kontrollsession aktiv sein. Während der Kontrolle kann das
betroffene Fahrzeug nicht versehentlich weitergeschickt werden.

## Session-Modell

```js
{
    inspectionId,
    trafficEntityId,
    status,
    startedAt,
    completedAt,
    openedDocuments,
    visibleDocuments,
    markedFindingIds,
    playerDecision,
    resolution
}
```

### `inspectionId`

Identifiziert den Kontrollvorgang unabhängig von NPC und Fahrzeug.

### `trafficEntityId`

Verweist auf die kontrollierte Kombination aus Fahrer und Fahrzeug. Profile,
Dokumentzustände und Polizeistatus werden bei Bedarf über diese Referenz aufgelöst.

### `status`

Phase 1 verwendet `active`, `completed` und `cancelled`.

### `startedAt` und `completedAt`

`startedAt` ist nicht nur für den sichtbaren Timer zuständig. Der Zeitpunkt ist auch
der fachliche Stichtag für die Gültigkeitsprüfung des Führerscheins. Zusammen mit
`completedAt` ermöglicht er später Schichtstatistiken, Zeitdruck, Auswertungen und
eine chronologische Kontrollhistorie.

Beide Werte stammen aus der zentralen Spieluhr. Phase 1 beginnt am festgelegten
Spieltag `2026-08-03`; reale verstrichene Sekunden laufen innerhalb der Sitzung
weiter. Dokumente, NPC-Alter, Straftaten und Fahndungen verwenden denselben
fachlichen Zeitbezug.

### `openedDocuments`

Enthält jeden tatsächlich geöffneten Dokumenttyp genau einmal:

- `driversLicense`
- `carDocuments`
- `proofOfInsurance`

Eine richtige Abschlussentscheidung wird nur als vollständig korrekt gewertet, wenn
alle verfügbaren Dokumente geprüft wurden.

### `visibleDocuments`

Enthält die Dokumentfenster, die der Spieler momentan geöffnet hat. Dieser reine
UI-Zustand ist bewusst von `openedDocuments` getrennt:

```text
Dokument erstmals öffnen
→ in openedDocuments und visibleDocuments eintragen

Dokument manuell schließen
→ nur aus visibleDocuments entfernen

Laptop öffnen und schließen
→ visibleDocuments unverändert lassen
```

Dadurch erscheinen zuvor sichtbare Dokumente nach dem Schließen des Police Laptops
wieder, ohne dass der Spieler sie erneut anklicken muss. Ein manuell geschlossenes
Dokument bleibt für die Auswertung trotzdem als geprüft gespeichert.

### `markedFindingIds`

Speichert die Feststellungen, die der Spieler selbst bei der Dokumentprüfung
markiert. Die auswählbare Liste zeigt neutrale Prüfpunkte und verrät nicht, ob ein
Dokument tatsächlich manipuliert wurde.

Aktuell prüfbar sind:

- Name, Adresse und Geburtsdatum
- Führerscheinnummer
- Kennzeichen und Zulassungsnummer
- Fahrzeughersteller oder Modell
- abgelaufener Führerschein
- Policennummer und versichertes Fahrzeug
- abgelaufener Versicherungsschutz

### `playerDecision`

Der Spieler wählt eine administrative Maßnahme:

- Weiterfahrt erlauben
- Verwarnung aussprechen
- Weiterfahrt verweigern
- weitere Prüfung melden
- Fahndungstreffer melden

Die markierten Feststellungen werden als strukturierte Begründungen übernommen.
`Fahndungstreffer melden` ist selbst die bewusste Aussage des Spielers, dass für den
aktuell kontrollierten Fahrer eine aktive Fahndung vorliegt. Es ist keine zusätzliche
Aktenzuordnung erforderlich.

### `resolution`

Die Auswertung entsteht erst nach der bestätigten Entscheidung. Sie enthält:

- Gesamtbewertung
- korrekte oder erwartete Entscheidung
- richtig erkannte, übersehene und falsch markierte Feststellungen
- nicht geöffnete Dokumente

Der Bericht gliedert Feststellungen in:

- Dokumentenprüfung
- Gültigkeitsprüfung
- Polizeiabgleich

Mögliche Bewertungen sind `correct`, `partially_correct` und `incorrect`.

## Fachliche Regeln

Die erwartete Maßnahme folgt einer eindeutigen Priorität:

```text
Passende aktive Fahndung
→ Fahndungstreffer melden

Dokumentenmanipulation
→ Weitere Prüfung melden

Abgelaufener Führerschein oder Versicherungsschutz
→ Weiterfahrt verweigern

Keine handlungsrelevante Feststellung
→ Weiterfahrt erlauben
```

Die Spielerentscheidung erzeugt außerdem einen fachlichen Endzustand:

| Entscheidung | Endzustand |
|---|---|
| Weiterfahrt erlauben | `released` |
| Verwarnung | `warned_and_released` |
| Weiterfahrt verweigern | `held` |
| Weitere Prüfung | `referred` |
| Fahndungstreffer | `transferred` |

Freigegebene reguläre Fahrzeuge fahren weiter. Zurückgehaltene oder übergebene
TrafficEntities verlassen den aktiven Verkehrskontext. Dev-Spawns werden nach dem
Bericht entfernt, weil sie technisch nicht entlang einer Straße weiterfahren.

Wichtig: Eine Person kann der Polizei bekannt sein oder frühere Straftaten besitzen,
ohne aktuell gesucht zu werden. Polizeibekanntheit allein rechtfertigt deshalb keine
Maßnahme. Auch ein anderer eingetragener Fahrzeughalter ist nicht automatisch ein
Verstoß.

## Datenbankrecherche

Die Polizei-Datenbank ist während einer Kontrolle ein freies Recherchewerkzeug:

- Der Spieler darf beliebig viele Suchergebnisse und Akten öffnen.
- Die zuletzt geöffnete Akte gilt nicht automatisch als identifizierte Person.
- Ein Aktenklick wird weder belohnt noch als bewusste Aussage bewertet.
- Es gibt keine Buttons zum Hinzufügen oder Verknüpfen einer Akte.

Diese Trennung ist wichtig, weil ein Spieler Akten vergleichen, versehentlich öffnen
oder aus Interesse weiter recherchieren kann. Navigation beweist nicht, welche
Schlussfolgerung er gezogen hat.

Phase 1 speichert daher keine Datenbank-Klickhistorie. Eine solche Historie könnte
später als anonyme Balancing- oder Tutorial-Telemetrie interessant sein, darf aber
nicht zur fachlichen Bewertung einer einzelnen Kontrolle verwendet werden.

## Bedienkontext

Das Dienstwerkzeug-Panel mit dem Police Laptop ist während des Spiels dauerhaft
erreichbar und benötigt keine Auswahl des Polizeifahrzeugs.

Das Fahrzeug-Panel folgt dieser Priorität:

```text
aktive Kontrollsession
→ kontrollierte TrafficEntity

angehaltenes Fahrzeug ohne Session
→ angehaltene TrafficEntity

sonst
→ aktuell angeklickte TrafficEntity
```

Ein aktiver oder angehaltener Kontrollkontext bleibt dadurch sichtbar, selbst wenn
der Spieler zwischen Dokumenten, Datenbank und 3D-Welt wechselt.

Unbekannte World-Truth-Straftaten werden nicht heimlich gegen den Spieler gewertet.
Sie sind erst relevant, wenn sie durch ein späteres Ermittlungs- oder Beweissystem
erkennbar werden.

## Informationsgrenze

Während der Kontrolle speichert die Session nur Spielerhandlungen und Referenzen.
Sie kennt keine internen `affectedFields` und liest keine verborgenen Straftaten.

Erst der Evaluator darf beim Abschluss:

- den internen Dokumentzustand der kontrollierten TrafficEntity prüfen,
- das Führerschein-Ablaufdatum mit `startedAt` vergleichen,
- eine gemeldete Fahndung gegen die `criminalDatabase` prüfen,
- Führerschein-, Fahrzeug- und Versicherungsabweichungen gegen die jeweils
  vorhandenen amtlichen Registerrecords auf Erkennbarkeit prüfen.

Ein internes `affectedField` reicht allein nicht für eine erwartete Feststellung.
Der kanonische amtliche Record muss im passenden Register auflösbar sein. Verborgene
Straftaten oder eine hochwertige, auch amtlich registrierte Tarnidentität werden
dadurch nicht gegen den Spieler gewertet.

Der Police Laptop greift ausschließlich auf freigegebenes Polizeiwissen und amtliche
Register zu, niemals direkt auf die `worldTruthDatabase`.

## Nicht Bestandteil von Phase 1

- fehlende, vergessene oder verweigerte Dokumente
- Befragungen und widersprüchliche Aussagen
- freie Spielernotizen
- Datenbank-Abfragehistorie
- Fallakten und Beweisketten
- persistente Kontrollhistorie
- mehrere parallele Kontrollen
- Speichern einer laufenden Kontrolle
- sichtbare Übergabeanimation oder weitere Bearbeitung nach einem Fahndungstreffer

## Erweiterbarkeit

Die bestehenden Generatoren bleiben unverändert vorgelagert:

```text
Generatoren
→ TrafficEntity
→ InspectionSession
→ Police-Laptop-Recherche
→ InspectionEvaluator
```

Spätere Ergänzungen wie `submittedDocumentIds`, `interviewEntries`, `playerNotes`,
`shiftId`, `relatedCaseIds` oder ein `finalSnapshot` können an die Session
angebunden werden. Die Session dokumentiert Gameplay und übernimmt keine
Generierungsverantwortung.
