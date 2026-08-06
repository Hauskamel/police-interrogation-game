# Technische Aenderungen: Control Scenario Director

Stand: 04.08.2026

Branch: `codex/control-session-phase-2`

Hinweis: Dieses Dokument beschreibt die ursprüngliche Einführung. Das aktuelle
Pacing anhand abgeschlossener Kontrollen ist in
[Stabilisierung der Kontrollsession Phase 2](./control-session-phase-2-stabilization-2026-08-06.md)
beschrieben.

## Anlass

Die bisherige Zufallsgenerierung leitete Dokumentfaelschungen direkt aus dem
`trafficType` ab. Zivilisten hatten nur eine geringe Faelschungswahrscheinlichkeit.
Zusammen mit einem hohen Zivilistenanteil entstanden dadurch lange Serien aus
unauffaelligen oder lediglich abgelaufenen Dokumenten.

Die Aenderung trennt die Auswahl des spielbaren Kontrollfalls von der internen Rolle
des NPCs und schafft eine erweiterbare Pacing-Schicht fuer Phase 2.

## Neue Module

### `controlScenarios.js`

Definiert Kategorien, konkrete Falltypen, Standardgewichte und die zugehoerigen
Pruefprofile. Diese Datei ist die zentrale Konfiguration fuer das Balancing.

### `selectNextControlScenario.js`

Enthaelt eine reine, testbare Auswahlfunktion. Sie kombiniert gewichteten Zufall mit
Serienbegrenzungen, Faelschungsgarantie, Fahndungs-Cooldown und ausgeschlossenen
Falltypen.

### `controlScenarioStore.js`

Speichert einen kleinen Verlauf erfolgreich gespawnter Faelle. Der Store enthaelt
nur `type` und `category`, maximal 20 Eintraege. Beim Start eines neuen Spiels wird
der Verlauf zurueckgesetzt.

### `getControlScenarioGenerationOptions.js`

Uebersetzt einen Kontrollfall in bestehende Generatoroptionen. Dadurch enthalten
die NPC-, Fahrzeug- und Dokumentgeneratoren keine Pacing-Regeln.

### `getUnavailableControlScenarioTypes.js`

Prueft vor der Auswahl, ob ein geeigneter aktiver Fahndungsrecord vorhanden ist.
Ein nicht erzeugbarer Fahndungsfall wird damit bereits aus der Kandidatenmenge
entfernt.

## Anpassungen an bestehenden Generatoren

- `generateTrafficEntity` nimmt optional ein `controlScenario` entgegen.
- `pickTrafficEntityType` verwendet fallbezogene NPC-Gewichte und erzwingt fuer
  `wanted_person` den Fahndungstyp.
- `assembleTrafficEntity` speichert kleine Debug-Metadaten zum Kontrollfall und
  uebernimmt dessen `inspectionProfile`.
- `createDocumentState` kann die Faelschung gezielt auf Fuehrerschein,
  Fahrzeugzulassung oder Versicherung anwenden.
- Fuehrerschein- und NPC-Generatoren koennen einen abgelaufenen Fuehrerschein
  gezielt und mit plausiblem Mindestalter erzeugen.
- Die Versicherung konnte bereits gezielt als abgelaufen erzeugt werden und wird
  nun ueber das Fallrezept gesteuert.

## Spawn-Integration

Sowohl der Intervall-Spawner als auch `Spawn Random NPC` in lil-gui:

1. ermitteln aktuell ausgeschlossene Weltidentitaeten,
2. schliessen nicht erzeugbare Kontrollfaelle aus,
3. waehlen den naechsten Fall ueber den Store,
4. generieren und registrieren die TrafficEntity,
5. speichern den Fall erst nach einem erfolgreichen Spawn.

Manuell konfigurierte lil-gui-Spawns behalten ihre bisherigen Overrides und werden
nicht in den Pacing-Verlauf aufgenommen.

## Tests

Die automatisierte Suite wurde auf 56 Tests in 15 Testdateien erweitert. Neu geprueft
werden:

- maximale Serien unauffaelliger und identischer Faelle
- Faelschungsgarantie innerhalb des definierten Fensters
- Fahndungs-Cooldown und ausgeschlossene Falltypen
- langfristige Verteilung bei deterministischem Zufall
- Uebersetzung jedes Faelschungsfalls zum richtigen Dokumentziel
- vollstaendige TrafficEntities fuer saubere, abgelaufene und manipulierte Faelle
- genau eine gezielte Faelschung pro einfachem Faelschungsrezept
- Speicherung, Begrenzung und Reset des Pacing-Verlaufs
- Verfuegbarkeit aktiver Fahndungsidentitaeten und ihrer registrierten Fahrzeuge

Die neuen Kernmodule wurden ausserdem in die V8-Coverage-Konfiguration aufgenommen.

## Bewusste Grenzen

- Fehlende, vergessene oder verweigerte Dokumente sind noch nicht umgesetzt.
- Der Director plant aktuell genau eine primaere Auffaelligkeit pro Fall.
- Es gibt noch kein schicht- oder fortschrittsabhaengiges Balancing.
- Die Gewichte sind vorerst Codekonfiguration und noch keine externe Balancing-Datei.
- `controlScenario` ist interne Debug-Metadaten und darf nicht als Loesung in der
  normalen Spieleroberflaeche erscheinen.
