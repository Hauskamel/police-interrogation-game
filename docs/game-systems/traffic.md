# Spielsystem: Strassenverkehr

Stand: 08.08.2026

## Ziel

Der Strassenverkehr soll die Kontrollstelle glaubwuerdig beleben, ohne jede
vorbeifahrende Person automatisch zu einem Kontroll- oder Storyfall zu machen.
Fahrzeuge entstehen als vollwertige `TrafficEntity`, fahren auf festen Spuren
durch die Welt und koennen vom Spieler fuer eine Kontrolle angehalten werden.

Der aktuelle Ablauf lautet:

```text
Spielzustand aktivieren
-> zufaellige TrafficEntity erzeugen
-> Spawnspur und Fahrtrichtung zuweisen
-> auf gerader Route durch die Welt fahren
-> am Routenende despawnen

alternativ:

Fahrzeug anhalten
-> individuelle Pull-over-Route erzeugen
-> bis zur Kontrollposition bei (0, 0, 0) fahren
-> fuer die Kontrollsession stehen bleiben
```

## Fahrspuren

Das System verwendet vier feste Spuren:

| Fahrtrichtung | Spur | Weltposition |
|---|---:|---:|
| `left` | 1 | `z = 9` |
| `left` | 2 | `z = 14` |
| `right` | 1 | `z = 30` |
| `right` | 2 | `z = 36` |

Normale Fahrwege sind gerade `THREE.LineCurve3`-Routen entlang der X-Achse.
Position und Rotation beim Spawn werden aus dem Startpunkt und der Tangente
derselben Route abgeleitet. Spawnkonfiguration und Bewegung verwenden dadurch
keine voneinander abweichenden Koordinatenlisten.

## Ambient Traffic und Kontrollfaelle

Ambient Traffic und Story-Pacing bleiben getrennt. Pro Spawn besteht aktuell
eine 25-prozentige Chance, dass der `ControlScenarioDirector` einen vorbereiteten
Kontrollfall vorgibt. Die uebrigen Fahrzeuge werden frei ueber die vorhandenen
Traffic-Typgewichte erzeugt.

Das Anhalten eines Fahrzeugs macht es nicht nachtraeglich zu einem Storyfall.
Eine normale TrafficEntity kann trotzdem Dokumentprobleme, Polizeibekanntheit
oder einen verborgenen kriminellen Hintergrund besitzen. Diese Eigenschaften
entstehen aus den vorhandenen Generatoren und nicht aus der Fahrbewegung.

Jede TrafficEntity wird weiterhin ueber die fachlichen Spawn-Grenzen registriert:

```text
ControlScenario optional auswaehlen
-> TrafficEntity erzeugen
-> NPC-, Fahrzeug- und Registerdaten committen
-> aktive Identitaetskonflikte ausschliessen
-> TrafficEntity im Traffic-Store ablegen
```

Damit koennen dieselbe Person oder dasselbe Fahrzeug nicht gleichzeitig mehrfach
im aktiven Verkehr erscheinen.

## Spawnsteuerung

Vier unabhaengige Spawner bedienen jeweils eine Fahrspur. Nach jedem Versuch wird
ein neuer zufaelliger Abstand zwischen 3,5 und 9 Sekunden bestimmt. Es gibt daher
keinen dauerhaft festen Spawnrhythmus.

Aktuell duerfen hoechstens acht TrafficEntities gleichzeitig aktiv sein. Ist das
Limit erreicht, wartet der jeweilige Spawner bis zu seinem naechsten Versuch.
Spawner sind nur in den Spielzustaenden `INGAME` und `LAPTOP` aktiv und beenden
ihre Timer beim Verlassen dieser Zustaende.

## Fahrzeugbewegung

Die Bewegung ist zeitbasiert. Pro Frame wird die zurueckgelegte Distanz mit dem
Frame-Delta fortgeschrieben:

```text
Distanz = Distanz + Geschwindigkeit * Delta-Zeit
```

Dadurch haengt die sichtbare Geschwindigkeit nicht direkt von der Bildrate ab.
Position und Ausrichtung werden aus Punkt und Tangente der Route berechnet. Am
Routenende wird die TrafficEntity aus dem aktiven Weltzustand entfernt.

Wird ein Fahrzeug angehalten, entsteht aus seiner aktuellen Position eine
zweiteilige Bezier-Route ueber die Einfahrt der Kontrollbucht bis `(0, 0, 0)`.
Das Fahrzeug folgt ihr mit reduzierter Geschwindigkeit und bleibt am Ziel stehen.

## Pfadvisualisierung

Die aktiven Fahrzeugpfade werden im Canvas sichtbar dargestellt:

- fahrende Fahrzeuge: blaue Linie mit geringer Deckkraft
- angehaltene Fahrzeuge: gruene, deutlich sichtbare Linie

Die Visualisierung liest dieselben Routen wie die Fahrzeuganimation. Sie ist
damit keine getrennte Skizze der Strecke, sondern zeigt den tatsaechlich verwendeten
Bewegungspfad. Die Linien liegen leicht ueber der Bodenflaeche, um Flimmern durch
ueberlappende Geometrie zu vermeiden.

## Rendering und Modelle

Die vier vorhandenen NPC-Fahrzeugmodelle werden vorgeladen. Jedes Fahrzeug besitzt
im Canvas eine eigene Suspense-Grenze. Muss ein Modell noch geladen werden, fehlt
dadurch nur dieses Fahrzeug kurzzeitig; die restliche Spielwelt bleibt sichtbar.

## Aktuelle Grenzen

Das Traffic-System bildet noch keine vollstaendige Verkehrssimulation ab:

- Fahrzeuge pruefen beim Spawn nicht, ob die Spur vor ihnen frei ist.
- Es gibt noch keinen Sicherheitsabstand oder Kollisionsschutz.
- Fahrzeuge bilden keine Warteschlange vor der Kontrollstelle.
- Es existieren keine expliziten Bewegungszustaende wie `queued` oder `pullingOver`.
- Spurwechsel, Abbiegen, Schranken und Ampeln sind nicht implementiert.
- Die sichtbare Polizistenposition und das Pfadziel `(0, 0, 0)` sind noch getrennte Konfigurationen.
- Spawnrate, Fahrzeuglimit und Storychance sind noch nicht zentral als Balancingprofil gebuendelt.

## Erweiterungsrichtungen

Sinnvolle weitere Ausbaustufen sind:

1. freie Spawnflaechen und Mindestabstand zwischen Fahrzeugen pruefen
2. explizite Bewegungszustaende `driving`, `queued`, `pullingOver`, `controlled` und `released` einfuehren
3. Warteschlangen und Stop-Punkte vor der Kontrollstelle modellieren
4. Kontrollziel aus einer zentralen Weltkonfiguration statt aus `(0, 0, 0)` ableiten
5. Spawnprofile fuer Verkehrsaufkommen, Tageszeit und Schichtphase definieren
6. Pfadvisualisierung als einstellbare Debug-Funktion ausfuehren
7. weit entfernte Fahrzeuge seltener aktualisieren oder instanziert rendern

Diese Erweiterungen sollten auf den vorhandenen Routen und TrafficEntities aufbauen,
ohne einen zweiten Fahrzeug- oder NPC-Zustand einzufuehren.

## Zentrale Dateien

- `src/game/traffic/hooks/useAmbientTrafficSpawner.jsx`
- `src/game/traffic/hooks/useTrafficEntitySpawner.jsx`
- `src/game/vehicles/hooks/useVehicleAnimation.jsx`
- `src/game/world/components/TrafficRouteVisualizer.jsx`
- `src/game/world/paths/trafficRoutes.js`
- `src/game/world/spawn/getTrafficSpawnTransform.js`
