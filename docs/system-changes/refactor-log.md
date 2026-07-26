# Refactor Log

## 2026-07-07 - Etappe 1: Dokumente als Game-Domain

### Was wurde geändert?

Die Dokument-Dateien wurden aus allgemeinen UI- und Utility-Ordnern in eine eigene Game-Domain verschoben.

Vorher:

```text
src/components/driverDocuments
src/utils/generators/documents
```

Nachher:

```text
src/game/documents/components
src/game/documents/generators
```

### Warum?

Dokumente sind in diesem Spiel nicht nur UI. Sie sind Teil der Spielmechanik:

- Der Spieler kontrolliert Dokumentdaten.
- Dokumente können später echt oder gefälscht sein.
- Dokument-Records werden separat in der fake database gespeichert.
- Dokumente hängen fachlich an NPCs und Fahrzeugen.

Deshalb ist `src/game/documents` als eigener Bereich klarer als eine Verteilung auf `components` und `utils`.

### Konkrete Dateiänderungen

```text
src/components/driverDocuments/DriversLicense.jsx
-> src/game/documents/components/DriversLicense.jsx

src/components/driverDocuments/CarDocuments.jsx
-> src/game/documents/components/CarDocuments.jsx

src/components/driverDocuments/ProofOfInsurcance.jsx
-> src/game/documents/components/ProofOfInsurance.jsx

src/utils/generators/documents/generateDriversLicenseData.js
-> src/game/documents/generators/generateDriversLicenseData.js

src/utils/generators/documents/generateCarDocumentData.js
-> src/game/documents/generators/generateCarDocumentData.js
```

### Nebenbei bereinigt

- Der Tippfehler `ProofOfInsurcance` wurde zu `ProofOfInsurance` korrigiert.
- Der ungenutzte `useState`-Import in `CarDocuments.jsx` wurde entfernt.
- Die alten, jetzt leeren Ordner wurden gelöscht.

### Noch nicht geändert

Diese Etappe verschiebt bewusst nur Dokumente. NPCs, Vehicles, Crimes und Base Components bleiben erstmal an ihren bisherigen Orten.

Nächste sinnvolle Etappen:

1. Optional später Import-Aliase einführen, damit lange relative Pfade kürzer werden.

## 2026-07-07 - Etappe 2: NPC-Generatoren als Game-Domain

### Was wurde geändert?

Die NPC-Generatoren wurden aus dem allgemeinen Utility-Bereich in eine eigene NPC-Domain verschoben.

Vorher:

```text
src/utils/generators/npc
```

Nachher:

```text
src/game/npcs/generators
```

### Warum?

NPCs sind ein Kernsystem des Spiels. Ihre Erzeugung besteht nicht nur aus technischen Hilfsfunktionen, sondern beschreibt echte Spielobjekte:

- Stammdaten
- biometrische Merkmale
- Alter und Geburtsdatum
- Fotoauswahl
- Realprofile für spätere Datenbank- und Dokumentlogik

Deshalb ist `src/game/npcs/generators` fachlich klarer als `src/utils/generators/npc`.

### Konkrete Dateiänderungen

```text
src/utils/generators/npc/npcProfileGenerator.js
-> src/game/npcs/generators/npcProfileGenerator.js

src/utils/generators/npc/npcMasterDataGenerator.js
-> src/game/npcs/generators/npcMasterDataGenerator.js

src/utils/generators/npc/physicalNpcCharacteristicsGenerator.js
-> src/game/npcs/generators/physicalNpcCharacteristicsGenerator.js

src/utils/generators/npc/npcPhotoGenerator.js
-> src/game/npcs/generators/npcPhotoGenerator.js

src/utils/generators/npc/generateBirthDate.js
-> src/game/npcs/generators/generateBirthDate.js
```

### Nebenbei bereinigt

- Interne NPC-Imports wurden von `../npc/...` auf klare `./...`-Imports geändert.
- Ein Debug-`console.log(minimumAge)` wurde aus `npcProfileGenerator.js` entfernt.
- Der alte, jetzt leere Ordner `src/utils/generators/npc` wurde gelöscht.

Nächste sinnvolle Etappen:

1. Optional später Import-Aliase einführen, damit lange relative Pfade kürzer werden.

## 2026-07-07 - Etappe 3: Vehicle-Generatoren als Game-Domain

### Was wurde geändert?

Die Vehicle-Generatoren wurden aus dem allgemeinen Utility-Bereich in eine eigene Vehicle-Domain verschoben.

Vorher:

```text
src/utils/generators/vehicle
```

Nachher:

```text
src/game/vehicles/generators
```

### Warum?

Fahrzeuge sind wie NPCs ein eigenes Spielsystem. Ihre Profile bestehen aus mehr als Hilfsdaten:

- Fahrzeug-Stammdaten
- Kennzeichen
- Registriernummer
- Fahrzeugdokumentdaten
- später potenziell Fakeprofile oder manipulierte Dokumente

Deshalb ist `src/game/vehicles/generators` fachlich klarer als `src/utils/generators/vehicle`.

### Konkrete Dateiänderungen

```text
src/utils/generators/vehicle/vehicleProfileGenerator.js
-> src/game/vehicles/generators/vehicleProfileGenerator.js

src/utils/generators/vehicle/vehicleMasterDataGenerator.js
-> src/game/vehicles/generators/vehicleMasterDataGenerator.js
```

### Nebenbei bereinigt

- Der Import in `randomNpcWithVehicleGenerator.js` zeigt jetzt auf die neue Vehicle-Domain.
- Ein Debug-`console.log(profile)` wurde aus `randomNpcWithVehicleGenerator.js` entfernt.
- Der alte, jetzt leere Ordner `src/utils/generators/vehicle` wurde gelöscht.

Nächste sinnvolle Etappen:

1. Optional später Import-Aliase einführen, damit lange relative Pfade kürzer werden.

## 2026-07-07 - Etappe 4: Crime-Domain

### Was wurde geändert?

Die Crime-Daten und der Criminal-Database-Generator wurden in eine eigene Crime-Domain verschoben.

Vorher:

```text
src/data/crimeTypes.js
src/utils/generators/criminalDatabaseGenerator.js
```

Nachher:

```text
src/game/crimes/data/crimeTypes.js
src/game/crimes/generators/criminalDatabaseGenerator.js
```

### Warum?

Crime-Records sind ein eigenes Spielsystem. Sie hängen zwar an NPCs, sind aber nicht Teil des NPC-Profils selbst:

- Ein NPC kann 0-x Crime-Records haben.
- Records werden per `npcId` verknüpft.
- Wanted List und Laptop-Datenbank bauen später auf diesen Records auf.
- Crime-Verteilung und Crime-Metadaten gehören fachlich zusammen.

Deshalb ist `src/game/crimes` klarer als eine Mischung aus `src/data` und `src/utils/generators`.

### Konkrete Dateiänderungen

```text
src/data/crimeTypes.js
-> src/game/crimes/data/crimeTypes.js

src/utils/generators/criminalDatabaseGenerator.js
-> src/game/crimes/generators/criminalDatabaseGenerator.js
```

### Nebenbei angepasst

- `Startmenu.jsx` importiert den Criminal-Database-Generator jetzt aus der Crime-Domain.
- `getCrimeType.js` importiert `crimeTypes` jetzt aus der Crime-Domain.
- Der Criminal-Database-Generator importiert NPC-Generatoren jetzt direkt aus `src/game/npcs`.

Nächste sinnvolle Etappen:

1. Kleine Getter bereinigen und fachlich einsortieren.
2. Optional später Import-Aliase einführen, damit lange relative Pfade kürzer werden.

## 2026-07-07 - Etappe 5: Domain-Getter und Export-Dateien

### Was wurde geändert?

Die alten Getter aus `src/utils/getter` wurden fachlich in die passenden Game-Domains verschoben.

Vorher:

```text
src/utils/getter
```

Nachher:

```text
src/game/crimes/utils
src/game/npcs/utils
src/game/vehicles/utils
```

### Warum?

Die Getter waren keine allgemeinen Utilities mehr. Sie greifen auf konkrete Game-Daten zu:

- NPC-Getter nutzen NPC-Daten wie Namen, Alter und Bild-Altersgruppen.
- Vehicle-Getter nutzen Fahrzeugdaten und Spawnlogik.
- Crime-Getter nutzt Crime-Daten.

Dadurch gehören sie fachlich näher an die jeweilige Domain.

### Konkrete Dateiänderungen

```text
src/utils/getter/getCrimeType.js
-> src/game/crimes/utils/getCrimeType.js

src/utils/getter/getNpcAge.js
-> src/game/npcs/utils/getNpcAge.js

src/utils/getter/getNpcAgeRange.js
-> src/game/npcs/utils/getNpcAgeRange.js

src/utils/getter/getRandomFirstName.js
-> src/game/npcs/utils/getRandomFirstName.js

src/utils/getter/getRandomCarProfile.js
-> src/game/vehicles/utils/getRandomCarProfile.js

src/utils/getter/getVehicleGlb.js
-> src/game/vehicles/utils/getVehicleGlb.js

src/utils/getter/getVehicleSpawnPosition.js
-> src/game/vehicles/utils/getVehicleSpawnPosition.js
```

### Export-Dateien

Für die neuen Game-Domains wurden zentrale `index.js`-Dateien angelegt. Dadurch können mehrere exportierbare Funktionen pro Bereich über einen gemeinsamen Einstiegspunkt importiert werden.

Beispiele:

```js
import { generateNpcProfile } from "../../game/npcs/generators";
import { getVehicleGlb } from "../game/vehicles/utils";
import { CarDocuments, DriversLicense, ProofOfInsurance } from "../../game/documents/components";
```

Neue Export-Dateien:

```text
src/game/index.js
src/game/crimes/index.js
src/game/crimes/data/index.js
src/game/crimes/generators/index.js
src/game/crimes/utils/index.js
src/game/documents/index.js
src/game/documents/components/index.js
src/game/documents/generators/index.js
src/game/npcs/index.js
src/game/npcs/generators/index.js
src/game/npcs/utils/index.js
src/game/vehicles/index.js
src/game/vehicles/generators/index.js
src/game/vehicles/utils/index.js
```

### Mehrfach-Export bereinigt

`npcProfileGenerator.js` hatte zwei fachlich unterschiedliche Exports:

- `generateNpcProfile`
- `generateNpcDriversLicenseDocument`

Der Dokument-Record-Generator wurde in eine eigene Datei verschoben:

```text
src/game/npcs/generators/npcDriversLicenseDocumentGenerator.js
```

`npcProfileGenerator.js` erzeugt dadurch wieder nur das NPC-Profil. Der Dokument-Record-Generator wird über `src/game/npcs/generators/index.js` exportiert.

### Nebenbei bereinigt

- Der alte, jetzt leere Ordner `src/utils/getter` wurde gelöscht.
- Wichtige Imports wurden auf die neuen `index.js`-Exports umgestellt.

### Noch nicht geändert

`src/store.js` enthält weiterhin mehrere Store-Slices. Das sollte separat betrachtet werden, weil ein Split dort mehr Auswirkungen auf den Rest der App hat.

Nächste sinnvolle Etappen:

1. `store.js` in kleinere Store-Slices aufteilen.
2. Optional Import-Aliase einführen, damit lange relative Pfade kürzer werden.

## 2026-07-07 - Etappe 7: Control Panels

### Was wurde geändert?

Die bisherigen Textbox-Komponenten wurden fachlich als Control Panels einsortiert.

Vorher:

```text
src/components/textboxes
```

Nachher:

```text
src/game/controls/components
```

### Warum?

Die Komponenten sind keine reinen Textboxen mehr. Sie sind Spiel-Controls, mit denen der Spieler direkt mit Fahrzeugen, dem Polizeiauto oder Debug-Informationen interagiert.

`Panel` beschreibt diese Aufgabe besser als `Textbox`, weil dort Buttons, Statusdaten und spaeter weitere Controls liegen koennen.

### Konkrete Dateiänderungen

```text
src/components/textboxes/BaseTextbox.jsx
-> src/game/controls/components/BaseControlPanel.jsx

src/components/textboxes/CarControlTextbox.jsx
-> src/game/controls/components/VehicleControlPanel.jsx

src/components/textboxes/PolicecarControlTextbox.jsx
-> src/game/controls/components/PoliceCarControlPanel.jsx

src/components/textboxes/CarOccupantsInformationTextbox.jsx
-> src/game/controls/components/VehicleOccupantsPanel.jsx

src/components/textboxes/CarAndDriverProfileTextbox.jsx
-> src/game/controls/components/VehicleDebugPanel.jsx

src/hooks/useCloseTextbox.jsx
-> src/hooks/useClosePanel.jsx
```

### Store-Anpassung

Der UI-Visibility-Store nutzt jetzt Control-Panel-Begriffe:

```text
textboxesVisible
-> controlPanelsVisible

setTextboxVisibilityState
-> setControlPanelVisibilityState
```

### Export-Dateien

Neue Control-Exports:

```text
src/game/controls/index.js
src/game/controls/components/index.js
```

`src/game/index.js` exportiert jetzt auch `controls`.

### Nebenbei bereinigt

- Der alte Ordner `src/components/textboxes` wurde entfernt.
- Eine ungenutzte Positionsvariable mit altem Textbox-Namen in `Car.jsx` wurde gelöscht.
- `src/App.jsx` importiert die Interaktions-Panels jetzt aus der Game-Control-Domain.

### Noch nicht geändert

Die visuelle Gestaltung der Panels ist noch sehr nah an der alten Textbox-Darstellung.

Nächste sinnvolle Etappen:

1. Panel-Layout und Button-Design spaeter gezielt verbessern.
2. Debug-Panels von echten Gameplay-Panels trennen, sobald mehr Debug-UI entsteht.

## 2026-07-07 - Etappe 8: Domain Hooks

### Was wurde geändert?

Ein Teil der globalen Hooks wurde in die jeweilige Game-Domain verschoben.

Vorher:

```text
src/hooks
```

Nachher:

```text
src/game/controls/hooks
src/game/vehicles/hooks
src/game/world/hooks
```

### Warum?

Die Hooks waren nicht wirklich global. Sie beschreiben konkrete Spiellogik:

- Control Panels schließen
- Fahrzeuge animieren
- Fahrzeuge auswählen
- World-Objekte klonen
- Refs für gerenderte Fahrzeuge verwalten

Darum liegen sie jetzt näher bei den Komponenten und Daten, mit denen sie arbeiten.

### Konkrete Dateiänderungen

```text
src/hooks/useClosePanel.jsx
-> src/game/controls/hooks/useClosePanel.jsx

src/hooks/useVehicleAnimation.jsx
-> src/game/vehicles/hooks/useVehicleAnimation.jsx

src/hooks/useVehicleInteraction.jsx
-> src/game/vehicles/hooks/useVehicleInteraction.jsx

src/hooks/useCarRefs.jsx
-> src/game/world/hooks/useCarRefs.jsx

src/hooks/useClonedScene.jsx
-> src/game/world/hooks/useClonedScene.jsx
```

### Export-Dateien

Neue Hook-Exports:

```text
src/game/controls/hooks/index.js
src/game/vehicles/hooks/index.js
src/game/world/hooks/index.js
```

Die Domain-Indexdateien exportieren ihre Hooks jetzt mit:

```text
src/game/controls/index.js
src/game/vehicles/index.js
src/game/world/index.js
```

### Nebenbei bereinigt

- Die vollständig auskommentierte Legacy-Datei `src/hooks/useVehicleEntityGenerator.jsx` wurde gelöscht.
- Die alten auskommentierten `useVehicleEntityGenerator`-Aufrufe in `src/App.jsx` wurden entfernt.
- `BorderStation.jsx` nutzt jetzt den gemeinsamen `useClonedScene`-Hook statt einer lokalen Kopie.
- `useVehicleInteraction` prüft jetzt defensiv, ob ein Fahrzeug wirklich eine `id` hat, bevor es ausgewählt wird.

### Noch nicht geändert

`src/hooks` enthält noch:

```text
useDraggable.jsx
useLilGuiSetup.jsx
```

Diese Hooks sind bewusst noch nicht verschoben:

- `useDraggable` ist aktuell eine allgemeinere UI-Hook und wird von Base-Dokumenten genutzt.
- `useLilGuiSetup` ist eher Devtool-/Debug-Infrastruktur und sollte in einer separaten Etappe einsortiert werden.

Nächste sinnvolle Etappen:

1. `useLilGuiSetup` in einen Devtools-Bereich verschieben oder langfristig entfernen.
2. `DocumentManager`, `DocumentBar` und dokumentbezogene UI stärker in die Document-Domain ziehen.
3. Debug-Panels von echten Gameplay-Panels trennen.

## 2026-07-07 - Etappe 9: Document UI Domain

### Was wurde geändert?

Die dokumentbezogene UI wurde in die Document-Domain verschoben.

Vorher:

```text
src/components/manager/DocumentManager.jsx
src/components/DocumentBar.jsx
src/components/base/BaseDocument.jsx
src/hooks/useDraggable.jsx
```

Nachher:

```text
src/game/documents/manager/DocumentManager.jsx
src/game/documents/components/DocumentBar.jsx
src/game/documents/components/BaseDocument.jsx
src/game/documents/hooks/useDraggable.jsx
```

### Warum?

Diese Dateien sind nicht mehr allgemeine App-Komponenten. Sie beschreiben den Dokument-Workflow:

- Welche Dokumente sind verfügbar?
- Welche Dokumente sind geöffnet?
- Wie werden Dokumente als bewegbare Fenster angezeigt?
- Welche Buttons öffenen Führerschein, Fahrzeugpapiere und Versicherung?

Darum liegen sie jetzt direkt bei den Dokument-Komponenten und Dokument-Generatoren.

### Konkrete Dateiänderungen

```text
src/components/manager/DocumentManager.jsx
-> src/game/documents/manager/DocumentManager.jsx

src/components/DocumentBar.jsx
-> src/game/documents/components/DocumentBar.jsx

src/components/base/BaseDocument.jsx
-> src/game/documents/components/BaseDocument.jsx

src/hooks/useDraggable.jsx
-> src/game/documents/hooks/useDraggable.jsx
```

### Export-Dateien

Neue Exports:

```text
src/game/documents/hooks/index.js
src/game/documents/manager/index.js
```

Bestehende Exports erweitert:

```text
src/game/documents/components/index.js
src/game/documents/index.js
```

### Nebenbei bereinigt

- Der leere Legacy-Ordner `src/components/manager` wurde entfernt.
- `src/components/base/index.js` exportiert `BaseDocument` nicht mehr, weil das jetzt eindeutig zur Document-Domain gehört.
- `DocumentBar` enthält kein Notebook mehr und hat jetzt ein eigenes Icon sowie Label für `proofOfInsurance`.

### Noch nicht geändert

`BaseHeadlineWithText` und `BaseImage` bleiben bewusst in `src/components/base`.

Diese Komponenten werden zwar stark von Dokumenten genutzt, sind aber eher allgemeine Anzeige-/Compare-Bausteine und können auch außerhalb der Document-Domain sinnvoll sein.

Nächste sinnvolle Etappen:

1. `useLilGuiSetup` als Devtool einsortieren oder entfernen.
2. Debug-Panel vom Gameplay-Panel trennen.
3. Optional Import-Aliase einführen, wenn die relativen Pfade zu lang werden.

## 2026-07-07 - Etappe 7: Store-Split

### Was wurde geändert?

Der große `src/store.js` wurde in mehrere kleinere Store-Slices aufgeteilt.

Vorher:

```text
src/store.js
```

Nachher:

```text
src/stores/gameStore.js
src/stores/npcStore.js
src/stores/carStore.js
src/stores/uiVisibilityStore.js
src/stores/compareStore.js
src/stores/index.js
src/store.js
```

### Warum?

`store.js` enthielt mehrere fachlich unterschiedliche Zustände:

- Game State
- NPC-Datenbank
- Fahrzeuge
- UI-Sichtbarkeit
- Vergleichsmodus

Diese Zustände ändern sich aus unterschiedlichen Gründen. Durch einzelne Store-Dateien ist schneller erkennbar, wo welcher Zustand lebt.

### Store-Slices

```text
gameStore.js
```

Hält den groben Spielmodus, z.B. `MENU`, `INGAME`, `COMPARE`, `LAPTOP`.

```text
npcStore.js
```

Hält die fake criminal database, Wanted List und NPC-bezogene Sessiondaten.

```text
carStore.js
```

Hält Fahrzeuge, Polizeiauto, ausgewähltes Fahrzeug und Fahrzeugbewegungszustand.

```text
uiVisibilityStore.js
```

Hält Sichtbarkeitszustände für Textboxen und Dokumente.

```text
compareStore.js
```

Hält Daten für den Vergleichsmodus.

### Kompatibilität

`src/store.js` bleibt als Barrel-Datei bestehen:

```js
export * from "./stores";
```

Dadurch funktionieren bestehende Imports wie diese weiter:

```js
import { useCarStore, useGameStore } from "../store";
```

Neue Dateien können später direkt aus `src/stores` importieren.

### Nebenbei bereinigt

- `gameStates.DISCREPANCY` wurde ergänzt, weil `discrepancyMode` diesen Zustand bereits verwendet.
- `clearCompareArray` setzt jetzt sauber `compareArray: []`, statt über `splice` mit dem Tippfehler `lenght` zu gehen.
- Ein ungenutzter `useNpcStore`-Import in `useLilGuiSetup.jsx` wurde entfernt.

### Noch nicht geändert

Die bestehenden Komponenten importieren aus Kompatibilitätsgründen weiterhin überwiegend aus `src/store.js`. Das ist absichtlich so, damit diese Etappe keine große Import-Welle durch die gesamte App erzeugt.

Nächste sinnvolle Etappen:

1. Bestehende Store-Imports schrittweise von `src/store.js` auf `src/stores` umstellen.
2. Optional Import-Aliase einführen, damit lange relative Pfade kürzer werden.

## 2026-07-07 - Etappe 8: Domain-Daten

### Was wurde geändert?

Der alte allgemeine Datenordner `src/data` wurde aufgelöst. Die Dateien liegen jetzt bei den Domains, die sie fachlich verwenden.

Vorher:

```text
src/data
```

Nachher:

```text
src/game/npcs/data
src/game/vehicles/data
src/game/police/data
```

### Warum?

Die Daten waren nicht mehr allgemein. Sie beschreiben konkrete Spielbereiche:

- NPC-Namen, Bilder, Haarfarben und Augenfarben gehören zur NPC-Domain.
- Fahrzeugprofile und NPC-Fahrzeuglisten gehören zur Vehicle-Domain.
- Funkmenü-Inhalte gehören zur Police-Domain.

Dadurch muss man beim Arbeiten an einem Feature weniger zwischen `data`, `utils`, `components` und `game` springen.

### Konkrete Dateiänderungen

```text
src/data/eyeColors.js
-> src/game/npcs/data/eyeColors.js

src/data/firstNames.js
-> src/game/npcs/data/firstNames.js

src/data/hairColors.js
-> src/game/npcs/data/hairColors.js

src/data/npcImages.js
-> src/game/npcs/data/npcImages.js

src/data/carProfiles.js
-> src/game/vehicles/data/carProfiles.js

src/data/npcVehicles.js
-> src/game/vehicles/data/npcVehicles.js

src/data/policeRadioMenuContent.js
-> src/game/police/data/policeRadioMenuContent.js
```

### Export-Dateien

Neue Daten-Exports:

```text
src/game/npcs/data/index.js
src/game/vehicles/data/index.js
src/game/police/data/index.js
src/game/police/index.js
```

Außerdem exportieren `src/game/npcs/index.js`, `src/game/vehicles/index.js` und `src/game/index.js` die neuen Datenbereiche mit.

### Nebenbei bereinigt

- Der alte, jetzt leere Ordner `src/data` wurde gelöscht.
- `physicalNpcCharacteristicsGenerator.js` importiert kein ungenutztes `eyeColors` mehr.
- Crime-Imports nutzen nun ebenfalls den bestehenden `data`-Barrel-Export.

Nächste sinnvolle Etappen:

1. Police-Komponenten und Police-Daten zusammenführen.
2. Bestehende Store-Imports schrittweise von `src/store.js` auf `src/stores` umstellen.
3. Optional Import-Aliase einführen, damit lange relative Pfade kürzer werden.

## 2026-07-07 - Etappe 9: Police-Komponenten als Police-Domain

### Was wurde geändert?

Die Police-Komponenten wurden aus dem allgemeinen Komponentenbaum in die Police-Domain verschoben.

Vorher:

```text
src/components/police-components
```

Nachher:

```text
src/game/police/components
```

### Warum?

Laptop, Funkgerät und Police-Menüs sind keine allgemeinen UI-Bausteine. Sie gehören fachlich zur Police-Spielmechanik und verwenden bereits Police-Daten wie `policeRadioMenuContent`.

Damit liegen Police-Daten und Police-UI jetzt zusammen:

```text
src/game/police
├── components
└── data
```

### Konkrete Dateiänderungen

```text
src/components/police-components/police-radio
-> src/game/police/components/police-radio

src/components/police-components/police-laptop
-> src/game/police/components/police-laptop
```

### Export-Dateien

Neue Exports:

```text
src/game/police/components/index.js
src/game/police/components/police-radio/index.js
src/game/police/components/police-laptop/index.js
```

`src/game/police/index.js` exportiert jetzt sowohl `components` als auch `data`.

### Nebenbei bereinigt

- `Policeradio` wurde zu `PoliceRadio` umbenannt.
- `Radiooption` wurde zu `RadioOption` umbenannt.
- Alte auskommentierte Importzeilen mit falschen Pfaden wurden entfernt.
- `App.jsx` importiert Police-Komponenten jetzt aus `src/game/police/components`.

### Noch nicht geändert

Die übrigen Komponenten in `src/components` sind weiterhin gemischt aus generischen UI-Komponenten und World-/Scene-Komponenten. Das kann später weiter aufgeteilt werden.

Nächste sinnvolle Etappen:

1. Generische Komponenten von Game-/World-Komponenten trennen.
2. Bestehende Store-Imports schrittweise von `src/store.js` auf `src/stores` umstellen.
3. Optional Import-Aliase einführen, damit lange relative Pfade kürzer werden.

## 2026-07-07 - Etappe 10: World-Komponenten und Base-Komponenten

### Was wurde geändert?

Die verbliebenen Komponenten in `src/components` wurden weiter getrennt:

- World-/Scene-Komponenten liegen jetzt in der World-Domain.
- Generische Base-Komponenten liegen jetzt in `src/components/base`.

Vorher:

```text
src/components/BorderStation.jsx
src/components/Car.jsx
src/components/Gamecanvas.jsx
src/components/PoliceCar.jsx
src/components/Policeman.jsx
src/components/Road.jsx
src/components/Streetbay.jsx
src/components/base-components
```

Nachher:

```text
src/game/world/components
src/components/base
```

### Warum?

Die World-Komponenten sind keine generischen UI-Komponenten. Sie rendern konkrete Spielwelt-Objekte oder die 3D-Scene:

- `Gamecanvas`
- `Car`
- `PoliceCar`
- `BorderStation`
- `Policeman`
- `Road`
- `Streetbay`

Darum gehören sie in `src/game/world/components`.

Die Base-Komponenten dagegen sind generische UI-Bausteine, die von mehreren Bereichen verwendet werden. Deshalb wurde `base-components` zu `base` gekürzt.

### Konkrete Dateiänderungen

```text
src/components/Gamecanvas.jsx
-> src/game/world/components/Gamecanvas.jsx

src/components/Car.jsx
-> src/game/world/components/Car.jsx

src/components/PoliceCar.jsx
-> src/game/world/components/PoliceCar.jsx

src/components/BorderStation.jsx
-> src/game/world/components/BorderStation.jsx

src/components/Policeman.jsx
-> src/game/world/components/Policeman.jsx

src/components/Road.jsx
-> src/game/world/components/Road.jsx

src/components/Streetbay.jsx
-> src/game/world/components/Streetbay.jsx

src/components/base-components
-> src/components/base
```

### Export-Dateien

Neue Exports:

```text
src/game/world/components/index.js
src/components/base/index.js
```

`src/game/world/index.js` exportiert jetzt auch `components`.

### Nebenbei angepasst

- `App.jsx` importiert `Gamecanvas` jetzt aus `src/game/world/components`.
- Dokument- und Textbox-Komponenten importieren Base-Komponenten jetzt aus `src/components/base`.
- Alte `base-components`-Pfade wurden entfernt.

### Noch nicht geändert

`src/components` enthält weiterhin allgemeine App-/UI-Komponenten wie `Startmenu`, `Notebook`, `DocumentBar`, `manager` und `textboxes`.

Nächste sinnvolle Etappen:

1. `textboxes` fachlich einsortieren oder als UI-Bereich bewusst behalten.
2. Bestehende Store-Imports schrittweise von `src/store.js` auf `src/stores` umstellen.
3. Optional Import-Aliase einführen, damit lange relative Pfade kürzer werden.

## 2026-07-07 - Etappe 11: Store-Imports direkt auf `src/stores`

### Was wurde geändert?

Alle aktiven Store-Imports wurden von `src/store.js` auf `src/stores` umgestellt.

Vorher:

```js
import { useCarStore } from "../store";
```

Nachher:

```js
import { useCarStore } from "../stores";
```

### Warum?

Seit Etappe 7 sind die Stores in eigene Dateien aufgeteilt:

```text
src/stores/gameStore.js
src/stores/npcStore.js
src/stores/carStore.js
src/stores/uiVisibilityStore.js
src/stores/compareStore.js
src/stores/index.js
```

`src/store.js` war danach nur noch eine Kompatibilitätsdatei. Nachdem alle aktiven Imports auf `src/stores` zeigen, konnte diese alte Datei entfernt werden.

### Konkrete Dateiänderungen

Geändert wurden Store-Imports in:

```text
src/App.jsx
src/components/Startmenu.jsx
src/components/base
src/components/manager/DocumentManager.jsx
src/components/textboxes
src/game/world/components
src/hooks
```

### Nebenbei bereinigt

- `src/store.js` wurde gelöscht.
- Es gibt jetzt nur noch einen Store-Einstiegspunkt: `src/stores`.

### Noch nicht geändert

Ein paar komplett auskommentierte Legacy-Zeilen erwähnen `stores` noch beispielhaft. Das ist kein aktiver Import.

Nächste sinnvolle Etappen:

1. Textbox-Struktur entscheiden: behalten, `inspection`-Domain oder fachliche Aufteilung.
2. Optional Import-Aliase einführen, damit lange relative Pfade kürzer werden.

## 2026-07-07 - Etappe 6: World-Domain

### Was wurde geändert?

World-, Spawn- und Bewegungsdaten wurden in eine eigene World-Domain verschoben.

Vorher:

```text
src/config/positions.js
src/data/streetbayEntryCoordinates.js
src/utils/generators/randomNpcWithVehicleGenerator.js
src/utils/generators/util-generators/generateIssueAndExpiryDate.js
```

Nachher:

```text
src/game/world/config
src/game/world/paths
src/game/world/generators
src/game/documents/generators/generateIssueAndExpiryDate.js
```

### Warum?

Die alten Dateien waren fachlich nicht mehr allgemein genug für `config`, `data` oder `utils`.

- Polizei- und Fahrzeugpositionen beschreiben die Spielwelt.
- Die Streetbay-Kurve ist ein World-Path.
- Der Random-NPC-mit-Fahrzeug-Generator erzeugt eine Runtime-Spawn-Entity für die Welt.
- `generateIssueAndExpiryDate` gehört fachlich zur Dokument-Domain, weil es nur Dokumentdaten erzeugt.

### Konkrete Dateiänderungen

```text
src/config/positions.js
-> src/game/world/config/policePositions.js
-> src/game/world/config/streetbayPositions.js
-> src/game/world/config/vehicleMovementConfig.js

src/data/streetbayEntryCoordinates.js
-> src/game/world/paths/streetbayEntryCoordinates.js

src/utils/generators/randomNpcWithVehicleGenerator.js
-> src/game/world/generators/randomNpcWithVehicleGenerator.js

src/utils/generators/util-generators/generateIssueAndExpiryDate.js
-> src/game/documents/generators/generateIssueAndExpiryDate.js
```

### Export-Dateien

Neue World-Exports:

```text
src/game/world/index.js
src/game/world/config/index.js
src/game/world/generators/index.js
src/game/world/paths/index.js
```

`src/game/index.js` exportiert jetzt auch `world`.

### Nebenbei bereinigt

- Der alte leere Ordner `src/config` wurde gelöscht.
- Der alte `src/utils`-Baum wurde vollständig entfernt.
- Die komplett auskommentierte Legacy-Datei `src/hooks/useSetWantedList.jsx` wurde gelöscht.
- Imports in `Gamecanvas.jsx`, `useVehicleAnimation.jsx` und `useLilGuiSetup.jsx` wurden auf die World-Domain umgestellt.

### Noch nicht geändert

`src/store.js` ist weiterhin eine Sammeldatei für mehrere Stores. Das ist die nächste größere, sinnvolle Etappe.

Nächste sinnvolle Etappen:

1. `store.js` in kleinere Store-Slices aufteilen.
2. Optional Import-Aliase einführen, damit lange relative Pfade kürzer werden.

## 2026-07-07 - Etappe 12: Aliase, App-Shell, Devtools, Styles, Konvention

### Was wurde geändert?

Fünf strukturelle Verbesserungen in einer Etappe:

1. Import-Aliase in Vite und `jsconfig.json`
2. App-Shell nach `src/app/` (ohne `Notebook`)
3. Devtools-Bereich für Debug-UI
4. Styles nach `src/styles/`, `carBrands.json` nach Vehicle-Daten
5. Domain-Konvention in `docs/system-changes/domain-convention.md`

Vorher:

```text
src/App.jsx
src/components/Startmenu.jsx
src/hooks/useLilGuiSetup.jsx
src/game/controls/components/VehicleDebugPanel.jsx
assets/css/
assets/json/carBrands.json
```

Nachher:

```text
src/app/App.jsx
src/app/components/Startmenu.jsx
src/devtools/useLilGuiSetup.jsx
src/devtools/panels/VehicleDebugPanel.jsx
src/styles/
src/game/vehicles/data/carBrands.json
docs/system-changes/domain-convention.md
```

### Import-Aliase

Neue Aliase in `vite.config.js` und `jsconfig.json`:

```text
@          -> src/
@app       -> src/app/
@components -> src/components/
@devtools   -> src/devtools/
@game       -> src/game/
@stores     -> src/stores/
@styles     -> src/styles/
```

Cross-Domain-Imports wurden auf Aliase umgestellt. Imports innerhalb derselben Domain bleiben relativ.

### App-Shell

`App.jsx` und `Startmenu.jsx` liegen jetzt unter `src/app/`. `main.jsx` importiert `@app/App.jsx`.

`Notebook.jsx` bleibt bewusst in `src/components/` — die fachliche Zugehörigkeit ist noch offen. Ein Kommentar in der Datei und `docs/system-changes/domain-convention.md` dokumentieren die Optionen.

### Devtools

Debug-Code ist aus dem Gameplay-Baum getrennt:

```text
src/devtools/
├── useLilGuiSetup.jsx
├── panels/VehicleDebugPanel.jsx
└── index.js
```

`VehicleDebugPanel` wurde aus `game/controls/components` entfernt.

### Styles

CSS-Dateien liegen jetzt in `src/styles/`:

```text
src/styles/App.css
src/styles/index.css
src/styles/blink.css
```

Der alte Ordner `assets/css/` wurde geleert.

### Domain-Konvention

`docs/system-changes/domain-convention.md` beschreibt die Standard-Domain-Struktur, bestehende Domains, Aliase und Entscheidungshilfen für neue Features.

### Nebenbei bereinigt

- Unbenutzter `useNpcStore`-Import in `App.jsx` entfernt.
- `carBrands.json` nach `src/game/vehicles/data/` verschoben und über `data/index.js` exportiert.

### Noch nicht geändert

- `Notebook.jsx` — Zielort noch offen.
- Store-Naming (`useGuiVisibilityStatesStore`, `useDiscrepandancyCompareStore`).
- Police-Laptop-Ordner flacher strukturieren.

Nächste sinnvolle Etappen:

1. `Notebook` fachlich einordnen, sobald der Wanted-List-/HUD-Flow klar ist.
2. Store-Naming bereinigen.
3. Debug-UI per `import.meta.env.DEV` aus Production ausschließen.

## 2026-07-10 - Etappe 11: Panels, Document Base und Notebook

### Was wurde geändert?

Die letzten allgemein einsortierten Komponenten wurden in ihre fachlichen Domains verschoben.

### Panels

Der Ordner `controls` wurde zu `panels` umbenannt.

Vorher:

```text
src/game/controls
```

Nachher:

```text
src/game/panels
```

### Warum?

Der Ordner enthält aktuell keine allgemeine Control-Infrastruktur, sondern konkrete Panel-Komponenten und den Close-Hook für Panels.

`panels` beschreibt den tatsächlichen Inhalt deshalb präziser.

### Document Base

Die dokumentbezogenen Base-Komponenten liegen jetzt unter der Document-Domain.

Vorher:

```text
src/components/base/BaseHeadlineWithText.jsx
src/components/base/BaseImage.jsx
src/components/base/index.js
```

Nachher:

```text
src/game/documents/components/base/BaseHeadlineWithText.jsx
src/game/documents/components/base/BaseImage.jsx
src/game/documents/components/base/index.js
```

### Notebook

Das Notebook wurde in die Police-Domain verschoben.

Vorher:

```text
src/components/Notebook.jsx
```

Nachher:

```text
src/game/police/components/Notebook.jsx
```

### Nebenbei bereinigt

- `src/components` wurde vollständig entfernt.
- Der unbenutzte Alias `@components` wurde aus `vite.config.js` und `jsconfig.json` gelöscht.
- `src/game/index.js` exportiert jetzt `panels` statt `controls`.
- `docs/system-changes/domain-convention.md` wurde an die neue Struktur angepasst.

### Aktuelle Zielstruktur

```text
src/game/documents/components/base
src/game/panels
src/game/police/components/Notebook.jsx
```

### Nächste sinnvolle Etappen

1. Store-Naming bereinigen.
2. Debug-UI per `import.meta.env.DEV` aus Production ausschließen.
3. Police-Laptop-Ordner flacher strukturieren.

## 2026-07-10 - Etappe 12: Compare-Store entfernt

### Was wurde geändert?

Der alte Dokument-Vergleichsversuch wurde entfernt.

Gelöscht:

```text
src/stores/compareStore.js
src/styles/blink.css
```

Bereinigt:

```text
src/stores/index.js
src/game/documents/components/base/BaseHeadlineWithText.jsx
src/game/documents/components/base/BaseImage.jsx
src/game/documents/components/CarDocuments.jsx
src/game/documents/components/DriversLicense.jsx
src/game/documents/components/ProofOfInsurance.jsx
src/game/panels/components/VehicleOccupantsPanel.jsx
```

### Warum?

Der Compare-Store war ein früher Versuch, Dokumentfelder und Bilder dokumentübergreifend zu vergleichen.

Aktuell wird dieser Flow nicht gebraucht und hat die Base-Komponenten unnötig komplex gemacht.

### Was ist jetzt einfacher?

- `BaseHeadlineWithText` zeigt nur noch Label und Wert an.
- `BaseImage` zeigt nur noch das Bild an.
- `useCase` und `documentDataField` werden nicht mehr an die Base-Komponenten übergeben.
- Die Blink-Animationen für Vergleichsfehler sind entfernt.
- `stores/index.js` exportiert nur noch aktive Stores.

### Nächste sinnvolle Etappen

1. Store-Naming bereinigen.
2. Debug-UI per `import.meta.env.DEV` aus Production ausschließen.
3. Police-Laptop-Ordner flacher strukturieren.
