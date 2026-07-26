# System Changes: NPC Generation Branch

Branch: `feature/npc-generation`

Stand: 2026-07-26

Dieses Dokument beschreibt die technischen Änderungen auf diesem Branch. Es ist bewusst von der Feature-Beschreibung getrennt. Die spielerische Idee hinter dem System steht in [NPC-Generierung](../game-systems/npc-generation.md).

## Kurzfassung

Auf diesem Branch wurde das alte NPC-/Fahrzeug-Spawnsystem in ein neues TrafficEntity-System überführt.

Vorher:

```text
randomNpcWithVehicleGenerator
  -> generateNpcProfile
  -> generateVehicleProfile
  -> gemeinsames id-Feld

carStore
  -> cars
  -> selectedCar
  -> addCar / stopCar / removeCar
```

Nachher:

```text
generateTrafficEntity
  -> entscheidet Traffic-Typ
  -> erzeugt/holt NPC
  -> erzeugt Fahrzeug
  -> ergänzt truth, police und inspectionProfile
  -> createTrafficEntity

trafficStore
  -> trafficEntities
  -> selectedTrafficEntity
  -> addTrafficEntity / stopTrafficEntity / removeTrafficEntity
```

## Neue Domains und Dateien

### `src/game/traffic`

Neu hinzugefügt:

```text
src/game/traffic/
├── data/
│   ├── policeStatuses.js
│   └── trafficEntityTypes.js
├── generators/
│   ├── createCivilianTrafficEntity.js
│   ├── createKnownWantedTrafficEntity.js
│   ├── createTrafficEntity.js
│   ├── createUnknownOffenderTrafficEntity.js
│   └── generateTrafficEntity.js
├── hooks/
│   └── useTrafficEntitySpawner.jsx
├── utils/
│   ├── pickTrafficEntityType.js
│   └── pickWeightedItem.js
└── index.js
```

Verantwortung:

- aktive NPC-/Fahrzeug-Kombinationen erzeugen
- Traffic-Typen unterscheiden
- Polizeiwissen und Wahrheit voneinander trennen
- Spawn-Hook für TrafficEntities bereitstellen

### `src/stores/trafficStore.js`

Neu hinzugefügt.

Ersetzt den alten `carStore`.

Der Store hält:

```js
playerPoliceVehicle
trafficEntities
selectedTrafficEntity
```

Aktionen:

```js
setPlayerPoliceVehicle(vehicle)
addTrafficEntity(trafficEntity)
removeTrafficEntity(trafficEntityId)
stopTrafficEntity(trafficEntityId)
continueTrafficEntity(trafficEntityId)
setSelectedTrafficEntity(trafficEntity)
setTrafficEntityPosition(trafficEntityId, y, z)
```

### `src/game/world/spawn`

Neu hinzugefügt:

```text
src/game/world/spawn/getTrafficSpawnTransform.js
```

Diese Datei ersetzt die alte Vehicle-Spawnposition.

Warum?

Spawnposition, Richtung, Spur und Rotation sind Weltlogik. Sie gehören nicht in die Vehicle-Domain.

### `src/game/crimes/generators/crimeRecordGenerator.js`

Neu hinzugefügt.

Die Crime-Record-Erzeugung wurde aus `criminalDatabaseGenerator.js` ausgelagert.

Dadurch kann `generateCrimeRecordsForNpc(npcId)` jetzt mehrfach genutzt werden:

- beim Aufbau der Criminal Database
- bei unbekannten Tätern im Traffic-System
- später bei Cases, Events oder Story-Fällen

## Geänderte Datenmodelle

### NPC-Profil

Vorher:

```js
{
  realProfile,
  fakeProfile
}
```

Nachher:

```js
{
  real,
  presented
}
```

`real` ist die interne Spielwahrheit.

`presented` ist das, was Dokumente und UI anzeigen.

Aktuell ist `presented` identisch mit `real`. In `npcProfileGenerator.js` steht ein TODO für die spätere Fake-Dokument-Generierung.

### Vehicle-Profil

Vorher:

```js
{
  realProfile,
  fakeProfile
}
```

Nachher:

```js
{
  real,
  presented
}
```

Auch hier ist `presented` aktuell identisch mit `real`.

## Dokumente

Die Dokument-Komponenten lesen jetzt aus `presented`.

Geändert:

```text
src/game/documents/components/DriversLicense.jsx
src/game/documents/components/CarDocuments.jsx
src/game/documents/components/ProofOfInsurance.jsx
src/game/documents/manager/DocumentManager.jsx
```

Vorher lasen Dokumente aus:

```js
driver.realProfile
driver.fakeProfile
car.realProfile
car.fakeProfile
```

Nachher:

```js
driver.presented
vehicle.presented
```

Dadurch wurde auch der Fehler behoben, bei dem `CarDocuments` auf ein nicht vorhandenes `realProfile` zugreifen konnte.

## Geänderte UI- und Gameplay-Dateien

Folgende Dateien wurden auf Traffic-Begriffe umgestellt:

```text
src/app/App.jsx
src/devtools/useLilGuiSetup.jsx
src/devtools/panels/VehicleDebugPanel.jsx
src/game/panels/components/VehicleControlPanel.jsx
src/game/panels/components/PoliceCarControlPanel.jsx
src/game/panels/components/VehicleOccupantsPanel.jsx
src/game/world/components/Gamecanvas.jsx
src/game/world/components/PoliceCar.jsx
src/game/vehicles/hooks/useVehicleInteraction.jsx
```

Beispiele:

```text
selectedCar -> selectedTrafficEntity
playersPoliceCar -> playerPoliceVehicle
cars -> trafficEntities
addCar -> addTrafficEntity
stopCar -> stopTrafficEntity
```

## Vehicle Animation

`useVehicleAnimation.jsx` wurde bereinigt:

- Store-Zugriffe gehen über `useTrafficStore`
- Positionsupdates nutzen `setTrafficEntityPosition`
- Despawn nutzt `removeTrafficEntity`
- Geradeausbewegung wurde in `moveTrafficEntityStraight` ausgelagert
- Despawn-Prüfung wurde in `hasTrafficEntityLeftWorld` ausgelagert

Außerdem wurde ein Despawn-Fehler korrigiert:

```text
links fahrende Fahrzeuge despawnen links
rechts fahrende Fahrzeuge despawnen rechts
```

## Entfernte Legacy-Dateien

Entfernt:

```text
src/stores/carStore.js
src/game/world/generators/randomNpcWithVehicleGenerator.js
src/game/world/generators/index.js
src/game/vehicles/utils/getVehicleSpawnPosition.js
src/game/world/hooks/useCarRefs.jsx
```

Ersetzt durch:

```text
src/stores/trafficStore.js
src/game/traffic/generators/generateTrafficEntity.js
src/game/world/spawn/getTrafficSpawnTransform.js
src/game/world/hooks/useTrafficEntityRefs.jsx
```

## Public Exports

`src/game/index.js` exportiert jetzt auch:

```js
export * from "./traffic";
```

`src/stores/index.js` exportiert jetzt:

```js
export { useTrafficStore } from "./trafficStore.js";
```

Der alte `useCarStore` Export wurde entfernt.

## Validierung

Geprüft mit:

```bash
npm run build
```

Der Build läuft erfolgreich durch.

Bekannte Warnungen:

- `three-stdlib/libs/lottie.js` nutzt `eval`
- Vite warnt wegen großer Bundle-Chunks

Diese Warnungen blockieren den Build nicht und stammen nicht aus dem neuen NPC-/Traffic-System.

## Offene technische Folgearbeiten

1. Fake-/Presented-Generierung implementieren
2. Dokument-Records stärker aus den Profil-Snapshots herauslösen
3. Polizeilaptop sauber an Criminal Database und Wanted List anbinden
4. InspectionProfile-Erzeugung weiter vereinheitlichen
5. Optional `Car.jsx` als Render-Komponente behalten, aber Props intern in Richtung `trafficEntity` umbenennen

