# Technische Änderungen: Police-Laptop-Prototyp

Datum: 2026-07-30

## Zusammenfassung

Der vorhandene Police Laptop wurde von einer Platzhalter-Navigation zu einer
spielbaren Polizei-Anwendung ausgebaut. Zusätzlich wurde die relationale
`criminalDatabase` um ein Fahrzeugregister erweitert, damit Personen-,
Führerschein- und Kennzeichensuche konsistente Datensätze liefern.

## Police Laptop

### Navigation

Die indexbasierte Navigation mit leeren Platzhaltern wurde durch benannte Ansichten
ersetzt:

- `home`
- `database`

Die Menüelemente sind jetzt semantische Buttons mit aktivem Zustand, Icons und
zugänglichen Beschriftungen. Ein eigener Button schließt den Laptop und setzt das
Spiel zurück in den `INGAME`-Modus.

### Startseite

Die neue Startseite zeigt:

- Anzahl polizeibekannter Personen
- Anzahl aktiver Fahndungen
- Anzahl registrierter Fahrzeuge
- Hinweis auf die Informationsgrenze der Anwendung
- direkten Einstieg in die Datenbanksuche

Die Werte werden ausschließlich aus `useNpcStore().criminalDatabase` gelesen.

### Datenbankansicht

Neu hinzugefügt wurden:

- Personensuche
- Führerscheinsuche
- Kennzeichensuche
- Fahndungsliste
- Personenakte
- Fahrzeugakte
- Fahndungsakte
- Anzeige bekannter Straftaten
- leere Zustände und fehlende Datensatzreferenzen

Die Ergebnisliste und die Detailansicht sind als Master-Detail-Oberfläche aufgebaut.
Auf schmaleren Ansichten werden beide Bereiche untereinander dargestellt.

### Suchlogik

Die Such- und Relationsfunktionen liegen getrennt von den React-Komponenten in:

```text
police-laptop/
└── screen-components/
    └── database-screen/
        ├── PoliceDatabaseScreen.jsx
        └── policeDatabaseSearch.js
```

`policeDatabaseSearch.js` enthält reine Funktionen für:

- Personensuche
- Führerscheinsuche
- Fahrzeug- und Kennzeichensuche
- aktive Fahndungen
- Straftat-Relationsauflösung
- Fahrzeug-Relationsauflösung
- Fahndungsstatus einer Person

Keine dieser Funktionen importiert oder liest `worldTruthDatabase`.

## Relationale Fahrzeugdaten

`criminalDatabase` enthält neu:

```js
{
    vehiclesById: {},
    vehicleIds: []
}
```

Beim Generieren eines Datenbank-NPCs wird ein kanonisches registriertes Fahrzeug
erzeugt. Der NPC verweist mit `vehicleIds` auf dieses Fahrzeug. Das Fahrzeug
verweist mit `registeredOwnerNpcId` zurück auf den NPC.

Es werden nur reale Registerdaten gespeichert. Ein `presented`-Profil wird nicht in
die Polizeidatenbank geschrieben.

## Traffic-Anbindung

Bekannte und gesuchte Täter lösen ihr registriertes Datenbank-Fahrzeug über die
gemeinsame Utility `getRegisteredVehicleRecord` auf.

`assembleTrafficEntity` kann dafür optional ein bestehendes `baseVehicleProfile`
erhalten. Fehlt ein registriertes Fahrzeug, bleibt der bisherige sichere Fallback
erhalten und der Assembler generiert ein neues Fahrzeug.

`createVehicleProfileFromReal` bereitet einen kanonischen Fahrzeugrecord für die
Dokumentmanipulation einer konkreten Kontrolle auf:

```js
{
    real,
    presented
}
```

Erst danach darf `createPresentedProfiles` kontrollspezifische Abweichungen erzeugen.
Die Polizeidatenbank selbst bleibt unverändert.

## Bereinigte Duplikation

Die identische Auflösung registrierter Fahrzeuge war zunächst in
`createKnownOffenderTrafficEntity` und `createWantedOffenderTrafficEntity`
enthalten. Sie wurde in folgende gemeinsame Utility verschoben:

```text
src/game/traffic/utils/getRegisteredVehicleRecord.js
```

Beide Factories verwenden damit dieselbe Relationslogik.

## Geänderte Struktur

```text
src/
├── game/
│   ├── crimes/generators/
│   │   └── criminalDatabaseGenerator.js
│   ├── police/components/police-laptop/
│   │   ├── LaptopScreen.jsx
│   │   └── screen-components/
│   │       ├── database-screen/
│   │       │   ├── PoliceDatabaseScreen.jsx
│   │       │   └── policeDatabaseSearch.js
│   │       ├── home-screen/
│   │       │   └── HomeScreen.jsx
│   │       └── laptop-menu/
│   │           ├── LaptopMenu.jsx
│   │           └── MenuListElement.jsx
│   ├── traffic/
│   │   ├── generators/
│   │   │   ├── assembleTrafficEntity.js
│   │   │   ├── createKnownOffenderTrafficEntity.js
│   │   │   └── createWantedOffenderTrafficEntity.js
│   │   └── utils/
│   │       └── getRegisteredVehicleRecord.js
│   └── vehicles/generators/
│       └── vehicleProfileGenerator.js
└── stores/
    └── npcStore.js
```

## Validierung

Folgende Abläufe wurden im laufenden Spiel geprüft:

- Police Laptop über das Polizeifahrzeug öffnen und schließen
- Datenbankansicht öffnen
- aktive Fahndung auswählen
- zugehörige Personenakte öffnen
- Person über vollständigen Namen finden
- dieselbe Person über Führerscheinnummer finden
- registriertes Fahrzeug über normalisiertes Kennzeichen finden
- Halterbeziehung in der Fahrzeugakte auflösen
- Layout bei Desktop- und schmalerer Fensterbreite prüfen
- Browser-Konsole auf Laufzeitfehler prüfen

Zusätzlich erfolgreich:

```text
npm run lint
npm run build
```

Der Vite-Build meldet weiterhin nur die bereits bekannte Warnung zur Größe des
Hauptbundles und eine Warnung zu `eval` in der externen `three-stdlib`-Abhängigkeit.
