# Spielsystem: Narrative Schicht

Stand: 07.08.2026

## Ziel

Fünf normale Verkehrskontrollen erzählen gemeinsam einen kleinen Fall. Der Spieler
erhält kein Mengen-Ziel, sondern einen realistischen Schwerpunktauftrag. Hinweise
entstehen nur, wenn die dazugehörige Frage tatsächlich gestellt wurde.

## Ablauf

Die erste Schicht behandelt eine Serie von Apothekeneinbrüchen. Gesucht wird ein
grauer Lieferwagen mit beschädigtem rechten Rücklicht. Die Kontrollen liefern
mögliche Beobachtungen zum Fahrzeug, einem Kennzeichenfragment, einer Werkstatt und
einer Lagerhalle.

```text
Schichtbriefing
→ normale Kontrolle und kontextbezogene Aussage
→ gestellte Frage wird als Gesprächshandlung gespeichert
→ daraus gewonnener Hinweis landet im Schichtgedächtnis
→ nächster Begegnungskontext schaltet passende Nachfrage frei
→ Übergabe des Ermittlungsansatzes nach fünf Kontrollen
```

Wer eine relevante Frage auslässt, erhält den Hinweis nicht. Dadurch ändern frühere
Gespräche die später verfügbaren Nachfragen. Die fachliche Kontrollauswertung bleibt
davon getrennt: Dokumentverstoß, Maßnahme und Punktzahl werden weiterhin allein vom
Inspection-System bestimmt.

## Technische Trennung

- `ControlScenario` bestimmt die prüfbare Aufgabe einer einzelnen Kontrolle.
- `shiftEncounter` liefert ihren erzählerischen Kontext.
- `conversationMemory.clueIds` ist ein Snapshot des Wissens zu Kontrollbeginn.
- `shiftStore` hält nur Schichtfortschritt und gefundene Hinweise.

Damit können spätere Schichten andere Geschichten erzählen, ohne Dokumentgenerator,
NPC-Weltwahrheit oder Evaluator umzubauen.
