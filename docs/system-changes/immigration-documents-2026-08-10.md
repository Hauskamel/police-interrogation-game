# Technische Änderungen: Herkunft und Aufenthaltsdokumente

Stand: 10.08.2026

## Datenmodell und Generierung

- Jeder neue NPC erhält `countryOfOrigin` und `migrationProfile`.
- `generateMigrationProfile` erzeugt abhängige statt voneinander unabhängige Daten.
- Aufenthaltszweck und Dauer bestimmen die Dokumentpflichten.
- `generateImmigrationDocuments` erzeugt Aufenthaltstitel und optional eine daran
  referenzierte Arbeitserlaubnis.
- Minderjährige und Erwachsene verwenden denselben Profilaufbau; nur der
  Führerschein entfällt bei Minderjährigen.

## Dokumente und Oberfläche

- `ResidencePermit` nutzt `public/images/documents/residence-permit.png`.
- `WorkPermit` nutzt `public/images/documents/work-permit.png`.
- Ausländische Führerscheine nutzen
  `public/images/documents/foreign-drivers-license.png`.
- Aufenthaltsdokumente werden erst nach der Herkunftsfrage in der Gesprächsbox
  anforderbar und bleiben danach wie bestehende Dokumente geöffnet.
- Herkunft, Titelnummern, Beruf, Arbeitgeber, lokale Anschrift und Gültigkeitsdaten
  sind im Stil der vorhandenen Dokumente sichtbar.

## Gespräch und Kontrollsession

- Eine Frage nach Herkunft und Aufenthaltsdauer wird durch einen geöffneten
  ausländischen Führerschein freigeschaltet.
- Langer Aufenthalt und Erwerbstätigkeit schalten passende Folgefragen frei.
- Antworten stammen aus dem kanonischen Migrationsprofil und bleiben innerhalb der
  Kontrolle stabil.
- Erforderliche Dokumente werden pro TrafficEntity dynamisch ermittelt. Abschluss
  und Auswertung erwarten daher nur fachlich notwendige Genehmigungen.
- Findings für fehlende, abgelaufene oder relational widersprüchliche Titel sind als
  Grundlage für spätere Szenarien vorhanden.

## Registerrelationen

- Das amtliche Register enthält `residencePermitsByNumber` und
  `workPermitsByNumber`.
- Beide Records referenzieren den Inhaber über `holderNpcId`.
- Die Arbeitserlaubnis referenziert den Aufenthaltstitel über dessen ID und Nummer.
- Der Police Laptop zeigt beide Records in der Personenakte; passende Felder sind
  im Diskrepanzmodus mit den vorgelegten Dokumenten vergleichbar.

## Qualitätssicherung

Die Tests decken folgende Regeln ab:

- Inland, Durchreise, langer Aufenthalt und Erwerbstätigkeit
- korrekte Dokumentpflicht je Fall
- Relation von Arbeitserlaubnis, Aufenthaltstitel und Inhaber
- verzögerte Freischaltung der neuen Dokumentfragen
- Registrierung ausschließlich kanonischer Daten

## Devtool-Konfiguration

Das lil-gui besitzt zwei zusätzliche Checkboxen:

- `Benötigt Aufenthaltserlaubnis`
- `Benötigt Arbeitserlaubnis`

Eine aktivierte Arbeitserlaubnis aktiviert automatisch auch die Aufenthaltserlaubnis.
Wird die Aufenthaltserlaubnis deaktiviert, wird die Arbeitserlaubnis ebenfalls
deaktiviert. Die Auswahl erzeugt einen fachlich passenden ausländischen Langzeit-
oder Arbeitsaufenthalt und nicht nur nachträglich eingeblendete Dokumente.

Bei bekannten und gesuchten Datenbank-NPCs sind die Checkboxen deaktiviert. Diese
Personen besitzen bereits kanonisch gespeicherte Herkunfts- und Migrationsdaten, die
das Devtool nicht überschreiben darf.

Am 10.08.2026 waren Lint und alle 112 automatisierten Tests erfolgreich.
