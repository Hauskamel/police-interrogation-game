# Pull-Request-Beschreibung

## Zusammenfassung

Dieser Pull Request überarbeitet den bisherigen NPC-/Fahrzeug-Spawnflow zu einem klareren `TrafficEntity`-System und führt ein `real` / `presented` Profilmodell für NPC- und Fahrzeugdaten ein.

Ziel ist ein Spielsystem im Stil von *Papers, Please*: Der Spieler soll Dokumente prüfen, sichtbare Informationen vergleichen, Widersprüche finden und versteckte Wahrheiten aufdecken. NPCs sollen nicht als Action-Game-Gegner funktionieren, sondern als kontrollierbare Personen mit echten und vorgezeigten Daten.

## Was wurde geändert?

### Neues TrafficEntity-System

Es wurde eine neue `game/traffic` Domain eingeführt:

- `generateTrafficEntity`
- `createTrafficEntity`
- `createCivilianTrafficEntity`
- `createKnownWantedTrafficEntity`
- `createUnknownOffenderTrafficEntity`
- Traffic Types
- Police Statuses
- gewichtete Traffic-Type-Auswahl
- `useTrafficEntitySpawner`

Eine `TrafficEntity` beschreibt jetzt eine aktive Weltinstanz:

```text
NPC + Fahrzeug + Spawnzustand + Polizeiwissen + Dokumentzustand + Prüfprofil
```

Jede TrafficEntity besitzt getrennte IDs:

- `npcId`
- `vehicleId`
- `trafficEntityId`

### `carStore` durch `trafficStore` ersetzt

Der alte `carStore` wurde entfernt und durch `trafficStore` ersetzt.

Vorher:

```text
cars
selectedCar
addCar
stopCar
removeCar
```

Nachher:

```text
trafficEntities
selectedTrafficEntity
addTrafficEntity
stopTrafficEntity
removeTrafficEntity
```

Damit ist klarer, dass der Store keine reinen Autos speichert, sondern aktive Verkehrsteilnehmer mit Fahrer, Fahrzeug, Polizeiwissen und Spawnzustand.

### `real` / `presented` Profilmodell eingeführt

NPC- und Fahrzeugprofile verwenden jetzt:

```js
{
  real: {},
  presented: {}
}
```

`real` beschreibt die interne Spielwahrheit.

`presented` beschreibt das, was der Spieler über Dokumente und UI sieht.

Im Basisprofil ist `presented` eine unveränderte Kopie von `real`.

Beim Traffic-Spawn kann jetzt ein `documentState` erzeugt werden. Daraus werden anschließend die sichtbaren `presented`-Daten abgeleitet. Wenn der `documentState` eine bewusste Dokumentmanipulation beschreibt, weicht `presented` gezielt von `real` ab.

### Dokumentzustand und bewusste Dokumentmanipulationen ergänzt

Neu hinzugefügt wurden:

```text
src/game/documents/data/documentIntegrityTypes.js
src/game/documents/data/forgeryTypes.js
src/game/documents/generators/createDocumentState.js
src/game/documents/generators/createNpcPresentedProfile.js
src/game/documents/generators/createVehiclePresentedProfile.js
src/game/documents/generators/createPresentedProfiles.js
src/game/documents/utils/pickForgeryType.js
```

Der neue `documentState` speichert je TrafficEntity:

- ob Dokumente manipuliert sind
- welches Dokument betroffen ist
- welche Felder abweichen
- wie der Spieler die Abweichung entdecken kann

Aktuell unterstützt:

- falsche Adresse im Führerschein
- falsches Geburtsdatum im Führerschein
- falsche Führerscheinnummer
- falscher Name
- abweichendes Kennzeichen im Fahrzeugschein
- falsche Registriernummer
- falsches Fahrzeugmodell

### Dokumente auf `presented` umgestellt

Die Dokument-Komponenten lesen jetzt aus sichtbaren/vorgezeigten Daten statt aus alten `realProfile` / `fakeProfile` Feldern:

- `DriversLicense`
- `CarDocuments`
- `ProofOfInsurance`
- `DocumentManager`

Dadurch wurde auch der Fehler behoben, bei dem `CarDocuments` auf ein nicht vorhandenes `realProfile` zugreifen konnte.

### Crime-Record-Erzeugung ausgelagert

Die Crime-Record-Erzeugung wurde in einen eigenen Generator verschoben:

```text
src/game/crimes/generators/crimeRecordGenerator.js
```

Dadurch kann `generateCrimeRecordsForNpc(npcId)` jetzt sowohl für die Criminal Database als auch für unbekannte Täter im Traffic-System verwendet werden.

### Spawn-Transform in die World-Domain verschoben

Die alte fahrzeugbezogene Spawnposition wurde entfernt und durch World-Spawn-Logik ersetzt:

```text
src/game/world/spawn/getTrafficSpawnTransform.js
```

Spawnrichtung, Spur, Position und Rotation gehören damit zur World-Domain und nicht mehr zu den Vehicle-Utils.

### Legacy-Dateien entfernt

Folgende alte Dateien wurden entfernt:

```text
src/stores/carStore.js
src/game/world/generators/randomNpcWithVehicleGenerator.js
src/game/world/generators/index.js
src/game/vehicles/utils/getVehicleSpawnPosition.js
src/game/world/hooks/useCarRefs.jsx
```

Ersetzt wurden sie durch:

```text
src/stores/trafficStore.js
src/game/traffic/generators/generateTrafficEntity.js
src/game/world/spawn/getTrafficSpawnTransform.js
src/game/world/hooks/useTrafficEntityRefs.jsx
```

### Dokumentation neu strukturiert

Die Dokumentation wurde in zwei Bereiche aufgeteilt:

```text
docs/game-systems/
docs/system-changes/
```

Neu bzw. aktualisiert:

- `docs/README.md`
- `docs/game-systems/npc-generation.md`
- `docs/system-changes/npc-generation-branch-changes.md`
- `docs/system-changes/domain-convention.md`
- `docs/system-changes/refactor-log.md`

## Hinweise

Das Kernsystem wurde von alten Konzepten bereinigt:

- `useCarStore`
- `realProfile`
- `fakeProfile`
- `randomNpcWithVehicleGenerator`
- `getVehicleSpawnPosition`

Ein bekannter verbleibender Altbereich ist der Polizeilaptop. Besonders `Database.jsx` und `DatabaseListElement.jsx` verwenden noch ältere Datenbank-/Crime-Vorstellungen und sollten in einem Folge-PR an die neue Criminal Database und Crime-Record-Struktur angebunden werden.

## Validierung

Geprüft mit:

```bash
npm run build
```

Der Build läuft erfolgreich durch.

Bekannte bestehende Warnungen:

- `three-stdlib/libs/lottie.js` nutzt `eval`
- Vite warnt vor großen Bundle-Chunks

Diese Warnungen blockieren den Build nicht.
