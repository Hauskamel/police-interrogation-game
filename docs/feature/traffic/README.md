# Traffic Feature

## Ziel

Der Verkehr soll die Spielwelt lebendiger machen, ohne direkt eine komplette Traffic-Engine zu werden. Die erste Ausbaustufe konzentriert sich auf eine stabile Fahrmechanik:

- Fahrzeuge spawnen automatisch im Spiel.
- Fahrzeuge fahren auf festen Fahrspuren in beide Richtungen.
- Die Bewegung laeuft entlang von Three.js-Pfaden statt ueber direkte Achsenverschiebung.
- Ein angehaltenes Fahrzeug kann ueber eine Kurve in die Kontrollbucht fahren.
- Spaetere Systeme wie Missionen, Schranke, Warteschlange oder gezielte Sonderfahrzeuge sollen daran andocken koennen.

## Schritt 1: Aktueller Stand

Umgesetzt wurde eine kleine Grundlage fuer dynamischen Verkehr:

- `src/game/world/paths/trafficRoutes.js`
  - definiert Fahrspuren als wiederverwendbare Routen
  - liefert normale Strassenrouten und die Einfahrt in die Kontrollbucht
- `src/game/vehicles/hooks/useVehicleAnimation.jsx`
  - bewegt Fahrzeuge zeitbasiert entlang von Routen
  - entfernt Fahrzeuge am Ende ihrer Route
  - fuehrt angehaltene Fahrzeuge in die Kontrollbucht
- `src/game/vehicles/utils/getVehicleSpawnPosition.js`
  - berechnet Spawnposition und Rotation aus der gewaehlten Route
- `src/game/spawner/hooks/useTrafficSpawner.jsx`
  - erzeugt automatisch Verkehr nach Spielstart
  - begrenzt die Anzahl gleichzeitig aktiver Fahrzeuge

## Schritt 2: Projektstruktur und Spawner-Domain

Der Traffic-Spawner soll nicht dauerhaft unter `vehicles/hooks` liegen. Fahrzeuge bleiben fuer Fahrzeugdaten, Fahrzeugprofile, Fahrzeuginteraktion und Fahrzeuganimation verantwortlich.

Spawner sind dagegen ein eigenes Gameplay-System. Deshalb soll die Struktur in Richtung einer eigenen Domain gehen:

```text
src/game/spawner/
+-- hooks/
|   +-- useTrafficSpawner.jsx
+-- index.js
```

Damit kann spaeter weitere Spawnlogik ergaenzt werden, ohne `vehicles` aufzublaehen:

- normaler Verkehr
- missionsbasierte Fahrzeuge
- gezielte NPC-/Wanted-Spawns
- Schranken-/Grenzposten-gesteuerte Spawnfenster

## Bekannter Rendering-Effekt

Beim ersten Spawnen neuer Fahrzeuge koennen Modelle kurz verschwinden, wenn ein bisher nicht geladenes GLB-Modell nachgeladen wird. In React Three Fiber passiert das ueber Suspense: ein ladendes Modell kann ohne lokale Grenze groessere Teile des Canvas kurz ausblenden.

Gegenmassnahmen:

- NPC-Fahrzeugmodelle vorab per `useGLTF.preload(...)` laden.
- Jedes NPC-Fahrzeug in eine eigene `Suspense`-Grenze legen, damit beim Laden nur dieses Fahrzeug fehlt und nicht die ganze Szene.

## Naechster sinnvoller Schritt

## Schritt 3: Farbige Pfad-Visualisierung

Als naechster kleiner Ausbauschritt wurden die Fahrpfade im Canvas sichtbar gemacht:

- `src/game/world/components/TrafficRouteVisualizer.jsx`
  - rendert alle festen Fahrspuren als dezente Grundlinien
  - rendert aktive Fahrzeugpfade zusaetzlich mit Statusfarbe
  - nutzt dieselben Three.js-Routen wie die Fahrzeuganimation
- `src/game/world/paths/trafficRoutes.js`
  - exportiert alle bekannten Traffic-Routen als wiederverwendbare Liste

Aktuelle Farben:

- Richtung `left`: gruen als Grundroute
- Richtung `right`: orange als Grundroute
- Status `driving`: blau
- Status `queued`: gelb, vorbereitet fuer die kommende Warteschlange
- Status `stopped`: rot
- Status `pullingOver`: violett fuer die Einfahrt in die Kontrollbucht

Da im aktuellen Fahrzeugmodell noch kein eigenes `status`-Feld existiert, leitet die Visualisierung den Status vorerst ab:

- `car.status`, falls spaeter vorhanden
- `pullingOver`, wenn `car.stopped === true`
- sonst `driving`

## Danach sinnvoller Schritt

Als naechstes sollte der Grenzposten als Stop-Punkt auf einer Route modelliert werden:

- Stop-Punkt pro Richtung oder Spur
- Zustand `driving`, `queued`, `stopped`, `pullingOver`
- einfache Warteschlange mit Abstand zum Fahrzeug davor
- Schranke oeffnet/schliesst und gibt jeweils ein Fahrzeug frei

Das bleibt klein, fuehrt aber genau in die Richtung, die spaeter fuer Missionen gebraucht wird.
