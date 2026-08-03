# Kontrollsession Phase 1: Stabilisierung

Stand: 03.08.2026

## Ziel

Diese Änderung stabilisiert die bestehende erste Kontrollsession, bevor Phase 2
beginnt. Sie verändert nicht den Grundablauf der NPC- und Traffic-Generatoren, sondern
ergänzt fehlende fachliche Grenzen, realistische Dokumentdaten und konsistente
Kontrollfolgen.

Die zentralen fachlichen Regeln werden inzwischen durch eine erste automatisierte
Vitest-Suite abgesichert. Vollständige Browser- und UI-Tests sind noch nicht Teil
dieser Phase.

## 1. Amtliche Register und Polizeiwissen getrennt

Neu ist ein eigenständiges `officialRegistry` mit vier normalisierten Tabellen:

```text
peopleById
driverLicensesByNumber
vehiclesById
insurancePoliciesById
```

Die bestehende `criminalDatabase` bleibt für polizeiliche Personenakten, bekannte
Straftaten und Fahndungen verantwortlich. Die Personensuche zeigt daher weiterhin
nur polizeibekannte Personen. Führerschein-, Kennzeichen- und Versicherungssuchen
verwenden dagegen die fachlich passenden amtlichen Register.

Beim Spielstart werden die amtlichen Stammdaten bereits erzeugter Polizeirecords in
das Register übernommen. Beim Traffic-Spawn registriert ein gemeinsamer Commit:

1. unbekannte Tatsachen in `worldTruthDatabase`,
2. ausschließlich echte amtliche Daten in `officialRegistry`,
3. anschließend die normalisierte TrafficEntity im aktiven Weltzustand.

`presented`, Crime Records und Wanted Records werden nie in amtliche Tabellen kopiert.

## 2. Zentraler Spieltag und Führerscheinlebenszyklus

`gameTime.js` stellt einen gemeinsamen fachlichen Spielzeitpunkt bereit. Neue
Spielsitzungen beginnen am `2026-08-03T08:00:00.000Z`; reale verstrichene Zeit läuft
von dort weiter. NPC-Alter, Dokumente, Straftaten, Fahndungen und Kontrollzeitpunkte
verwenden diese Uhr.

Führerscheine unterscheiden jetzt:

```text
licensedSince = Beginn der Fahrerlaubnis
issueDate     = Ausstellung der aktuellen Karte
expiryDate    = Ende der aktuellen Kartengültigkeit
```

Das Ausstellungsdatum wird nicht mehr gleichverteilt zwischen dem 18. Geburtstag und
heute gewählt. Gültige Karten stammen aus ihrem aktuellen 15-Jahres-Zyklus.
Bei ausreichend lange bestehenden Fahrerlaubnissen werden abgelaufene Karten mit
einer bewussten Wahrscheinlichkeit von acht Prozent erzeugt und sind höchstens drei
Jahre abgelaufen. Junge Fahrer erhalten dadurch keine zeitlich unmögliche Altkarte.

## 3. Versicherungsdokument vervollständigt

Jede TrafficEntity erhält eine eigenständige Police mit:

- `policyId` und `policyNumber`
- Versicherer
- `policyHolderNpcId`
- `vehicleId` und versichertem Kennzeichen
- `validFrom`, `validUntil` und Status

Der sichtbare Versicherungsnachweis zeigt diese `presented`-Daten. Zwei bewusste
Manipulationen sind möglich:

- falsche Policennummer
- falsches versichertes Kennzeichen

Der Police Laptop besitzt einen zusätzlichen Suchmodus für Policennummern. Außerdem
kann die Versicherung als eigener Gültigkeitsfehler ablaufen. Die normale
Ablaufwahrscheinlichkeit beträgt fünf Prozent.

## 4. Erkennbare Findings

Die Finding-Definitionen vermerken nun, welches amtliche Register für ihren Nachweis
notwendig ist. Der Evaluator erwartet einen Dokumentfehler nur, wenn der zugehörige
kanonische Record auflösbar ist.

Dadurch gilt weiterhin:

```text
verborgene Straftat ohne Polizeiwissen
→ kein erwartetes Finding

konsistente, später registergestützte Tarnidentität
→ in einer normalen Kontrolle nicht automatisch erkennbar

einfache Fälschung mit auflösbarem Gegenrecord
→ prüfbares Finding
```

Hinzugekommen sind Findings für falsche Policennummer, falsches versichertes Fahrzeug
und abgelaufenen Versicherungsschutz.

## 5. Kontrollentscheidungen erzeugen Endzustände

Die Auswertung enthält jetzt `resolutionAction`:

```text
released
warned_and_released
held
referred
transferred
```

Normale freigegebene Fahrzeuge fahren weiter. Zurückgehaltene, zur Prüfung übergebene
oder wegen Fahndung übergebene TrafficEntities verlassen den aktiven Verkehrskontext.
Dev-Spawns werden nach dem Abschluss entfernt, weil ihr Bewegungsmodus keine reguläre
Weiterfahrt besitzt. Der Abschlussbutton benennt die tatsächliche Folge.

## 6. Doppelte Weltinstanzen verhindert

Die Kandidatenauswahl für bekannte und gesuchte Täter erhält die bereits aktiven
NPC- und Fahrzeug-IDs als Ausschlussliste. Zusätzlich verweigert der Traffic Store
das Hinzufügen oder Aktualisieren einer Entity, wenn dieselbe kanonische `npcId` oder
`vehicleId` bereits aktiv ist.

Der gemeinsame Spawn-Commit prüft diese Invariante vor der Registrierung. Ein
abgelehnter Spawn hinterlässt deshalb weder neue World-Truth- noch Registerrecords.

## Police-Laptop-Änderungen

- Oberfläche in `Zentrales Behördenregister` umbenannt
- Personensuche bleibt auf Polizeiwissen begrenzt
- Führerscheinsuche liest das amtliche Führerscheinregister
- Kennzeichensuche liest das amtliche Fahrzeugregister
- Versicherungssuche und Policendetails ergänzt
- amtliche Personenrecords zeigen ausdrücklich, wenn keine Polizeipersonenakte besteht
- Police Laptop liest weiterhin niemals direkt aus `worldTruthDatabase`

## Verifikation

Alle sichtbaren Datumsfelder werden über einen gemeinsamen Formatter als
`TT.MM.YYYY` ausgegeben. Intern bleiben die kanonischen ISO-Werte erhalten, damit
Datumsvergleiche, Sortierung und Persistenz nicht von der Darstellung abhängen.

Der aktuelle Spieltag wird außerhalb des Laptop-Vollbilds zusätzlich dauerhaft
oben mittig in der Spieloberfläche angezeigt. So kann der Spieler Dokumentdaten
direkt mit dem geltenden Spieltag vergleichen.

Ausgeführt und erfolgreich:

```text
npm run lint
npm run build
```

Zusätzlich im Browser geprüft:

- Spielstart und zentraler Spieltag
- Fahndungsliste und Personenakte
- Führerscheinsuche über amtliches Register
- ziviler Kontrollspawn
- vollständiger Versicherungsnachweis
- Versicherungssuche anhand der vorgelegten Policennummer
- Öffnen aller Pflichtdokumente
- korrekte Kontrollauswertung und ausgeführter Endzustand
- keine Browser-Warnungen oder Laufzeitfehler

Zusätzlich automatisiert geprüft:

- Führerschein- und Versicherungslebenszyklen
- Trennung von `real` und `presented`
- Dokumentmanipulationen und ihre Metadaten
- Traffic-, Spawn- und Store-Invarianten
- Schutz vor Geisterdaten bei abgelehnten Spawns
- Informationsgrenzen und Prioritäten der Kontrollauswertung
- Lebenszyklus und Dokumentzustand der Kontrollsession

Der Build enthält weiterhin die bekannte Vite-Warnung zu einem großen JavaScript-
Bundle. Sie blockiert das Gameplay nicht und ist nicht Teil dieser Änderung.

## Bewusst offen

- hochwertige Tarnidentitäten und Aliasrecords
- fehlende oder verweigerte Dokumente
- Vertragswechsel und Policenhistorien
- sichtbare Übergabe- oder Prüfungsanimationen
- persistente Kontrollhistorie
- vollständige Browser- und UI-Tests
