# Automatisierte Testbasis

Stand: 03.08.2026

## Ziel

Die erste automatisierte Testbasis schützt die zentralen fachlichen Regeln des
aktuellen Spielstands. Sie konzentriert sich auf Generatoren, Informationsgrenzen,
relationale Registrierung, Store-Invarianten und die Kontrollauswertung.

Die Tests prüfen bewusst keine zufällige Verteilung und keine visuellen Details.
Zufall und Spielzeit werden in den betroffenen Testfällen kontrolliert, damit die
Ergebnisse reproduzierbar bleiben.

## Testwerkzeuge

Eingesetzt werden:

- `Vitest 3.2.7` als Vite-nativer Test Runner
- `@vitest/coverage-v8 3.2.7` für Abdeckungsberichte
- die Node-Testumgebung für schnelle fachliche Tests ohne Browser

Vitest verwendet die vorhandene Vite-Konfiguration. Dadurch gelten in Anwendung
und Tests dieselben Modul-Aliase wie `@game` und `@stores`.

## NPM-Befehle

```text
npm test
npm run test:watch
npm run test:coverage
```

Der Coverage-Bericht wird unter `coverage/` erzeugt und nicht in Git aufgenommen.
Er ist auf die Module begrenzt, die durch diese erste Testsuite fachlich abgesichert
werden. Eine künstliche Mindestquote ist noch nicht eingerichtet.

## Abgedeckte Regeln

### Dokumentgeneratoren

- Führerscheindaten beginnen nicht vor der Fahrerlaubnis.
- Gültige Dokumente sind am zentralen Spieltag gültig.
- Bewusst abgelaufene Dokumente liegen im vorgesehenen Zeitraum.
- Versicherungen referenzieren Halter, Fahrzeug und Kennzeichen korrekt.
- Status und Gültigkeitszeitraum einer Police widersprechen sich nicht.

### `real` und `presented`

- Gültige Profile besitzen dieselben sichtbaren Werte.
- Beide Profile bleiben getrennte Objekte.
- Eine Fälschung verändert nur `presented`.
- Nicht betroffene Dokumentprofile bleiben unverändert.
- Erzwungene Fälschungen erzeugen passende `affectedFields` und `detectableBy`.

### Register und Spawn-Transaktion

- Amtliche Register speichern ausschließlich kanonische `real`-Daten.
- World Truth wird beim erfolgreichen Commit normalisiert registriert.
- Doppelte aktive NPC- oder Fahrzeugidentitäten werden abgelehnt.
- Ein abgelehnter Spawn hinterlässt keine World-Truth- oder Register-Geisterdaten.
- Es kann nur eine angehaltene TrafficEntity gleichzeitig geben.
- Die ausgewählte TrafficEntity wird aus ihrer ID aufgelöst und nicht kopiert.

### Kontrollsession

- Es kann nur eine Kontrollsession gleichzeitig aktiv sein.
- `startedAt` und `completedAt` stammen aus der zentralen Spieluhr.
- `requestedDocuments` und `openedDocuments` speichern ein Dokument nur einmal.
- `visibleDocuments` bleibt von Anfrage und Prüfverlauf getrennt.
- Eine abgeschlossene Session wird in den letzten Kontrollbericht verschoben.

### Kontrollauswertung

- Eine unauffällige Kontrolle erlaubt die Weiterfahrt.
- Abgelaufene Dokumente verhindern die Weiterfahrt.
- Auflösbare Dokumentmanipulationen verlangen eine weitere Prüfung.
- Nicht auflösbare interne Abweichungen werden dem Spieler nicht vorgeworfen.
- Eine aktive Fahndung besitzt die höchste Entscheidungspriorität.
- Polizeibekanntheit und verborgene Straftaten sind ohne Fahndung kein Treffer.

## Aktueller Umfang

Die Suite enthält 24 Tests in acht Testdateien. Sie bildet eine erste fachliche
Sicherheitslinie, aber noch keine vollständige Testabdeckung des Projekts.

Bewusst offen bleiben:

- React-Komponententests mit React Testing Library
- vollständige Gameplay-Abläufe mit Playwright
- Tests der 3D-Szene und Fahrzeuganimationen
- Tests der Police-Laptop-Navigation im echten Browser
- feste Coverage-Grenzwerte für eine spätere CI-Pipeline
