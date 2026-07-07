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

1. `src/utils/generators/npc` nach `src/game/npcs/generators` verschieben.
2. `src/utils/generators/vehicle` nach `src/game/vehicles/generators` verschieben.
3. `src/utils/generators/criminalDatabaseGenerator.js` in eine passende Domain verschieben, z.B. `src/game/crimes/generators`.
4. Optional später Import-Aliase einführen, damit lange relative Pfade kürzer werden.
