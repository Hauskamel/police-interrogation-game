# Systemänderungen: NPC Manipulated Identity Branch

Branch: `feature/npc-manipulated-identity`

Stand: 2026-07-27

Dieses Dokument beschreibt die technischen Änderungen auf dem Branch. Die spielerische Funktionsweise steht in [NPCs, Polizeiwissen und Verkehrskontrollen](../game-systems/npc-generation.md).

## Zusammenfassung

Der Branch ersetzt das alte gekoppelte NPC-/Fahrzeug-Spawnsystem durch ein TrafficEntity-System mit:

- getrennten NPC-, Fahrzeug- und TrafficEntity-IDs
- `real` und `presented` für Personen- und Fahrzeugprofile
- zentralem `documentState` für bewusste Dokumentmanipulationen
- getrennten Ebenen für Wahrheit und Polizeiwissen
- vier fachlich eindeutigen Traffic-Typen
- eigenständigen Fahndungsrecords
- konkreter Datenbank-NPC-Auswahl im Devtool
- getrennten Fahrer- und Fahrzeughalteridentitäten
- einheitlichen kurzen Entity-IDs
- synchronisiertem lil-gui und Debug-Panel
- separatem Polizei-Datenbank-Debugpanel

## TrafficEntity statt altem Car-Spawn

Der zentrale Einstiegspunkt ist:

```text
generateTrafficEntity(options)
```

Er delegiert an:

```text
createCivilianTrafficEntity
createUnknownOffenderTrafficEntity
createKnownOffenderTrafficEntity
createWantedOffenderTrafficEntity
```

Die fertige TrafficEntity enthält:

```js
{
  id,
  trafficEntityId,
  npcId,
  vehicleId,
  trafficType,
  driverProfile,
  vehicleOwnerProfile,
  vehicleProfile,
  ownership,
  truth,
  police,
  documentState,
  inspectionProfile,
  stopped
}
```

Das frühere `source`-Attribut wurde vollständig entfernt.

## Kurze Entity-IDs

Neue Shared-Utility:

```text
src/game/shared/utils/createEntityId.js
```

Vorher:

```text
npc--5e77eb57-1efe-4e64-b157-c425730052f9
```

Nachher:

```text
npc--5e77eb571e
```

Der Generator:

- verwendet zehn Hex-Zeichen
- behält den fachlichen Präfix
- prüft bereits vergebene IDs innerhalb der Session
- wird von NPCs, Fahrzeugen, TrafficEntities, Crime Records, Wanted Records, Dokumentrecords und dem Polizeifahrzeug genutzt

Das Feld `npcUuid` wurde passend zur neuen ID-Strategie vollständig zu `npcId` umbenannt.

## Neue Traffic-Typen

Vorher:

```text
civilian
unknownOffender
knownWanted
```

Nachher:

```text
civilian
unknownOffender
knownOffender
wantedOffender
```

`knownWanted` wurde entfernt, weil es zwei unterschiedliche Polizeizustände vermischt hat.

### `knownOffender`

- NPC kommt aus `criminalDatabase.npcsById`.
- NPC-ID steht in `knownOffenderNpcIds`.
- `police.status` ist `known`.
- `police.wantedRecordId` ist `null`.

### `wantedOffender`

- NPC kommt aus `criminalDatabase.npcsById`.
- NPC besitzt einen aktiven Wanted Record.
- `police.status` ist `wanted`.
- `police.wantedRecordId` enthält eine echte `wanted--...`-ID.

## Criminal Database

Vorher:

```js
{
  npcsById,
  crimeRecordsById,
  documentsById,
  criminalNpcIds,
  wantedList: ["npc--..."]
}
```

Nachher:

```js
{
  npcsById,
  crimeRecordsById,
  documentsById,
  wantedRecordsById,
  criminalNpcIds,
  knownOffenderNpcIds,
  wantedRecordIds
}
```

### Wanted Records

Neue Datei:

```text
src/game/crimes/data/wantedRecordStatuses.js
```

Neue Datenform:

```js
{
  id: "wanted--...",
  npcId: "npc--...",
  status: "active",
  reasonCrimeRecordIds: ["crime--..."],
  issuedAt: "YYYY-MM-DD",
  priorityLevel: 1
}
```

Unterstützte Status:

```text
active
revoked
expired
resolved
```

Nur aktive Records werden durch `getActiveWantedRecords` als Spawn-Kandidaten aufgelöst.

## Datenbank-Kandidaten

Neue Datei:

```text
src/game/traffic/utils/getDatabaseNpcCandidates.js
```

Sie stellt bereit:

```js
getActiveWantedRecords(criminalDatabase)
getKnownOffenderNpcIds(criminalDatabase)
pickDatabaseNpcId(candidateNpcIds, forcedDatabaseNpcId)
```

Eine erzwungene NPC-ID wird nur akzeptiert, wenn sie zur gewählten Kategorie gehört.

Dadurch kann:

- kein gesuchter NPC als nur bekannt erzeugt werden
- kein nicht gesuchter NPC als aktiv gesucht erzeugt werden
- kein zufälliger Fallback nachträglich falsch umetikettiert werden

## Konkrete NPC-Auswahl im lil-gui

`useLilGuiSetup.jsx` besitzt jetzt das Control:

```text
Datenbank-NPC
```

Optionen:

```text
Zufälliger passender NPC
Vorname Nachname (ID-Ende)
```

Das Dropdown wird dynamisch aktualisiert:

| Traffic-Typ | Dropdown-Inhalt |
|---|---|
| `civilian` | deaktiviert |
| `unknownOffender` | deaktiviert |
| `knownOffender` | bekannte, nicht gesuchte NPCs |
| `wantedOffender` | NPCs mit aktivem Wanted Record |

`forcedDatabaseNpcId` wird an `generateTrafficEntity` weitergegeben.

Beim Wechsel des Traffic-Typs wird eine vollständige neue fachliche Konstellation erzeugt. Die vorhandene Weltinstanz behält:

```text
id
trafficEntityId
spawn
position
stopped
```

## Fahrzeughalter

Neue Datei:

```text
src/game/traffic/generators/createVehicleOwnership.js
```

Neue TrafficEntity-Felder:

```js
vehicleOwnerProfile

ownership: {
  registeredOwnerNpcId,
  driverIsRegisteredOwner
}
```

`generateVehicleProfile` akzeptiert jetzt:

```js
generateVehicleProfile({
  registeredOwnerNpcId
})
```

Das Vehicle-Profil speichert die Referenz in `real` und `presented`.

Der Haltergenerator erzeugt:

- mit Gewichtung Fahrer gleich Halter
- oder eine separate vollwertige NPC-Identität als Halter
- optional einen erzwungenen Zustand über `forcedDriverIsRegisteredOwner`

### Fahrzeugschein

`CarDocuments.jsx` liest Halterdaten jetzt aus:

```js
selectedTrafficEntity.vehicleOwnerProfile.presented
```

Vorher wurden fälschlich immer die Fahrerdaten als Halter angezeigt.

Der Fahrzeugschein zeigt jetzt:

- Haltervorname
- Halternachname
- Halteradresse
- Fahrzeug- und Registrierungsdaten

## `real`, `presented` und Dokumentmanipulation

Die alten Begriffe `realProfile`, `fakeProfile` und Legacy-Fallbacks wurden durch folgende Struktur ersetzt:

```js
{
  real,
  presented
}
```

Neue Dokumentgeneratoren:

```text
createDocumentState
createNpcPresentedProfile
createVehiclePresentedProfile
createPresentedProfiles
```

Unterstützte NPC-Manipulationen:

```text
wrong_address
wrong_birth_date
wrong_license_number
wrong_name
```

Unterstützte Fahrzeugmanipulationen:

```text
plate_mismatch
wrong_registration_number
wrong_vehicle_model
```

`real` bleibt unverändert. Nur `presented` wird anhand des `documentState` neu erzeugt.

## Devtool-Synchronisation

`trafficStore` besitzt die neue atomare Aktion:

```js
updateTrafficEntity(trafficEntityId, updater)
```

Sie aktualisiert gleichzeitig:

- den Eintrag in `trafficEntities`
- `selectedTrafficEntity`, falls dieselbe ID ausgewählt ist

Dadurch reagieren Debug-Panel und Dokumente sofort auf lil-gui-Änderungen.

Synchronisierte Controls:

- NPC-Status
- konkreter Datenbank-NPC
- Polizeibekanntheit
- Dokumentfälschung
- Complexity Level
- Deception Risk
- mehrere Focus Areas

Explizite Aktionen:

```text
Auf angehaltenen NPC anwenden
Spawn NPC an Station
```

Der Apply-Button ist nur aktiv, wenn `selectedTrafficEntity.stopped === true`. Er verwendet den vollständigen Generatorpfad mit den aktuell eingestellten Controls und erhält anschließend Welt-ID, Position, Spawnzustand und Stop-Zustand der vorhandenen TrafficEntity.

`stopTrafficEntity` und `continueTrafficEntity` aktualisieren deshalb jetzt auch `selectedTrafficEntity`. Dadurch sehen lil-gui und Debug-Panel immer denselben Stop-Zustand.

Änderungen an Focus Areas leiten Complexity und Deception Risk über `inspectionProfileControls.js` neu ab.

## Debug-Panels

### Fahrer- und Fahrzeugprofil

Reiter:

```text
Übersicht
Dokumente
Profile
Rohdaten
```

Zusätzlich sichtbar:

- Fahrzeughalter-ID
- Fahrer-ist-Halter
- Halterprofil real/presented
- echte Wanted-Record-ID
- Abweichungen zwischen real und presented

### Polizei-Datenbank

Separater Button:

```text
Polizei-Datenbank
```

Reiter:

```text
Übersicht
Fahndungsliste
NPCs
Straftaten
Dokumente
```

Die Fahndungsliste zeigt Wanted Record und zugehörigen NPC gemeinsam und markiert fehlende Referenzen.

## Entfernte oder ersetzte Strukturen

Entfernt oder abgelöst:

```text
randomNpcWithVehicleGenerator
carStore
realProfile
fakeProfile
knownWanted
wantedList
createKnownWantedTrafficEntity
source
```

Ersetzt durch:

```text
generateTrafficEntity
trafficStore
real
presented
knownOffender
wantedOffender
wantedRecordsById + wantedRecordIds
createKnownOffenderTrafficEntity
createWantedOffenderTrafficEntity
```

## Wichtige neue und geänderte Dateien

```text
src/game/crimes/data/wantedRecordStatuses.js
src/game/crimes/generators/criminalDatabaseGenerator.js
src/game/shared/utils/createEntityId.js
src/game/traffic/data/trafficEntityTypes.js
src/game/traffic/generators/createKnownOffenderTrafficEntity.js
src/game/traffic/generators/createWantedOffenderTrafficEntity.js
src/game/traffic/generators/createVehicleOwnership.js
src/game/traffic/utils/getDatabaseNpcCandidates.js
src/game/vehicles/generators/vehicleProfileGenerator.js
src/game/documents/components/CarDocuments.jsx
src/devtools/useLilGuiSetup.jsx
src/devtools/inspectionProfileControls.js
src/devtools/panels/VehicleDebugPanel.jsx
src/devtools/panels/PoliceDatabaseDebugPanelContent.jsx
src/stores/npcStore.js
src/stores/trafficStore.js
```

## Validierung

Geprüft wurden:

```text
npm run build
gezielter ESLint-Lauf für geänderte Dateien
Generator-Invariantentest über Vite SSR
```

Bestätigte Invarianten:

```text
knownOffender:
  npcId === police.databaseNpcId
  police.status === "known"
  police.wantedRecordId === null

wantedOffender:
  npcId === police.databaseNpcId
  wantedRecordsById[police.wantedRecordId].npcId === npcId
  police.status === "wanted"

ownership:
  vehicleProfile.real.registeredOwnerNpcId
    === ownership.registeredOwnerNpcId
  driverIsRegisteredOwner kann true oder false sein
```

Bekannte Build-Warnungen:

- `three-stdlib/libs/lottie.js` verwendet `eval`.
- Das Hauptbundle überschreitet Vites Chunk-Warnschwelle.

Diese Warnungen stammen nicht aus dieser Änderung und blockieren den Build nicht.
