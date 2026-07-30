# Spielsystem: Spielbare Polizei-Datenbank

Stand: 2026-07-30

## Ziel

Die Polizei-Datenbank ist eine eingeschränkte Recherche-Anwendung im Police Laptop.
Sie unterstützt dokumentbasiertes Gameplay nach dem Vorbild einer Kontrollstelle:
Der Spieler vergleicht Angaben, prüft Identitäten und erkennt Widersprüche.

Die Anwendung ist ausdrücklich kein Debug-Panel. Sie zeigt nur Informationen, die
der Polizei innerhalb der Spielwelt bereits bekannt sind.

## Informationsgrenze

Der Police Laptop liest ausschließlich aus `criminalDatabase`.

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

Die Führerscheinsuche verwendet die Führerscheinnummer und führt zur zugehörigen
Personenakte. Der Führerschein ist kein zweiter Personendatensatz, sondern ein
Bestandteil des kanonischen NPC-Records.

Dadurch führen Personenname und Führerscheinnummer immer zur gleichen gespeicherten
Person.

### Kennzeichensuche

Die Kennzeichensuche akzeptiert:

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

### Fahndungsliste

Die Fahndungsliste zeigt ausschließlich eigenständige Fahndungsrecords mit dem
Status `active`.

Eine Fahndungsakte enthält:

- Fahndungs-ID
- zugehörige Person
- Prioritätsstufe
- Ausstellungsdatum
- bekannte Straftat als Fahndungsgrund

`Polizeibekannt` und `Aktiv gesucht` bleiben getrennte Zustände. Eine Person kann
in der Datenbank existieren, ohne dass gegen sie aktuell eine Fahndung läuft.

### Bekannte Straftaten

Straftaten werden nicht in die Person kopiert. Der NPC enthält nur
`crimeRecordIds`, die gegen `crimeRecordsById` aufgelöst werden.

Im Laptop erscheinen nur diese bereits bekannten Records. Nicht entdeckte
World-Truth-Straftaten bleiben unsichtbar.

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

Manipulierte `presented`-Dokumente werden nicht in der Polizei-Datenbank gespeichert.
Der Spieler kann deshalb später echte Registerdaten mit vorgezeigten Dokumenten
vergleichen.

## Aktuelle Prototyp-Grenzen

- Die Datenbank wird beim Spielstart lokal neu generiert.
- Es gibt noch keine Eingabemasken für neue Ermittlungsinformationen.
- Unbekannte Täter können noch nicht über Beweise in den Polizeibestand überführt werden.
- Fahndungsstatus können im Gameplay-Laptop noch nicht geändert werden.
- Es gibt noch keine Fallakten, Zeugenaussagen oder Beweisregister.
- Jeder generierte Datenbank-NPC besitzt im Prototyp genau ein registriertes Fahrzeug.

Diese Grenzen sind bewusst. Der Prototyp bildet zuerst den sicheren Lesezugriff und
die spielerische Recherche ab.
