# Systemänderungen: NPC Manipulated Identity Branch

Branch: `feature/npc-manipulated-identity`

Stand: 2026-07-29

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
  criminalNpcIds,
  wantedList: ["npc--..."]
}
```

Nachher:

```js
{
  npcsById,
  crimeRecordsById,
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
updateTrafficEntity(entityId, updater)
```

Sie aktualisiert gleichzeitig:

- den kanonischen Eintrag in `trafficEntities`

Der Store speichert nur noch:

```text
selectedVehicleId
```

`selectSelectedTrafficEntity` und `selectSelectedVehicle` lösen daraus reaktiv
das aktuelle Objekt auf. Dadurch existiert keine zweite Objektkopie mehr, die
bei Updates parallel gepflegt werden müsste.

Ein zusätzliches `trafficEntityId`-Feld wird nicht mehr gespeichert.

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

Der Apply-Button ist nur aktiv, wenn die über `selectedVehicleId` aufgelöste
TrafficEntity angehalten wurde. Er verwendet den vollständigen Generatorpfad
mit den aktuell eingestellten Controls und erhält anschließend Welt-ID,
Position, Spawnzustand und Stop-Zustand der vorhandenen TrafficEntity.

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

## Refactor und Legacy-Bereinigung vom 29.07.2026

Die drei identischen Implementierungen für gewichtete Zufallsauswahl wurden durch
einen gemeinsamen Helper ersetzt:

```text
src/game/shared/utils/pickWeightedItem.js
```

Er wird jetzt von Traffic-, Crime- und Dokumentgeneratoren verwendet. Die
jeweiligen Gewichtstabellen bleiben weiterhin in ihrer fachlichen Domain.

Entfernt wurden ausschließlich die bestätigten ungenutzten Altbestände:

```text
src/game/npcs/data/hairColors.js
src/game/npcs/data/eyeColors.js
src/game/vehicles/data/carBrands.json
src/game/police/components/police-laptop/screen-components/database-screen/
```

Der alte Laptop-Datenbank-Prototyp inklusive `DatabaseListElement`,
`DatabaseScreen`, `Database` und `Searchbar` wurde vollständig entfernt. Der
Laptop erhält später auf einem eigenen Branch eine neue Datenbankoberfläche.

Außerdem wurden folgende doppelt gespeicherten Zustände beseitigt:

- Eine TrafficEntity besitzt nur noch `id`, nicht zusätzlich dieselbe `trafficEntityId`.
- Polizeibekanntheit wird aus `police.status` abgeleitet.
- Fahndungspriorität liegt nur in `wantedRecord.priorityLevel`.
- NPC-ID-Indizes werden nur in `criminalDatabase` gespeichert und nicht parallel im Store gespiegelt.

Die Ausstellung eines Fahrzeugscheins beginnt nun frühestens im Baujahr des
konkreten Fahrzeugs. Die alte feste Zeitspanne von 1950 bis 1971 wurde entfernt.

## Relationale Weltwahrheit und Traffic-Orchestrierung

Unbekannte Täter speicherten ihre vollständigen Straftaten zuvor eingebettet als
`truth.hiddenCrimeRecords`. Die gleichzeitig erzeugten `crimeRecordIds` konnten
außerhalb der TrafficEntity nicht relational aufgelöst werden.

Neu ist:

```text
src/stores/worldTruthStore.js
```

Der Store besitzt getrennte Tabellen:

```js
worldTruthDatabase: {
  npcsById: {},
  crimeRecordsById: {}
}
```

Beim Hinzufügen oder Ersetzen einer TrafficEntity werden temporär mitgelieferte
World-Truth-Records in diese Tabellen übertragen. Danach wird das Record-Paket
entfernt. In `truth` verbleiben ausschließlich `crimeRecordIds`.

Der interne NPC-Datensatz enthält ebenfalls seine `crimeRecordIds`; jeder
Crime Record besitzt umgekehrt die passende `npcId`.

Diese Datenbank ist ausdrücklich nicht die Polizei-Datenbank:

- `worldTruthDatabase` enthält die vollständige interne Spielwahrheit.
- `criminalDatabase` enthält nur das Wissen, das der Polizei zugänglich ist.
- Ein unbekannter Täter wird durch die interne Registrierung nicht automatisch
  polizeibekannt.

Die vier Traffic-Factories wiederholten zuvor dieselben Schritte für Halter,
Fahrzeug, Dokumentzustand und presented-Profile. Diese Orchestrierung liegt nun
zentral in:

```text
src/game/traffic/generators/assembleTrafficEntity.js
```

Die Factories bestimmen nur noch ihre fachlichen Unterschiede:

```text
Fahrerquelle
truth
police
inspectionProfile
optionale World-Truth-Records
```

`assembleTrafficEntity` übernimmt:

```text
Fahrzeughalter
Fahrzeugprofil
Dokumentzustand
real/presented-Aufbau
Traffic- und Fahrzeug-ID
fertige TrafficEntity
```

## Benennungsbereinigung

Folgende Namen wurden vollständig ersetzt:

| Alt | Neu |
|---|---|
| `spawnRandomNpcWithVehicle` | `spawnConfiguredTrafficEntityAtStation` |
| `vehicleMasterData` | `generateVehicleRegistrationData` |
| `generatePhysicalNpcCharacteristicsGenerator` | `generateNpcAppearance` |
| `npcPhotoGenerator` | `selectNpcPhoto` |
| `createTrafficEntity` | `assembleTrafficEntity` |
| `generateCarDocumentData` | `generateVehicleRegistrationDocument` |

Der ungültige Export `export * from "./utils"` wurde aus
`src/game/crimes/index.js` entfernt, weil in dieser Domain kein entsprechender
Ordner existiert.

## Konsistenzkorrekturen

- Polizei-NPCs werden als kanonische Records ohne `presented` gespeichert.
- Known- und Wanted-Spawns erzeugen `real` und `presented` erst für die Kontrolle.
- Unbekannte Straftaten erhalten den internen Status `undiscovered`.
- Devtool-Fallbacks registrieren World-Truth-Records erst nach erfolgreicher Typprüfung.
- Die Fahrzeugauswahl speichert nur noch `selectedVehicleId`.
- Baujahrbereiche werden als inklusive Spannen ausgewürfelt.
- `wrong_name` manipuliert passend zu `affectedFields` Vor- und Nachname.
- Die NPC-Generierung erzeugt aktuell ausschließlich männliche Personen.
- Führerscheindaten liegen nur noch in `npc.driversLicense`; die doppelte
  `documentsById`-Tabelle und `documentIds` wurden entfernt.
- Der Traffic-Store verhindert auf Aktionsebene mehr als eine angehaltene Entity.
- World-Truth-Records werden vor dem Traffic-Insert ausdrücklich registriert;
  `addTrafficEntity` besitzt keinen versteckten Cross-Store-Effekt mehr.

## Wichtige neue und geänderte Dateien

```text
src/game/crimes/data/wantedRecordStatuses.js
src/game/crimes/generators/criminalDatabaseGenerator.js
src/game/shared/utils/createEntityId.js
src/game/shared/utils/pickWeightedItem.js
src/game/npcs/generators/generateNpcAppearance.js
src/game/npcs/generators/selectNpcPhoto.js
src/game/vehicles/generators/generateVehicleRegistrationData.js
src/game/documents/generators/generateVehicleRegistrationDocument.js
src/game/traffic/data/trafficEntityTypes.js
src/game/traffic/generators/assembleTrafficEntity.js
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
src/stores/worldTruthStore.js
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

police database:
  npcsById enthält keine real/presented-Wrapper

unknown offender:
  alle versteckten Crime Records besitzen status === "undiscovered"

selection:
  selectedVehicleId wird über Selektoren zum aktuellen Objekt aufgelöst
```

Bekannte Build-Warnungen:

- `three-stdlib/libs/lottie.js` verwendet `eval`.
- Das Hauptbundle überschreitet Vites Chunk-Warnschwelle.

Diese Warnungen stammen nicht aus dieser Änderung und blockieren den Build nicht.
