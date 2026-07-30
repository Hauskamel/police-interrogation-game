# Dokumentation

Die Dokumentation ist in zwei Bereiche unterteilt:

```text
docs/
├── game-systems/      # Beschreibt Spielsysteme und Design-Absichten
└── system-changes/    # Beschreibt technische Änderungen, Refactors und Branch-Historie
```

## Game Systems

Diese Dokumente erklären, **was ein Feature im Spiel bedeutet** und wie es gedacht ist.

| Dokument | Inhalt |
|---|---|
| [NPCs, Polizeiwissen und Verkehrskontrollen](./game-systems/npc-generation.md) | Wie NPCs, Fahrzeuge, Halter, Fahndungsrecords, TrafficEntities und Dokumentdaten zusammenhängen |
| [Spielbare Polizei-Datenbank](./game-systems/police-database.md) | Welche Informationen der Police Laptop zeigt, wie die Suchen funktionieren und warum World Truth verborgen bleibt |
| [Kontrollsession Phase 1](./game-systems/inspection-session.md) | Gameplay-Ablauf, Session-Felder, Informationsgrenzen und spätere Erweiterungsmöglichkeiten |

## System Changes

Diese Dokumente erklären, **was technisch geändert wurde**.

| Dokument | Inhalt |
|---|---|
| [Kontrollsession Phase 1 vom 30.07.2026](./system-changes/inspection-session-phase-1-2026-07-30.md) | Technische Umsetzung von Session Store, Dokumenttracking, Prüfpunkten, Evaluator und Kontrollbericht |
| [Police-Laptop-Prototyp vom 30.07.2026](./system-changes/police-laptop-prototype-2026-07-30.md) | Technische Umsetzung der Suche, Fahndungsakten, Fahrzeugrelationen und Laptop-Überarbeitung |
| [Branch-Refactor vom 29.07.2026](./system-changes/branch-refactor-summary-2026-07-29.md) | Vollständige Zusammenfassung des NPC-, Traffic-, Datenbank- und Dokument-Refactors auf diesem Branch |
| [Bugreport vom 27.07.2026](./system-changes/bug-report-2026-07-27.md) | Behobene Fehler, offene funktionale Lücken und Validierung vom 27.07.2026 |
| [NPC Manipulated Identity Branch Changes](./system-changes/npc-manipulated-identity-branch-changes.md) | Was auf `feature/npc-manipulated-identity` hinzugefügt, geändert und entfernt wurde |
| [Domain-Konvention](./system-changes/domain-convention.md) | Projektstruktur und Domain-Regeln |
| [Refactor Log](./system-changes/refactor-log.md) | Chronologische Refactor-Historie |
