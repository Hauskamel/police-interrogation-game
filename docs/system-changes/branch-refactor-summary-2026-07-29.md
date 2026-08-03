# Branch-Refactor: NPC-, Traffic- und Dokumentmodell

Stand: 29.07.2026

Dieses Dokument fasst die auf diesem Branch vorgenommenen strukturellen
Änderungen zusammen. Es ergänzt die spielerische Beschreibung in
[NPCs, Polizeiwissen und Verkehrskontrollen](../game-systems/npc-generation.md).

## Ziel des Branches

Das frühere gekoppelte NPC-/Fahrzeugmodell wurde zu einem System aus klar
getrennten Identitäten, Weltinstanzen und Wissensebenen weiterentwickelt.

Die wichtigsten Ziele waren:

- NPC, Fahrzeug, Fahrzeughalter und TrafficEntity getrennt identifizieren
- echte und vorgezeigte Daten voneinander trennen
- Dokumentmanipulationen reproduzierbar beschreiben
- Polizeiwissen von der internen Weltwahrheit trennen
- bekannte, gesuchte und unbekannte Täter relational auflösen
- Debug-Spawns ohne zufallsabhängige Wartezeiten ermöglichen
- doppelte Zustände und alte Profilmodelle entfernen

## TrafficEntity

Eine TrafficEntity beschreibt eine konkrete Situation in der Spielwelt:

```text
Dieser Fahrer fährt jetzt mit diesem Fahrzeug,
das auf diesen Halter zugelassen ist.
```

Sie enthält unter anderem:

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

Alle IDs verwenden kurze, typisierte Werte wie `npc--5e77eb571e` oder
`traffic--0052f9a81c`.

## Gemeinsame Traffic-Orchestrierung

Vier fachliche Factories erzeugen die möglichen Verkehrsfälle:

```text
createCivilianTrafficEntity
createUnknownOffenderTrafficEntity
createKnownOffenderTrafficEntity
createWantedOffenderTrafficEntity
```

Die wiederholte technische Orchestrierung liegt in `assembleTrafficEntity`.
Der Assembler übernimmt:

- Fahrzeughalter bestimmen
- Fahrzeugprofil erzeugen
- Dokumentzustand erzeugen
- real/presented für die Kontrolle aufbauen
- Traffic- und Fahrzeug-ID vergeben
- fertige TrafficEntity zusammensetzen

Die Factories definieren nur Fahrerquelle, Wahrheit, Polizeiwissen und
Prüfprofil.

## Polizei-Datenbank

Die Polizei-Datenbank ist relational aufgebaut:

```js
{
  npcsById: {},
  crimeRecordsById: {},
  wantedRecordsById: {},
  criminalNpcIds: [],
  knownOffenderNpcIds: [],
  wantedRecordIds: []
}
```

`npcsById` enthält kanonische NPC-Records. Dauerhaftes `presented` wird dort
nicht gespeichert. Known- und Wanted-Spawns erzeugen ihre vorgezeigte Ansicht
erst für die konkrete Kontrolle.

Bekannte Täter besitzen keinen aktiven Wanted Record. Gesuchte Täter werden
über einen eigenständigen Wanted Record mit Status und Priorität referenziert.

## Interne Weltwahrheit

Straftaten unbekannter Täter dürfen nicht in der Polizei-Datenbank erscheinen.
Dafür existiert eine getrennte `worldTruthDatabase`:

```js
{
  npcsById: {},
  crimeRecordsById: {}
}
```

Unentdeckte Straftaten erhalten den Status `undiscovered`. Die TrafficEntity
speichert nur `crimeRecordIds`; die vollständigen Records bleiben relational
über `worldTruthDatabase.crimeRecordsById` auflösbar.

Die Registrierung ist ein ausdrücklicher Spawn-Schritt:

```text
TrafficEntity generieren
→ registerTrafficEntityWorldTruth
→ addTrafficEntity
```

`addTrafficEntity` verändert ausschließlich den Traffic-Store. Dadurch ist die
Cross-Store-Operation nicht mehr als technischer Seiteneffekt versteckt.
Entities mit noch nicht registrierten `worldTruthRecords` werden von
`addTrafficEntity` abgelehnt, damit ein neuer Spawn-Pfad den Commit-Schritt
nicht unbemerkt überspringen kann.

## real, presented und Dokumentmanipulation

`real` beschreibt die kanonische Wahrheit einer Kontrolle. `presented`
beschreibt die Angaben, die der Spieler auf den vorgelegten Dokumenten sieht.

Unterstützte Manipulationen:

```text
Führerschein:
- falsche Adresse
- falsches Geburtsdatum
- falsche Führerscheinnummer
- falscher Vor- und Nachname

Fahrzeugschein:
- abweichendes Kennzeichen
- falsche Registrierungsnummer
- falsche Marke und falsches Modell
```

`documentState` hält Fälschungstyp, betroffene Felder und mögliche
Prüfmethoden. `real` wird bei der Manipulation nicht verändert.

## Eine kanonische Führerscheinquelle

Zuvor lagen dieselben Führerscheindaten gleichzeitig:

- eingebettet unter `npc.driversLicense`
- als zweiter Record unter `documentsById`
- referenziert über `documentIds`

Diese doppelte Wahrheitsquelle wurde entfernt. Aktuell gilt:

```js
npc.driversLicense = {
  licenseNumber,
  issueDate,
  expiryDate
}
```

`documentsById`, `documentIds` und der separate
`npcDriversLicenseDocumentGenerator` wurden entfernt. UI, Generatoren und
Fälschungslogik lesen dieselbe kanonische Führerscheinstruktur.

Wenn Dokumente später ausgestellt, eingezogen oder historisiert werden sollen,
muss das Modell vollständig zu eigenständigen Dokument-Entities migriert
werden. Eine parallele Speicherung beider Modelle soll nicht erneut entstehen.

## Ein-Fahrzeug-Kontrollregel

Der Traffic-Store erzwingt:

```text
Maximal eine TrafficEntity darf stopped === true besitzen.
```

Die Invariante gilt für:

- `stopTrafficEntity`
- direkte Updates über `updateTrafficEntity`
- bereits gestoppte Entities beim Hinzufügen
- Dev-Spawns an der Kontrollstation

Das Devtool erzeugt kein weiteres Stationsfahrzeug, solange bereits eine
Kontrolle aktiv ist. Die UI ist damit nicht mehr die einzige Schutzschicht.

## Auswahlzustand

Der Store speichert nur:

```text
selectedVehicleId
```

`selectSelectedTrafficEntity` und `selectSelectedVehicle` lösen daraus das
aktuelle Objekt auf. Eine zweite Kopie der ausgewählten TrafficEntity existiert
nicht mehr.

## Weitere Bereinigungen

- Weighted Random verwendet einen gemeinsamen Shared-Helper.
- NPCs werden derzeit ausschließlich männlich generiert.
- Fahrzeug-Baujahrbereiche werden als inklusive Spannen ausgewürfelt.
- Polizeibekanntheit wird aus `police.status` abgeleitet.
- Fahndungspriorität liegt ausschließlich im Wanted Record.
- TrafficEntity verwendet nur `id`, nicht zusätzlich `trafficEntityId`.
- Veraltete Farbdateien, leere Fahrzeugdaten und der alte Laptop-Datenbank-
  Prototyp wurden entfernt.
- Mehrere Generatoren erhielten fachlich eindeutigere Namen.

## Debugging

Das lil-gui kann Traffic-Typ, Datenbank-NPC, Polizeibekanntheit,
Dokumentfälschung und Inspection Profile steuern.

Die zusätzliche Aktion `Spawn Random NPC (Blindtest)` verwendet
`generateTrafficEntity` ohne `forcedType`, `forcedHasForgery` oder konkrete
Datenbank-ID. Der gemeinsame Spawn-Commit übernimmt anschließend Weltregistrierung,
Auswahl und Stop-Zustand. Die ausgewürfelte Traffic-Kategorie wird für diese Entity
nicht in die lil-gui-Controls zurücksynchronisiert.

Das Debug-Panel zeigt:

- Traffic-, NPC- und Fahrzeug-IDs
- Fahrer- und Halterdaten
- real/presented-Vergleiche
- Dokumentstatus und erkannte Abweichungen
- Polizeistatus und Datenbankreferenzen
- relational aufgelöste World-Truth-Crimes
- vollständige Rohdaten

Ein separates Panel zeigt die Polizei-Datenbank mit NPCs, Straftaten und
Fahndungsrecords.

## Validierungsinvarianten

Für diesen Branch werden folgende Regeln geprüft:

```text
Polizei-NPCs enthalten kein dauerhaftes presented.
Unbekannte Straftaten besitzen status === "undiscovered".
Crime- und Wanted-IDs sind relational auflösbar.
real bleibt bei Dokumentmanipulationen unverändert.
Führerscheindaten besitzen nur eine kanonische Quelle.
Maximal eine TrafficEntity ist angehalten.
World Truth wird vor dem Traffic-Insert ausdrücklich registriert.
Die Fahrzeugauswahl wird ausschließlich über selectedVehicleId gespeichert.
Fahrzeugbaujahre liegen innerhalb ihrer vollständigen Modellspanne.
```
