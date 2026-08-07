# Spielsystem: Kontrollsession Phase 2

Stand: 06.08.2026

## Ziel

Die Kontrollsession bildet einen vollständigen, nachvollziehbaren Kontrollvorgang
ab. Sie verbindet eine angehaltene `TrafficEntity` mit den Handlungen des Spielers,
ohne NPC-, Fahrzeug-, Dokument- oder Polizeidaten zu kopieren.

Der aktuelle Gameplay-Ablauf lautet:

```text
Fahrzeug anhalten
→ Kontrolle beginnen
→ Fahrer nach Dokumenten fragen
→ vorgezeigte Dokumente öffnen und vergleichen
→ Police Laptop durchsuchen
→ Feststellungen erkennen
→ administrative Entscheidung treffen
→ Kontrolle auswerten und Konsequenz anwenden
→ Ergebnisbericht schließen
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
    documentRequestStates,
    findings,
    discrepancyMode,
    conversationEntries,
    dispatchConversationEntries,
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

Die Session verwendet `active` und `completed`. Ein technisch abgebrochener Vorgang
wird derzeit nicht als eigener historischer Datensatz gespeichert.

### `startedAt` und `completedAt`

`startedAt` ist nicht nur für den sichtbaren Timer zuständig. Der Zeitpunkt ist auch
der fachliche Stichtag für die Gültigkeitsprüfung des Führerscheins. Zusammen mit
`completedAt` ermöglicht er später Schichtstatistiken, Zeitdruck, Auswertungen und
eine chronologische Kontrollhistorie.

Beide Werte stammen aus der zentralen Spieluhr. Das Spiel beginnt am festgelegten
Spieltag `2026-08-03`; reale verstrichene Sekunden laufen innerhalb der Sitzung
weiter. Dokumente, NPC-Alter, Straftaten und Fahndungen verwenden denselben
fachlichen Zeitbezug.

### Dokumentanforderungen

`documentRequestStates` speichert pro Dokumenttyp Anzahl der Anfragen, fachliche
Verfügbarkeit und das letzte Ergebnis. Die Liste angeforderter Dokumente wird aus
diesen Keys abgeleitet und nicht ein zweites Mal gespeichert. Ein Dokument kann
vorgelegt, vergessen, verloren, zunächst oder endgültig verweigert, unpassend oder
beschädigt sein. Eine anfängliche Weigerung kann durch eine zweite Aufforderung
aufgelöst werden.

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
Dokument im Gespräch anfordern
→ Anfrage in documentRequestStates aktualisieren
→ nur bei tatsächlicher Vorlage in openedDocuments und visibleDocuments eintragen

Dokument manuell schließen
→ nur aus visibleDocuments entfernen

Laptop öffnen und schließen
→ visibleDocuments unverändert lassen
```

Dadurch erscheinen zuvor sichtbare Dokumente nach dem Schließen des Police Laptops
wieder, ohne dass der Spieler sie erneut anklicken muss. Ein manuell geschlossenes
Dokument bleibt für die Auswertung trotzdem als geprüft gespeichert.

### `findings`

`findings` ist die kanonische Belegliste. Jeder Eintrag enthält Finding-ID,
Erkennungsweg, sichtbare Belegfelder, optionalen Registerrecord und Zeitpunkt.
Mögliche Erkennungswege sind Dokumentvergleich, Funkabfrage, Dokumentanforderung und
Feldvergleich. Eine Fahreraussage ist zunächst nur ein sichtbarer Gesprächsbeleg.
Sie wird erst nach dem bewussten Vergleich mit einer Dokument- oder Registerangabe
zum Finding. Nicht gestellte Fragen werden nicht als übersehene Hinweise bewertet.
Es gibt keine zweite Finding-ID-Liste; Badge, Abschlussgründe und Auswertung werden
direkt aus diesen strukturierten Einträgen abgeleitet.

Aktuell pruefbar sind:

- Name, Adresse und Geburtsdatum
- Führerscheinnummer
- Kennzeichen und Zulassungsnummer
- Fahrzeughersteller oder Modell
- abgelaufener Führerschein
- Policennummer und versichertes Fahrzeug
- abgelaufener Versicherungsschutz
- fehlende oder erheblich beschädigte Dokumente
- endgültig verweigerte oder unpassende Dokumente
- widersprüchliche Fahreraussagen

`discrepancyMode` enthaelt nur die laufende Feldauswahl und neutrales Bedienfeedback.
`conversationEntries` speichert die daraus entstandene Ansprache und Fahrerantwort.
Der genaue Ablauf ist unter
[Diskrepanzen entdecken](./discrepancy-interaction.md) beschrieben.

### `playerDecision`

Der Spieler wählt eine administrative Maßnahme:

- Weiterfahrt erlauben
- Weiterfahrt verweigern
- Dokumente sicherstellen
- Person zur Klärung festhalten
- Fahndungstreffer melden

Im Abschlussdialog wählt der Spieler aus seinen belegten Feststellungen die
tatsächlichen Entscheidungsgründe aus. Reines Öffnen einer Akte oder eines Dokuments
erzeugt keine Begründung.
`Fahndungstreffer melden` ist selbst die bewusste Aussage des Spielers, dass für den
aktuell kontrollierten Fahrer eine aktive Fahndung vorliegt. Es ist keine zusätzliche
Aktenzuordnung erforderlich.

### `resolution`

Die Auswertung entsteht erst nach der bestätigten Entscheidung. Sie enthält:

- Gesamtbewertung
- korrekte oder erwartete Entscheidung
- richtig erkannte, übersehene und falsch markierte Feststellungen
- nicht geöffnete Dokumente
- Punktwert von 0 bis 100 und konkretes Einsatzfeedback
- nach Abschluss aufgedeckter Falltyp und Komplexitätsstufe

Der Bericht gliedert Feststellungen in:

- Dokumentenprüfung
- Gültigkeitsprüfung
- Polizeiabgleich
- Dokumentvorlage und Aussagen

Mögliche Bewertungen sind `correct`, `partially_correct` und `incorrect`.

Auswertung, Szenariofortschritt und die Folge für die TrafficEntity werden beim
Bestätigen der Entscheidung gemeinsam durch den Finalization Service ausgeführt.
Der Button im Ergebnisbericht schließt danach nur noch die Anzeige und kann keinen
Spielstand mehr unvollständig zurücklassen.

## Fachliche Regeln

Die erwartete Maßnahme folgt einer eindeutigen Priorität:

```text
Passende aktive Fahndung
→ Fahndungstreffer melden

Widersprüchliche Identitätsaussage
→ Person zur Klärung festhalten

Dokumentenmanipulation oder erheblich beschädigtes Dokument
→ Dokumente sicherstellen

Abgelaufener oder nicht vorgelegter Pflichtnachweis
→ Weiterfahrt verweigern

Keine handlungsrelevante Feststellung
→ Weiterfahrt erlauben
```

Die Spielerentscheidung erzeugt außerdem einen fachlichen Endzustand:

| Entscheidung | Endzustand |
|---|---|
| Weiterfahrt erlauben | `released` |
| Weiterfahrt verweigern | `held` |
| Dokumente sicherstellen | `documents_seized` |
| Person zur Klärung festhalten | `held` |
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

Die aktuelle Version speichert daher keine Datenbank-Klickhistorie. Eine solche Historie könnte
später als anonyme Balancing- oder Tutorial-Telemetrie interessant sein, darf aber
nicht zur fachlichen Bewertung einer einzelnen Kontrolle verwendet werden.

## Bedienkontext

Das Dienstwerkzeug-Panel mit dem Police Laptop ist während des Spiels dauerhaft
erreichbar und benötigt keine Auswahl des Polizeifahrzeugs.

Während einer aktiven Kontrolle erscheint unten rechts eine breite Gesprächsbox.
Sie zeigt die Aussagen von Spieler und Fahrer sowie die drei verfügbaren
Dokumentfragen. Bereits geschlossene Dokumente können dort erneut angesehen werden.
Die frühere globale Dokumentleiste existiert nicht mehr.

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

Der Wechsel in den Police Laptop beendet oder pausiert die Kontrollsession nicht.
Gespraechsbox, Aktionsdock und geoeffnete Dokumente bleiben als kontrollbezogene
Arbeitsmittel sichtbar. Der Spieler kann dadurch Datenbank und Dokumente vergleichen,
ohne Fenster nach jedem Moduswechsel erneut aufbauen zu muessen.

Funkabfragen sind ebenfalls Teil der Session. Der Spieler markiert ein sichtbares
Dokumentfeld und erhaelt eine Antwort aus denselben freigegebenen Registern wie im
Police Laptop. Fahrer- und Zentralenverlauf bleiben getrennt gespeichert. Details
stehen unter [Funkabfragen an die Zentrale](./radio-inquiries.md).

## Noch nicht Bestandteil

- freie oder verzweigte Dialoge
- KI-generierte Antworten
- freie Spielernotizen
- Datenbank-Abfragehistorie
- Fallakten und Beweisketten
- persistente Kontrollhistorie
- mehrere parallele Kontrollen
- Speichern einer laufenden Kontrolle
- sichtbare Übergabeanimation oder weitere Bearbeitung nach einem Fahndungstreffer

## Erweiterbarkeit

Vor der eigentlichen Generierung plant der Control Scenario Director den spielbaren
Inhalt der naechsten zufaelligen Kontrolle:

```text
Control Scenario Director
→ Generatoren
→ TrafficEntity
→ InspectionSession
→ Police-Laptop-Recherche
→ InspectionEvaluator
```

Diese vorgelagerte Auswahl veraendert das Session-Modell nicht. Die Session bleibt
fuer Spielerhandlungen verantwortlich und uebernimmt weder Balancing noch
Generierungsverantwortung. Details stehen unter
[Kontrollfaelle und Pacing](./control-scenario-pacing.md).

Spätere Ergänzungen wie `submittedDocumentIds`, `playerNotes`,
`shiftId`, `relatedCaseIds` oder ein `finalSnapshot` können an die Session
angebunden werden. Die Session dokumentiert Gameplay und übernimmt keine
Generierungsverantwortung.
