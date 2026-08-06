# Technische Änderungen: Stabilisierung der Kontrollsession Phase 2

Stand: 06.08.2026

## Ziel

Die bestehende Phase-2-Basis wurde ohne Schichtsystem und ohne Speichern laufender
Kontrollen fachlich vereinheitlicht. Im Mittelpunkt stehen nachvollziehbare Regeln,
ein eindeutiger Sitzungszustand und ein Fortschritt, der echte Spielerhandlungen
statt erzeugter Fahrzeuge bewertet.

## Einheitliches Finding-Modell

`markedFindingIds` wurde vollständig entfernt. `findings` ist jetzt die einzige
Quelle für erkannte Feststellungen. Aktionsbadge, Abschlussdialog und Evaluator
leiten Finding-IDs bei Bedarf aus den strukturierten Einträgen ab. Damit kann keine
zweite Liste mehr von Belegen, Quelle oder Zeitpunkt abweichen.

## Dokumentreaktionen

Zusätzlich zu vorgelegt, vergessen, verloren, beschädigt und zunächst verweigert
existieren jetzt:

- `refused`: Das Pflichtdokument wird endgültig verweigert.
- `wrong_document`: Der Fahrer legt einen Nachweis für einen anderen Kontext vor.

Beide Zustände öffnen das angeforderte Dokument nicht, erzeugen eine strukturierte
Feststellung und führen fachlich zur verweigerten Weiterfahrt. Terminale Anfragen
werden in der Gesprächsoberfläche nicht endlos erneut angeboten.

## Kontextbezogene Befragung

Neutrale Fragen nach Name und Fahrtgrund sind sofort verfügbar. Adresse und
Fahrzeughalter werden erst nach Öffnen des passenden Dokuments angeboten. Nach einer
erkannten widersprüchlichen Adresse erscheint eine konkrete Folgefrage.

Fragedefinitionen und Antwortprofile sind getrennt. Eine Antwort besteht aus Text und
optionalem Finding. Dadurch kann die Antwortquelle später ausgetauscht werden, ohne
die Session- oder UI-Verträge zu ändern.

## Pacing und Balancing

Das Pacing zählt keine Spawns mehr. Ein Szenario wird erst beim Schließen seines
Kontrollberichts mit Punktzahl und Ergebnis gespeichert. Komplexitätsstufe 3 benötigt
zusätzlich zu zehn abgeschlossenen Fällen mindestens 60 Durchschnittspunkte in den
letzten fünf Kontrollen.

Gewichte, Cooldowns, Freischaltgrenzen und Punkteanteile wurden in
`inspectionBalancing.js` zentralisiert.

## Diensthandbuch

Das zuvor leere Handbuch enthält nun spielbare Dienstregeln in vier Bereichen:
Kontrollablauf, Pflichtdokumente, Maßnahmen sowie Datenbank und Funk. Maßnahmen ohne
aktuell erreichbaren korrekten Anwendungsfall wurden aus dem Abschlussdialog entfernt.

## Nicht enthalten

- Schichtsystem und Schichtauswertung
- Speichern oder Wiederherstellen einer laufenden Kontrolle
- freie oder KI-generierte Dialoge
