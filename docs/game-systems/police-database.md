# Spielsystem: Spielbare Polizei-Datenbank

Stand: 2026-08-03

## Ziel

Der Behördenbestand ist eine eingeschränkte Recherche-Anwendung im Police Laptop.
Sie unterstützt dokumentbasiertes Gameplay nach dem Vorbild einer Kontrollstelle:
Der Spieler vergleicht Angaben, prüft Identitäten und erkennt Widersprüche.

Die Anwendung ist ausdrücklich kein Debug-Panel. Sie trennt polizeiliche Erkenntnisse
von amtlichen Verwaltungsdaten und zeigt niemals interne Weltwahrheit.

## Informationsgrenze

Der Police Laptop liest aus zwei freigegebenen Informationsquellen:

- `criminalDatabase` für Personenakten, bekannte Straftaten und Fahndungen
- `officialRegistry` für Führerscheine, Fahrzeuge und Versicherungen

Er darf niemals direkt auf `worldTruthDatabase` zugreifen. Dadurch bleibt der
zentrale Unterschied des Spielsystems erhalten:

```text
World Truth
  = Was in der Spielwelt tatsächlich stimmt

Polizeiwissen
  = Was erfasst, gemeldet oder bereits ermittelt wurde

Presented
  = Was der kontrollierte NPC auf Dokumenten vorzeigt
```

Amtliche Register sind kein allwissendes Personenverzeichnis. Eine Personensuche
bleibt auf polizeilich bekannte Personen begrenzt. Ein unbekannter Täter kann jedoch
einen amtlich gültigen Führerschein besitzen, ohne deshalb eine Kriminalakte zu haben.
Erfundene Dokumentnummern liefern keinen Treffer. Eine später registergestützte
Tarnidentität kann dagegen konsistent erscheinen und bleibt in der normalen Kontrolle
unentdeckt.

Ein unbekannter Täter kann intern eine Straftat begangen haben, ohne in der
Polizei-Anwendung aufzutauchen. Erst ein späterer Ermittlungsprozess darf neue
Informationen in den Polizeibestand übertragen.

## Verfügbare Funktionen

### Personensuche

Die Personensuche akzeptiert:

- Vorname
- Nachname
- vollständigen Namen
- bekannte Adresse
- interne Personen-ID des Polizeirecords

Ein Treffer zeigt die polizeilich gespeicherte Personenakte mit:

- Name und Adresse
- Geburtsdatum und Alter
- Geschlecht und äußeren Merkmalen
- Lichtbild
- Führerscheindaten
- registrierten Fahrzeugen
- bekannten Straftaten
- Status `Polizeibekannt` oder `Aktiv gesucht`

Die Suche listet nicht automatisch den gesamten Personenbestand auf. Der Spieler
muss eine konkrete Abfrage durchführen.

### Führerscheinsuche

Die Führerscheinsuche verwendet die Führerscheinnummer aus
`officialRegistry.driverLicensesByNumber`. Sie führt zum amtlichen Personenrecord.
Existiert zusätzlich eine Polizeipersonenakte mit derselben `npcId`, können deren
bereits bekannte Erkenntnisse angezeigt werden.

`licensedSince` beschreibt die erstmalige Fahrerlaubnis. `issueDate` und `expiryDate`
gehören dagegen zur aktuell registrierten Karte.

### Kennzeichensuche

Die Kennzeichensuche liest das amtliche Fahrzeugregister und akzeptiert:

- amtliches Kennzeichen
- Zulassungsnummer

Leerzeichen und Bindestriche werden bei der Suche normalisiert. Die Fahrzeugakte
zeigt:

- Kennzeichen
- Hersteller und Modell
- Zulassungsnummer
- Ausstellungsdatum
- Baujahr, Leistung und Gewicht
- den separat verknüpften eingetragenen Halter

Von der Fahrzeugakte kann die bekannte Personenakte des Halters geöffnet werden.
Ist der Halter nicht polizeibekannt, erscheint nur sein amtlicher Personenrecord.

### Versicherungssuche

Die Versicherungssuche akzeptiert eine konkrete Policennummer und zeigt:

- Versicherer und Policennummer
- Status, Beginn und Ende des Versicherungsschutzes
- versichertes Kennzeichen und verknüpftes Fahrzeug
- den amtlich registrierten Versicherungsnehmer

Eine manipulierte Policennummer kann dadurch bewusst ohne Treffer bleiben. Bei einer
unveränderten Nummer lassen sich Kennzeichen und Laufzeit mit dem vorgelegten Dokument
vergleichen.

### Fahndungsliste

Die Fahndungsliste zeigt ausschließlich eigenständige Fahndungsrecords mit dem
Status `active`.

Eine Fahndungsakte enthält:

- Fahndungs-ID
- zugehörige Person
- Prioritätsstufe
- Ausstellungsdatum
- bekannte Straftat als Fahndungsgrund

Die Fahndungsliste zeigt den Namen der gesuchten Person als primäre Information.
Prioritätsstufe und Fahndungs-ID stehen ergänzend darunter. Der Name wird beim
Anzeigen über `WantedRecord.npcId` aus `npcsById` aufgelöst und nicht in den
Fahndungsrecord kopiert.

`Polizeibekannt` und `Aktiv gesucht` bleiben getrennte Zustände. Eine Person kann
in der Datenbank existieren, ohne dass gegen sie aktuell eine Fahndung läuft.

### Bekannte Straftaten

Straftaten werden nicht in die Person kopiert. Der NPC enthält nur
`crimeRecordIds`, die gegen `crimeRecordsById` aufgelöst werden.

Im Laptop erscheinen nur diese bereits bekannten Records. Nicht entdeckte
World-Truth-Straftaten bleiben unsichtbar.

### Verwendung in einer Kontrolle

Während einer aktiven Kontrollsession bleibt die Datenbank ein freies
Recherchewerkzeug. Personen-, Fahrzeug- und Fahndungsakten werden nicht manuell mit
der Kontrolle verknüpft.

Der Spieler darf mehrere Treffer vergleichen, falsche Ergebnisse öffnen und danach
weiter recherchieren. Das Spiel interpretiert weder die zuletzt geöffnete Akte noch
einen einzelnen Klick als Identifikation des kontrollierten Fahrers.

Die bewusste Schlussfolgerung erfolgt erst über die Kontrollentscheidung. Wählt der
Spieler `Fahndungstreffer melden`, behauptet er damit, dass der aktuell kontrollierte
Fahrer aktiv gesucht wird. Der Evaluator prüft diese Aussage gegen den tatsächlichen
polizeilichen Datensatz.

Die Datenbanknutzung wird in Phase 1 nicht bewertet. Dadurch wird weder blindes
Durchklicken belohnt noch das Vergessen eines zusätzlichen Zuordnungsbuttons
bestraft.

### Recherchekontext beim Schließen

Das Schließen des Police Laptops beendet keine laufende Recherche. Beim erneuten
Öffnen werden deshalb wiederhergestellt:

- zuletzt geöffnete Laptop-Seite
- Datenbanksuche oder Fahndungsliste
- gewählte Suchart
- eingegebener Suchbegriff
- ausgewählte Personen-, Fahrzeug-, Versicherungs- oder Fahndungsakte

Der Spieler kann dadurch zwischen Dokumenten und Polizeidaten wechseln, ohne
dieselbe Person nach jedem Wechsel erneut suchen zu müssen.

Der Einstieg in den Police Laptop liegt dauerhaft im Panel `Dienstwerkzeuge`.
Das Polizeifahrzeug muss dafür nicht ausgewählt werden. Nach dem Schließen des
Laptops erscheinen der angeheftete Kontrollkontext und zuvor sichtbare Dokumente
wieder.

Der Zustand enthält ausschließlich UI-Werte und Record-IDs. Es werden keine
Polizeidatensätze kopiert und keine Aktenklicks als Spieleraussage bewertet.

Beim Start eines neuen Spiels wird der Recherchekontext zurückgesetzt, weil die
Polizeidatenbank neu generiert wird und alte Record-IDs dann nicht mehr gültig sein
können.

## Relationales Modell

```text
criminalDatabase
├── npcsById
├── crimeRecordsById
├── wantedRecordsById
├── vehiclesById
├── criminalNpcIds
├── knownOffenderNpcIds
├── wantedRecordIds
└── vehicleIds
```

```text
officialRegistry
├── peopleById
├── driverLicensesByNumber
├── vehiclesById
└── insurancePoliciesById
```

Die amtlichen Tabellen enthalten keine `crimeRecordIds`, `wantedRecordIds` oder
unbekannten World-Truth-Straftaten. Beim Spawn wird ausschließlich `real` registriert;
`presented` bleibt kontrollspezifisch und kann davon abweichen.

Die Beziehungen entstehen über IDs:

```text
NPC
├── crimeRecordIds[] ──────> CrimeRecord
└── vehicleIds[] ──────────> Vehicle

Vehicle
└── registeredOwnerNpcId ──> NPC

WantedRecord
├── npcId ─────────────────> NPC
└── reasonCrimeRecordIds[] ─> CrimeRecord
```

## Zusammenspiel mit Traffic

Polizeibekannte und gesuchte Traffic-NPCs werden aus `criminalDatabase` geladen.
Ihr registriertes Fahrzeug wird ebenfalls aus dem Fahrzeugregister aufgelöst.

Dadurch bleiben die Daten konsistent:

```text
Person im Verkehr
  = Person in der Police-Laptop-Suche

Führerschein im Polizeirecord
  = Führerschein-Suchergebnis

Kennzeichen des registrierten Fahrzeugs
  = Kennzeichen-Suchergebnis
```

Manipulierte `presented`-Dokumente werden weder in der Polizei-Datenbank noch im
amtlichen Register gespeichert.
Der Spieler kann deshalb später echte Registerdaten mit vorgezeigten Dokumenten
vergleichen.

## Aktuelle Prototyp-Grenzen

- Die Datenbank wird beim Spielstart lokal neu generiert.
- Es gibt noch keine Eingabemasken für neue Ermittlungsinformationen.
- Unbekannte Täter können noch nicht über Beweise in den Polizeibestand überführt werden.
- Fahndungsstatus können im Gameplay-Laptop noch nicht geändert werden.
- Es gibt noch keine Fallakten, Zeugenaussagen oder Beweisregister.
- Jeder generierte Datenbank-NPC besitzt im Prototyp genau ein registriertes Fahrzeug.
- Hochwertige Tarnidentitäten, die auch in amtlichen Registern hinterlegt sind, sind
  als späterer Ausbau vorgesehen.
- Policen werden derzeit beim Traffic-Spawn erzeugt; Vertragswechsel und Historien
  sind noch nicht modelliert.

Diese Grenzen sind bewusst. Der Prototyp bildet zuerst den sicheren Lesezugriff und
die spielerische Recherche ab.
