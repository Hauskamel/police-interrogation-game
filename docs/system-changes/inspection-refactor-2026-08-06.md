# Technische Änderungen: Inspection Refactor

Stand: 06.08.2026

## Ziel

Der Refactor beseitigt eine fachlich falsche automatische Feststellung, reduziert
doppelt gespeicherten Sessionzustand und trennt UI, Domainlogik und Abschlussfolgen
deutlicher voneinander. Das bestehende Kontroll-Gameplay bleibt dabei erhalten.

## Fahreraussagen als Belege

Vorher trug eine widersprüchliche Antwort bereits eine `findingId`. Das Stellen der
Adressfrage schrieb dadurch automatisch ein Finding in die Session. Der Evaluator
erwartete diesen Widerspruch sogar dann, wenn der Spieler die Frage nie gestellt hatte.

Jetzt enthält die Antwort ein sichtbares `statementField`. Im Diskrepanzmodus kann
der Spieler diese Aussage mit Führerschein oder Personenregister vergleichen. Erst
ein erfolgreicher Vergleich erzeugt `inconsistent_driver_statement`. Unbeobachtete
Aussagen werden nicht bewertet.

## Normalisierter Sessionzustand

`requestedDocuments` wurde entfernt, weil dieselbe Information bereits in den Keys
von `documentRequestStates` liegt. `askedQuestionIds` wurde entfernt, weil gestellte
Fragen aus den Intervieweinträgen von `conversationEntries` hervorgehen. Kleine
Selector-Funktionen leiten beide UI-Werte bei Bedarf ab.

`openedDocuments` und `visibleDocuments` bleiben bewusst getrennt: Sie beschreiben
Prüfverlauf und aktuellen Fensterzustand und sind daher keine redundanten Daten.

## Ausgelagerte Domainlogik

Die Dokumentreaktion liegt nun in `resolveDocumentRequest`. Der Inspection Store
wendet das Ergebnis nur noch auf die Session an. Dialogtext, Verfügbarkeit, Ergebnis
und mögliches Finding können dadurch unabhängig vom Zustandsspeicher getestet werden.

Die Maßnahmenpriorität liegt in `inspectionDecisionPolicy`. Handbuch und Evaluator
verwenden damit dieselbe kanonische Reihenfolge statt zweier unabhängiger Regeln.

## Zentraler Kontrollabschluss

`finalizeInspection` führt Auswertung, abgeschlossene Session, Pacing-Fortschritt und
Traffic-Konsequenz gemeinsam aus. Das Schließen des Ergebnisberichts entfernt nur
noch den Bericht aus der UI. Ein nicht geschlossener Bericht kann daher keine
unvollständig verbuchte Kontrolle mehr erzeugen.

## UI-Aufteilung

Der bisher 727 Zeilen große `InspectionWorkspace` wurde in folgende Verantwortungen
aufgeteilt:

- `InspectionWorkspace`: Orchestrierung der aktiven Session
- `InspectionActionDock`: Feldmodi, Timer und Abschlussaktion
- `InspectionDecisionDialog`: Maßnahme und Begründungen
- `InspectionResultDialog`: Auswertung und Feedback
- `InspectionFocusOverlay`: visueller Fokusmodus

## Entferntes Legacy

Entfernt wurden die ungenutzten Game-Modi `DISCREPANCY` und `COMPARE`, der ungenutzte
Panel-Close-Helper, der wirkungslose globale UI-Visibility-Store, der nicht verwendete
Interview-Index sowie der nie gespeicherte Status `cancelled`. Die Dokumentanimation
verwendet keinen globalen Boolean mehr, der zuvor nur auf `true` gesetzt werden konnte.

## Absicherung

Die Tests decken zusätzlich ab:

- Aussagen erzeugen beim Fragen kein automatisches Finding.
- Aussagen lassen sich als Feld mit einer Gegenangabe vergleichen.
- Ungefragte Widersprüche werden nicht als übersehen bewertet.
- Der Finalization Service verbucht Fortschritt und Traffic-Folge vor dem Schließen des Berichts.
