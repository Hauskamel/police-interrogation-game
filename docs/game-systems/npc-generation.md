# Spielsystem: NPCs, Polizeiwissen und Verkehrskontrollen

Stand: 2026-07-27

Dieses Dokument beschreibt die fachliche Idee hinter NPCs, Fahrzeugen, Polizeidaten und Dokumentkontrollen. Technische Änderungen auf dem Branch stehen getrennt in [Branch-Änderungen](../system-changes/npc-manipulated-identity-branch-changes.md).

## Spielziel

Das Spiel orientiert sich an kontroll- und dokumentbasiertem Gameplay:

- Identitäten prüfen
- Dokumente miteinander vergleichen
- gefälschte Angaben erkennen
- Polizeidaten korrekt interpretieren
- unbekannte Straftäter über Hinweise aufdecken
- zwischen einem Datenbankeintrag und einer aktiven Fahndung unterscheiden

Ein Polizeieintrag ist kein automatischer Festnahmegrund. Deshalb trennt das Datenmodell Wahrheit, Polizeiwissen, Fahndungsstatus und vorgezeigte Angaben.

## Zentrale Modelle

### NPC

Ein NPC ist eine eigenständige Person mit stabiler `npcId`.

Das NPC-Profil enthält:

```js
{
  real: {},
  presented: {}
}
```

`real` beschreibt die interne Wahrheit. `presented` beschreibt die sichtbaren Angaben auf vorgelegten Dokumenten.

Ein NPC kann in der Polizeidatenbank existieren, ohne gerade in der Spielwelt zu fahren.

### Vehicle

Ein Fahrzeug besitzt eine eigene `vehicleId` und ein eigenes Profil:

```js
{
  real: {},
  presented: {}
}
```

Zum Fahrzeug gehören unter anderem:

- Hersteller und Modell
- Kennzeichen
- Registriernummer
- technische Daten
- Fahrzeugdokumentdaten
- `registeredOwnerNpcId`

Das Fahrzeug ist nicht der Fahrer und nicht der Halter. Es verweist lediglich auf den eingetragenen Halter.

### Fahrzeughalter

Der Halter wird als eigene NPC-Identität gespeichert:

```js
vehicleOwnerProfile: {
  real: {},
  presented: {}
}

ownership: {
  registeredOwnerNpcId: "npc--owner",
  driverIsRegisteredOwner: false
}
```

Fahrer und Halter können dieselbe Person sein:

```text
driverProfile.real.npcId
  === ownership.registeredOwnerNpcId
```

Sie können aber auch voneinander abweichen. Dadurch werden später sinnvolle Prüfungen möglich:

- geliehenes Fahrzeug
- Firmenfahrzeug
- Mietwagen
- abweichender Halter
- gestohlenes Fahrzeug
- manipulierte Halterangaben

Der Fahrzeugschein zeigt die Daten aus `vehicleOwnerProfile.presented`, nicht automatisch die Daten des Fahrers.

### TrafficEntity

Eine TrafficEntity ist eine konkrete aktive Situation in der Spielwelt:

```text
Dieser NPC fährt jetzt mit diesem Fahrzeug,
das auf diesen Halter zugelassen ist.
```

Sie verbindet:

- `driverProfile`
- `vehicleOwnerProfile`
- `vehicleProfile`
- `ownership`
- `truth`
- `police`
- `documentState`
- `inspectionProfile`
- Spawn- und Bewegungszustand

Wichtige IDs:

| ID | Bedeutung |
|---|---|
| `npcId` | Identität des Fahrers |
| `vehicleId` | Identität des Fahrzeugs |
| `registeredOwnerNpcId` | Identität des Fahrzeughalters |
| `id` der TrafficEntity | konkrete Spawn- und Kontrollsituation |

### ID-Format

Alle zur Laufzeit erzeugten Spiel-IDs verwenden dasselbe kompakte Format:

```text
npc--5e77eb571e
vehicle--b157c42573
traffic--0052f9a81c
crime--45aa70d261
wanted--9e31dc4730
doc--7b8c14a2ef
```

Der Präfix beschreibt die Entity-Art. Der zufällige Teil besteht aus zehn Hex-Zeichen und liefert rund 40 Bit. Bereits innerhalb der laufenden Session vergebene IDs werden vom Generator nicht erneut akzeptiert.

Die IDs sind keine fortlaufenden Nummern. Dadurch lassen sich Records unabhängig erzeugen, ohne eine zentrale Zählervariable speichern zu müssen.

## Traffic-Typen

Das System unterscheidet vier aktive Fälle.

| Typ | Interne Wahrheit | Polizeiwissen | Datenbankquelle |
|---|---|---|---|
| `civilian` | Zivilist | normalerweise unbekannt | neu generiert |
| `unknownOffender` | Straftäter | Identität nicht bekannt | neu generiert |
| `knownOffender` | Straftäter | bekannt, nicht gesucht | Criminal Database |
| `wantedOffender` | Straftäter | aktiv gesucht | Criminal Database plus Fahndungsrecord |

### `civilian`

```js
truth.role = "civilian"
police.status = "unknown"
```

Ein Zivilist kann trotzdem Dokumentprobleme oder kleinere Unstimmigkeiten besitzen. Eine Auffälligkeit ist nicht automatisch eine Straftat.

### `unknownOffender`

```js
truth.role = "criminal"
police.status = "unknown"
```

Das Spiel kennt intern die Straftaten. Der Spieler und die Polizei kennen die Täteridentität noch nicht. Dieser Unterschied ermöglicht Ermittlungen und spätere Identifizierung.

### `knownOffender`

```js
truth.role = "criminal"
police.status = "known"
police.databaseNpcId = "npc--123"
police.wantedRecordId = null
```

Die Person besitzt einen Polizeieintrag, wird aber nicht aktiv gesucht. Ein Treffer darf daher nicht wie ein Haftbefehl behandelt werden.

### `wantedOffender`

```js
truth.role = "criminal"
police.status = "wanted"
police.databaseNpcId = "npc--123"
police.wantedRecordId = "wanted--456"
```

Die Person besitzt zusätzlich einen aktiven Fahndungsrecord. Nur dieser eigene Record begründet den Status `wanted`.

## Criminal Database

Die Criminal Database ist tabellenartig aufgebaut:

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

`npcsById` enthält ausschließlich kanonische NPC-Records:

```js
{
  npcId: "npc--123",
  firstName: "Jonas",
  lastName: "Keller",
  driversLicense: {
    licenseNumber: "ABC-12345678",
    issueDate: "2021-04-12",
    expiryDate: "2036-04-12"
  },
  crimeRecordIds: ["crime--789"]
}
```

`presented` wird nicht in der Polizei-Datenbank gespeichert. Erst eine konkrete
TrafficEntity baut aus dem kanonischen Record ihr temporäres
`driverProfile.real` und `driverProfile.presented`.

Der Führerschein liegt aktuell ausschließlich unter `npc.driversLicense`.
Eine zweite `documentsById`-Kopie existiert nicht. Wenn Dokumente später einen
eigenen Lebenszyklus erhalten, muss die Migration vollständig auf ein
eigenständiges Dokumentmodell erfolgen, statt beide Formen parallel zu halten.

### Bekannte Täter

`knownOffenderNpcIds` enthält Datenbank-NPCs ohne aktive Fahndung.

Diese NPCs können als `knownOffender` erscheinen:

```text
NPC ist polizeibekannt
NPC besitzt Crime Records
NPC hat keinen aktiven Wanted Record
```

### Eigenständige Fahndungsrecords

Eine Fahndung ist kein Flag im NPC und keine zweite NPC-ID.

Beispiel:

```js
{
  id: "wanted--456",
  npcId: "npc--123",
  status: "active",
  reasonCrimeRecordIds: ["crime--789"],
  issuedAt: "2026-03-18",
  priorityLevel: 2
}
```

Vorteile:

- Eine Fahndung kann widerrufen werden.
- Eine Fahndung kann ablaufen.
- Eine Person kann bekannt bleiben, obwohl die Fahndung beendet ist.
- Der Grund der Fahndung kann über Crime-Record-IDs aufgelöst werden.
- `wantedRecordId` ist nicht mehr fälschlich identisch mit `npcId`.

Aktuell vorhandene Record-Status:

```text
active
revoked
expired
resolved
```

Nur `active` darf einen `wantedOffender` erzeugen.

## Interne Weltwahrheit

Nicht jede tatsächlich begangene Straftat ist der Polizei bereits bekannt.
Deshalb existiert neben der Polizei-Datenbank eine getrennte relationale
`worldTruthDatabase`:

```js
{
  npcsById: {},
  crimeRecordsById: {}
}
```

Ein `unknownOffender` wird nicht in `criminalDatabase` eingetragen. Beim Spawn
werden seine echte Identität und seine Straftaten stattdessen in
`worldTruthDatabase` normalisiert gespeichert.

Die TrafficEntity enthält anschließend nur Foreign Keys:

```js
truth: {
  role: "criminal",
  crimeRecordIds: ["crime--123"],
  caseIds: []
}
```

Der vollständige Crime Record ist intern auflösbar über:

```js
worldTruthDatabase.crimeRecordsById["crime--123"]
```

Umgekehrt enthält auch der interne NPC-Datensatz seine `crimeRecordIds`.
Jeder Crime Record verweist über `npcId` wieder auf den Täter.

Solange die Tat weder entdeckt noch der Polizei gemeldet wurde, besitzt sie den
internen Status `undiscovered`. Sie kann in diesem Zustand nicht gleichzeitig
`convicted` oder `under_investigation` sein.

Dadurch gilt:

- Die Spielsimulation kennt Täter und Straftat vollständig.
- Die Polizei-Datenbank verrät die unbekannte Identität nicht.
- Crime Records liegen nicht als eingebettete Kopie in einer TrafficEntity.
- Ein späteres Ermittlungs- oder Fallsystem kann dieselben IDs verwenden.
- Die Records bleiben auch nach dem Entfernen der TrafficEntity erhalten.

Beim Start einer neuen Spielsitzung wird `worldTruthDatabase` geleert.

## Aktuelle Generierungsgrenzen

- NPCs werden derzeit bewusst ausschließlich als männlich generiert.
- Bei `wrong_name` werden Vor- und Nachname gemeinsam manipuliert.
- Fahrzeug-Baujahrbereiche sind inklusive Spannen; `[2012, 2022]` erlaubt jedes
  Jahr von 2012 bis einschließlich 2022.
- Der Traffic-Store speichert nur `selectedVehicleId`. Das ausgewählte Fahrzeug
  beziehungsweise die ausgewählte TrafficEntity wird daraus abgeleitet.

## Wahrheit und Polizeiwissen

`truth` und `police` erfüllen unterschiedliche Aufgaben:

```js
truth: {
  role: "criminal",
  crimeRecordIds: ["crime--123"],
  caseIds: []
}

police: {
  status: "known",
  databaseNpcId: "npc--456",
  wantedRecordId: null
}
```

`truth` beantwortet: Was ist wirklich passiert?

`police` beantwortet: Was darf die Polizei aktuell wissen und welche Records belegen es?

Ob ein NPC polizeibekannt ist, wird aus `police.status` abgeleitet. Dadurch können
`status` und ein separates Boolean-Flag nicht unterschiedliche Aussagen liefern.

Die Priorität einer aktiven Fahndung liegt ausschließlich im zugehörigen
`wantedRecord.priorityLevel`. Die TrafficEntity referenziert diesen Datensatz nur
über `police.wantedRecordId`.

## `real`, `presented` und `documentState`

Die drei Ebenen bleiben getrennt:

```text
real          -> interne Wahrheit
presented     -> sichtbare oder vorgelegte Daten
documentState -> Grund und Art einer Manipulation
```

Beispiel:

```text
driverProfile.real.address      = "Mühlenweg 12"
driverProfile.presented.address = "Bahnhofstraße 4"
```

`documentState` beschreibt dazu:

```js
{
  hasForgery: true,
  npcDocuments: {
    driversLicense: {
      integrity: "forged",
      forgeryType: "wrong_address",
      affectedFields: ["address"],
      detectableBy: ["compare_with_database", "ask_address_question"]
    }
  }
}
```

Dokumente lesen aus `presented`. Debug- und interne Vergleichssysteme dürfen zusätzlich auf `real` zugreifen.

### Sichtbares Spielerwissen

Das Kontrollpanel zeigt Fahrername und Fahrerbild nicht automatisch beim Anhalten.
Die Informationen werden erst sichtbar, nachdem der Spieler ein Dokument mit der
Fahreridentität geöffnet hat.

Aktuell decken folgende Dokumente die Fahreridentität auf:

```text
Führerschein
Versicherungsnachweis
```

Der Fahrzeugschein deckt den Fahrer nicht pauschal auf. Er zeigt den eingetragenen
Fahrzeughalter, der eine andere Person sein kann.

Einmal gelesene Fahrerinformationen bleiben während derselben Kontrolle bekannt.
Die Freischaltung wird mit TrafficEntity-ID und NPC-ID gespeichert, damit sie nach
einem Austausch des NPCs im Devtool nicht auf eine andere Person übertragen wird.

## InspectionProfile

Das InspectionProfile beschreibt den Prüfaufwand, nicht körperliche Gefahr:

```js
{
  complexityLevel: 3,
  deceptionRisk: 0.4,
  focusAreas: [
    "identity_check",
    "document_consistency"
  ]
}
```

### `complexityLevel`

Bewertet die Anzahl und Tiefe notwendiger Prüfschritte:

```text
1 = Routineprüfung
2 = einzelne zusätzliche Kontrolle
3 = mehrere Datenabgleiche
4 = Datenbank- oder Fahndungsbezug
5 = komplexer Fall mit mehreren Prüfbereichen
```

### `deceptionRisk`

Beschreibt das erwartete Risiko bewusster oder relevanter Widersprüche. Es ist kein Beweis für eine Straftat.

### `focusAreas`

Fokusbereiche können kombiniert werden. Das Devtool leitet Komplexität und Täuschungsrisiko aus der Auswahl ab.

Beispiele:

```js
["routine_documents"]
["vehicle_documents", "address_consistency"]
["identity_check", "wanted_database", "document_consistency"]
```

## lil-gui und Debugging

Das Devtool kann gezielt folgende Fälle erzeugen:

- Zivilist
- unbekannter Straftäter
- bekannter Straftäter
- gesuchter Straftäter

Bei datenbankgestützten Typen erscheint ein zusätzliches Dropdown:

```text
Datenbank-NPC
  -> Zufälliger passender NPC
  -> konkrete Namen aus der Criminal Database
```

Die Optionen werden gefiltert:

- `knownOffender` zeigt nur nicht aktiv gesuchte NPCs.
- `wantedOffender` zeigt nur NPCs mit aktivem Wanted Record.
- Zivilisten und unbekannte Täter benötigen keine Datenbankidentität.

Beim Wechsel eines bereits angehaltenen NPCs wird eine vollständige neue Traffic-Konstellation erzeugt. Position, Stop-Zustand und TrafficEntity-ID bleiben bestehen.

Zusätzlich gibt es zwei getrennte Aktionen:

```text
Auf angehaltenen NPC anwenden
Spawn NPC an Station
```

`Spawn NPC an Station` erzeugt eine neue TrafficEntity.

`Auf angehaltenen NPC anwenden` erzeugt aus allen aktuellen Controls eine neue Testkonstellation für die ausgewählte angehaltene TrafficEntity. Der Button ist deaktiviert, solange kein angehaltener NPC ausgewählt ist.

## Generierungsablauf

```text
generateTrafficEntity
  -> pickTrafficEntityType
  -> passende Factory

Factories:
  -> createCivilianTrafficEntity
  -> createUnknownOffenderTrafficEntity
  -> createKnownOffenderTrafficEntity
  -> createWantedOffenderTrafficEntity

Database Factory:
  -> gültige NPC-Kandidaten ermitteln
  -> optionale konkrete Devtool-ID prüfen
  -> NPC-Profil aus npcsById laden
  -> bei wanted den aktiven Wanted Record laden

Jede Factory:
  -> Fahrer oder Datenbankidentität bestimmen
  -> truth, police und inspectionProfile festlegen
  -> assembleTrafficEntity aufrufen

assembleTrafficEntity:
  -> Fahrzeughalter bestimmen
  -> Fahrzeug mit registeredOwnerNpcId erzeugen
  -> documentState erzeugen
  -> presented erzeugen
  -> Traffic-, NPC- und Fahrzeugreferenzen zusammensetzen

unknownOffender nach dem Assemblieren:
  -> neue NPC- und Crime-Records in worldTruthDatabase registrieren
  -> temporäres Record-Paket aus der TrafficEntity entfernen
  -> nur crimeRecordIds in truth behalten
```

## Garantierte Beziehungen

Für einen `knownOffender` gilt:

```text
npcId === police.databaseNpcId
police.wantedRecordId === null
police.status === "known"
```

Für einen `wantedOffender` gilt:

```text
npcId === police.databaseNpcId
wantedRecordsById[police.wantedRecordId].npcId === npcId
police.status === "wanted"
```

Für jedes Fahrzeug gilt:

```text
vehicleProfile.real.registeredOwnerNpcId
  === ownership.registeredOwnerNpcId

vehicleOwnerProfile.real.npcId
  === ownership.registeredOwnerNpcId
```

Diese Beziehungen sind die Grundlage für spätere Datenbankabgleiche und dokumentbasierte Entscheidungen.
