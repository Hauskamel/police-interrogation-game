# Spielsystem: NPC-Generierung

Stand: 2026-07-26

Dieses Dokument beschreibt das Spielsystem hinter der NPC-Generierung. Es erklärt nicht primär, welche Dateien geändert wurden, sondern wie NPCs im Spiel gedacht sind und wie die einzelnen Teile zusammenspielen.

## Ziel des Systems

Das Spiel soll kein Action-Polizeimodus sein. Der Fokus liegt auf:

- Dokumente prüfen
- Widersprüche finden
- Datenbankinformationen vergleichen
- Straftaten aufdecken
- gesuchte Personen erkennen
- unbekannte Täter über Hinweise identifizieren

NPCs sollen deshalb nicht einfach nur "gut" oder "kriminell" sein. Wichtiger ist die Trennung zwischen:

```text
Was ist wirklich wahr?
Was sieht der Spieler?
Was weiß die Polizei?
Was muss geprüft werden?
```

## Die wichtigsten Begriffe

### NPC

Ein NPC ist die Person selbst.

Er hat:

- Name
- Geburtsdatum
- Alter
- Adresse
- Aussehen
- Führerscheindaten
- später Beruf, Tagesablauf, Beziehungen und Wissen

Ein NPC kann existieren, ohne gerade in der Welt gespawned zu sein.

### Vehicle

Ein Vehicle ist das Fahrzeug selbst.

Es hat:

- Marke
- Modell
- Kennzeichen
- Registriernummer
- Baujahr
- Gewicht
- GLB-Modell
- Fahrzeugdokumentdaten

Ein Fahrzeug ist nicht automatisch identisch mit der TrafficEntity. Es ist nur ein Teil davon.

### TrafficEntity

Eine TrafficEntity ist die konkrete aktive Situation in der Welt:

```text
Dieser NPC fährt gerade mit diesem Fahrzeug auf dieser Spur.
```

Sie verbindet:

- NPC
- Fahrzeug
- Spawn-Daten
- Polizeiwissen
- Wahrheit
- Dokumentzustand
- Prüfprofil

Darum besitzt sie eigene IDs:

| ID | Bedeutung |
|---|---|
| `npcId` | echte Personenidentität |
| `vehicleId` | echtes Fahrzeug |
| `trafficEntityId` | konkrete Begegnung/Spawn-Situation |

Das ist wichtig, weil später möglich sein soll:

- derselbe NPC fährt ein anderes Fahrzeug
- ein Fahrzeug gehört jemand anderem
- ein NPC existiert in der Datenbank, ist aber nicht gespawned
- ein unbekannter Täter taucht zufällig im Verkehr auf

## `real` und `presented`

Jedes NPC- und Fahrzeugprofil besteht aus:

```js
{
  real: {},
  presented: {}
}
```

### `real`

`real` ist die interne Wahrheit.

Das Spiel weiß diese Daten immer. Der Spieler sieht sie aber nicht automatisch.

Beispiele:

```js
driverProfile.real.firstName
driverProfile.real.birthDate
driverProfile.real.address
vehicleProfile.real.plateNumber
```

### `presented`

`presented` ist das, was der NPC vorzeigt oder was auf Dokumenten steht.

Dokumente lesen immer aus `presented`, nicht aus `real`.

Im Normalfall ist `presented` eine Kopie von `real`. Wenn der `documentState` aber eine bewusste Dokumentmanipulation beschreibt, werden gezielt einzelne sichtbare Felder in `presented` verändert.

Zum Beispiel:

```text
real.address      = "Mühlenweg 12"
presented.address = "Bahnhofstraße 4"
```

Dann kann der Spieler diesen Widerspruch über Dokumente, Datenbank oder Gespräch entdecken.

## Warum nicht `fakeProfile`?

`fakeProfile` klingt so, als wäre das gesamte Profil gefälscht.

Für dieses Spiel ist das zu grob.

Ein NPC kann komplett echt sein, aber nur ein einzelnes Dokument kann falsch sein:

- falsche Adresse im Führerschein
- falsches Kennzeichen im Fahrzeugschein
- abgelaufene Versicherung
- Fahrzeugpapiere gehören zu einem anderen Auto
- Bild stimmt, aber Geburtsdatum nicht

Darum ist `presented` besser. Es beschreibt einfach:

```text
Das sind die aktuell vorgezeigten Daten.
```

Ob diese Daten echt oder falsch sind, entscheidet nicht `presented` selbst, sondern der separate `documentState`.

## `documentState`

`documentState` beschreibt den Zustand der vorgezeigten Dokumente einer TrafficEntity.

Er beantwortet Fragen wie:

- Ist ein Dokument unverändert?
- Ist ein Dokument bewusst manipuliert?
- Welche Felder wurden verändert?
- Wie könnte der Spieler die Abweichung entdecken?

Beispiel:

```js
documentState: {
  hasForgery: true,
  npcDocuments: {
    driversLicense: {
      integrity: "forged",
      forgeryType: "wrong_address",
      affectedFields: ["address"],
      detectableBy: ["compare_with_database", "ask_address_question"]
    }
  },
  vehicleDocuments: {
    registration: {
      integrity: "valid",
      forgeryType: null,
      affectedFields: [],
      detectableBy: []
    }
  }
}
```

Dadurch bleibt die Verantwortung sauber getrennt:

```text
real          -> was wirklich stimmt
presented     -> was der Spieler sieht
documentState -> warum sichtbare Daten abweichen
```

## NPC-Kategorien im aktuellen System

Aktuell gibt es drei aktive Traffic-Typen.

### `civilian`

Ein normaler Verkehrsteilnehmer.

Eigenschaften:

```js
truth.role = "civilian"
police.status = "unknown"
crimeRecordIds = []
```

Ein Zivilist ist nicht automatisch langweilig. Er kann trotzdem kleine Prüfauffälligkeiten haben:

- abgelaufenes Dokument
- alte Adresse
- unklare Halterdaten
- Routinekontrolle

Diese Auffälligkeiten werden über das `inspectionProfile` vorbereitet.
Bewusste Dokumentmanipulationen sind bei Zivilisten selten, aber möglich.

### `knownWanted`

Ein bekannter gesuchter NPC.

Eigenschaften:

```js
truth.role = "criminal"
police.status = "wanted"
police.knownToPolice = true
```

Dieser NPC kommt aus der Criminal Database. Er wird also nicht in dem Moment komplett neu erfunden, sondern aus bestehenden Daten gezogen.

Spielerisch bedeutet das:

- Identität prüfen
- Datenbankabgleich machen
- bekannte Straftaten erkennen
- Dokumente gegen Polizeidaten vergleichen
- bewusst manipulierte Dokumente erkennen

### `unknownOffender`

Ein unbekannter Täter.

Eigenschaften:

```js
truth.role = "criminal"
police.status = "unknown"
police.knownToPolice = false
```

Das Spiel weiß intern, dass der NPC Straftaten begangen hat. Die Polizei weiß es aber noch nicht.

Das ist ein wichtiger Typ für Ermittlungen:

- Der Spieler erkennt vielleicht Widersprüche.
- Dokumente können zur Verschleierung manipuliert sein.
- Später können Beweise oder Hinweise diesen NPC belasten.
- Aus einem unbekannten Täter kann ein Verdächtiger werden.
- Aus einem Verdächtigen kann ein gesuchter Täter werden.

## Wahrheit vs. Polizeiwissen

Das System trennt bewusst:

```js
truth
police
```

### `truth`

`truth` beschreibt, was wirklich stimmt:

```js
truth: {
  role: "criminal",
  crimeRecordIds: ["crime--123"],
  caseIds: [],
  hiddenCrimeRecords: []
}
```

### `police`

`police` beschreibt, was Polizei/Datenbank aktuell wissen:

```js
police: {
  status: "unknown",
  knownToPolice: false,
  wantedLevel: 0
}
```

Dadurch kann eine Person intern Täter sein, ohne gesucht zu werden.

Das ist zentral für ein Ermittlungs- und Kontrollspiel.

## InspectionProfile

Jede TrafficEntity enthält ein `inspectionProfile`.

Es beschreibt, worauf die Kontrolle spielerisch abzielt.

```js
inspectionProfile: {
  complexityLevel: 1,
  deceptionRisk: 0.05,
  focusAreas: ["routine_documents", "expired_dates"]
}
```

### `complexityLevel`

Beschreibt, wie aufwendig die Kontrolle ungefähr ist.

```text
1 = einfache Routinekontrolle
2 = kleine Auffälligkeit möglich
3 = mehrere Datenpunkte prüfen
4 = komplexe Kontrolle mit Datenbank-/Fallbezug
```

Das ist kein Gefahrenwert. Es geht um Prüfaufwand.

### `deceptionRisk`

Beschreibt, wie wahrscheinlich sichtbare Unstimmigkeiten oder Täuschungen sind.

Bei Zivilisten bedeutet das nicht automatisch "kriminell". Es kann auch einfach sein:

- altes Dokument
- abgelaufene Frist
- falsche oder veraltete Adresse
- unstimmige Fahrzeugdaten

### `focusAreas`

Beschreibt, worauf der Spieler achten soll.

Beispiele:

```js
["routine_documents"]
["routine_documents", "expired_dates"]
["identity_check", "wanted_database"]
["inconsistencies", "vehicle_documents", "behavior"]
```

`focusAreas` sind noch keine fertige Gameplay-Mechanik. Sie sind aber ein guter Anknüpfungspunkt für spätere UI, Dialoge, Dokumentfehler und Fallakten.

## Warum haben Zivilisten `civilianInspectionProfiles`?

Zivilisten sollen nicht alle identisch wirken.

Darum gibt es eine kleine Liste möglicher Routinekontrollen:

```js
[
  {
    complexityLevel: 1,
    deceptionRisk: 0,
    focusAreas: ["routine_documents"]
  },
  {
    complexityLevel: 1,
    deceptionRisk: 0.05,
    focusAreas: ["routine_documents", "expired_dates"]
  },
  {
    complexityLevel: 2,
    deceptionRisk: 0.1,
    focusAreas: ["routine_documents", "address_consistency"]
  }
]
```

Das bedeutet:

- Die meisten Zivilisten sind echte Routinefälle.
- Manche haben kleine Auffälligkeiten.
- Nicht jede Auffälligkeit ist eine Straftat.

Bei `knownWanted` und `unknownOffender` ist das `inspectionProfile` aktuell direkt im jeweiligen Generator gesetzt, weil diese Typen schon einen klareren Prüf-Fokus haben.

Langfristig könnte das vereinheitlicht werden:

```text
traffic/inspection/
  getCivilianInspectionProfile.js
  getKnownWantedInspectionProfile.js
  getUnknownOffenderInspectionProfile.js
```

Dann wäre die Struktur noch lesbarer.

## Generierungsablauf

Der normale Ablauf:

```text
useTrafficEntitySpawner
  -> erzeugt in einem Intervall einen neuen Spawn
  -> ruft generateTrafficEntity

generateTrafficEntity
  -> pickTrafficEntityType
  -> createCivilianTrafficEntity
     oder createKnownWantedTrafficEntity
     oder createUnknownOffenderTrafficEntity

create...TrafficEntity
  -> erzeugt/holt NPC
  -> erzeugt Fahrzeug
  -> setzt truth
  -> setzt police
  -> setzt inspectionProfile
  -> ruft createTrafficEntity

createTrafficEntity
  -> vergibt trafficEntityId
  -> vergibt vehicleId
  -> verbindet NPC, Fahrzeug und Spielzustand

TrafficStore
  -> speichert die aktive TrafficEntity
```

## Dokumentenfluss

Dokumente bekommen von der ausgewählten TrafficEntity:

```js
selectedTrafficEntity.driverProfile
selectedTrafficEntity.vehicleProfile
```

Sie lesen daraus:

```js
driverProfile.presented
vehicleProfile.presented
```

Das ist absichtlich so.

Dokumente zeigen nicht die Wahrheit. Sie zeigen, was vorgelegt wird.

## Beispiel: Normaler Zivilist

```js
{
  trafficType: "civilian",
  driverProfile: {
    real: { firstName: "Jonas", address: "Aachener Straße 12" },
    presented: { firstName: "Jonas", address: "Aachener Straße 12" }
  },
  vehicleProfile: {
    real: { plateNumber: "AC - AB 123" },
    presented: { plateNumber: "AC - AB 123" }
  },
  truth: {
    role: "civilian",
    crimeRecordIds: []
  },
  police: {
    status: "unknown",
    knownToPolice: false
  },
  inspectionProfile: {
    complexityLevel: 1,
    deceptionRisk: 0,
    focusAreas: ["routine_documents"]
  }
}
```

## Beispiel: Unbekannter Täter

```js
{
  trafficType: "unknownOffender",
  truth: {
    role: "criminal",
    crimeRecordIds: ["crime--abc"],
    hiddenCrimeRecords: [{ id: "crime--abc", type: "burglary" }]
  },
  police: {
    status: "unknown",
    knownToPolice: false
  },
  inspectionProfile: {
    complexityLevel: 2,
    deceptionRisk: 0.35,
    focusAreas: ["inconsistencies", "vehicle_documents", "behavior"]
  }
}
```

## Design-Hintergedanke

Das System ist so gebaut, damit später folgende Gameplay-Momente möglich sind:

- Der Spieler sieht Dokumente, aber nicht automatisch die Wahrheit.
- Ein NPC kann unschuldig sein, aber trotzdem kleine Dokumentprobleme haben.
- Ein Täter kann unbekannt sein und erst durch Hinweise auffallen.
- Ein gesuchter NPC kann über Datenbankabgleich erkannt werden.
- Dokumentmanipulationen verändern nur `presented`, ohne das restliche System umzubauen.

Kurz gesagt:

```text
real = Wahrheit
presented = sichtbare Daten
truth = interne Rolle und echte Verbrechen
police = Polizeiwissen
inspectionProfile = worauf die Kontrolle spielerisch abzielt
TrafficEntity = aktive Kontroll-/Verkehrssituation
```
