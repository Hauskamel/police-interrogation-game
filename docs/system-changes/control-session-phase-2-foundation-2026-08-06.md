# Technische Änderungen: Kontrollsession Phase 2

Stand: 06.08.2026

## Umfang

Diese Änderung setzt die ersten sieben vorgesehenen Phase-2-Bausteine um. Das
Speichern einer laufenden Kontrolle ist ausdrücklich nicht enthalten.

## Strukturierte Feststellungen

Eine Kontrollsession besitzt jetzt `findings`. Jeder Beleg speichert die fachliche
Finding-ID, den Erkennungsweg, die vom Spieler verwendeten sichtbaren Felder, einen
optionalen Registerbezug und den Spielzeitpunkt. Dokumentvergleich, Funkabfrage,
Dokumentanfrage und Befragung schreiben damit in dasselbe Modell.

## Dokumentvorlage und Gespräch

TrafficEntities erhalten ein `documentAvailability`-Profil. Dokumente können
vorgelegt, vergessen, verloren, zunächst verweigert oder beschädigt sein. Die
Session speichert Anfragen und Versuche in `documentRequestStates`. Die Textbox
zeigt die tatsächliche Antwort und öffnet nur wirklich vorgelegte Dokumente.

Das `statementProfile` enthält stabile Antworten auf Name, Adresse, Halter und
Fahrtgrund. Widerspruchsszenarien markieren eine konkrete Antwort als
kontrollrelevant. Die Schnittstelle kann später durch verzweigte oder KI-gestützte
Antworten ersetzt werden, ohne die Sessionauswertung zu ändern.

## Entscheidungen und Bericht

Neu sind `seize_documents` und `hold_for_clarification`. Der Spieler wählt im
Abschlussdialog nur aus bereits belegten Feststellungen seine Begründungen. Der
Evaluator prüft Maßnahme und Gründe getrennt und erstellt einen Punktwert von 0 bis
100, verständliches Feedback, Dokumentstatus und den nach Abschluss offengelegten
Falltyp.

## Fälle und Pacing

Ergänzt wurden fehlender Führerschein, fehlende Versicherung, anfängliche Weigerung,
beschädigtes Dokument, widersprüchliche Aussage, verborgener Straftäter und ein
kombinierter Mehrfachfall. Komplexitätsstufen 1 bis 3 werden nach 0, 3 und 10
erfolgreich erzeugten Fällen freigeschaltet. Bestehende Schutzregeln gegen monotone
Serien bleiben erhalten.

## Abgrenzung

NPC-, Fahrzeug-, Register- und Dokumentwahrheit bleiben in ihren bisherigen
Fachmodulen. Kontrollspezifische Antworten und Verfügbarkeit liegen auf der
TrafficEntity; Spielerhandlungen und Belege liegen in der InspectionSession.
`worldTruthDatabase` wird weiterhin nicht während der Kontrolle offengelegt.

Nicht umgesetzt wurde das Persistieren oder Wiederherstellen einer laufenden
Kontrollsession. Dieser Punkt bleibt eine eigenständige spätere Erweiterung.
