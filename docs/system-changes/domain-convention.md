# Domain-Konvention

Dieses Projekt organisiert Spiellogik in **Domains** unter `src/game/`. Jede Domain beschreibt ein eigenständiges Spielsystem.

## Standard-Struktur einer Domain

```text
src/game/<domain>/
├── components/   # UI und React-Komponenten dieser Domain
├── data/         # Statische Listen, Profile, Konfigurationsdaten
├── generators/   # Laufzeit-Erzeugung von Spielobjekten und Records
├── hooks/        # React-Hooks mit Domain-Logik
├── utils/        # Pure Helper-Funktionen ohne React-Abhängigkeit
└── index.js      # Public API — nur hier exportierte Symbole gelten als öffentlich
```

Nicht jede Domain braucht alle Ordner. Fehlende Layer werden erst angelegt, wenn sie gebraucht werden.

## Bestehende Domains

| Domain | Verantwortung |
|---|---|
| `world` | 3D-Szene, Spawn-Logik, Pfade, Positions-Konfiguration |
| `vehicles` | Fahrzeugprofile, GLB-Pfade, Fahrzeug-Hooks |
| `npcs` | NPC-Stammdaten, biometrische Merkmale, Profil-Generatoren |
| `documents` | Führerschein, Fahrzeugpapiere, Versicherung, Document-Manager |
| `crimes` | Crime-Types, Criminal-Database-Generator |
| `traffic` | Aktive Verkehrsteilnehmer, TrafficEntity-Generatoren, Traffic-Spawner |
| `police` | Laptop, Funkgerät, Notebook, Polizei-Daten |
| `panels` | Gameplay-Panels zur Fahrzeug-/Polizei-Interaktion |

## Außerhalb von `game/`

```text
src/
├── app/              # App-Shell: Root-Layout, Startmenü
├── devtools/         # Debug-UI und Entwickler-Hooks (nicht für Production)
├── stores/           # Zustand-Management (Zustand-Slices)
└── styles/           # Globale CSS-Dateien
```

### `app/`

Enthält die App-Shell — Komponenten, die das Spiel als Ganzes rahmen, aber keine Domain-Logik sind:

- `App.jsx` — Root-Layout, orchestriert Domains
- `app/components/Startmenu.jsx` — Hauptmenü

Das Notebook liegt in `game/police/components`, weil es Teil des Polizei-Workflows ist.

### `devtools/`

Alles, was nur für Entwicklung/Debug gedacht ist:

- `useLilGuiSetup` — lil-gui Spawn-Panel
- `panels/VehicleDebugPanel` — temporäres Profil-Debug-Panel

Später kann hier ein `import.meta.env.DEV`-Gate eingebaut werden, um Debug-UI aus Production-Builds auszuschließen.

## Import-Aliase

Cross-Domain-Imports nutzen Aliase statt langer relativer Pfade:

```js
import { useTrafficStore } from '@stores';
import { Gamecanvas } from '@game/world/components';
import { BaseImage } from '@game/documents/components/base';
import { Startmenu } from '@app/components/Startmenu';
import { VehicleDebugPanel } from '@devtools/panels/VehicleDebugPanel';
import '@styles/App.css';
```

| Alias | Pfad |
|---|---|
| `@` | `src/` |
| `@app` | `src/app/` |
| `@devtools` | `src/devtools/` |
| `@game` | `src/game/` |
| `@stores` | `src/stores/` |
| `@styles` | `src/styles/` |

Imports **innerhalb** derselben Domain dürfen weiterhin relative Pfade nutzen (`../hooks`, `./BaseControlPanel.jsx`).

## World vs. Vehicles

**World** rendert alles, was in der 3D-Szene erscheint (`Gamecanvas`, `Car`, `Road`, …).

**Vehicles** liefert Daten, Generatoren und Hooks — keine eigenen Scene-Komponenten.

`Car.jsx` liegt bewusst in `world/components`, nutzt aber `@game/vehicles/hooks` und `@game/vehicles/utils`.

## Wo kommt was hin?

| Neues Feature | Zielort |
|---|---|
| Neuer Dokument-Typ | `game/documents/components/` + `generators/` |
| Wanted List im Laptop | `game/police/components/police-laptop/` |
| Neuer Crime-Type | `game/crimes/data/` |
| Neue TrafficEntity-Variante | `game/traffic/generators/` |
| Debug-Panel | `devtools/panels/` |
| HUD-Element (Menü, Overlay) | `app/components/` |
| Dokument-Base-Komponente | `game/documents/components/base/` |
| Gameplay-Panel | `game/panels/components/` |
