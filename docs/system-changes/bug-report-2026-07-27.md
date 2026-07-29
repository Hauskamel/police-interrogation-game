# Bugreport vom 27.07.2026

## Zusammenfassung

Dieser Bericht dokumentiert die am 27.07.2026 geprüften Fehler und offenen Risiken.

Geprüfte Bereiche:

- NPC-Bildgenerierung und Bilddateien
- Fahreranzeige im Kontrollpanel
- Führerscheinanzeige
- Anhalten und Weiterfahren
- Traffic-Store und Auswahlzustand
- Fahrzeugprofilgenerator
- Police-Laptop und Verkehrsspawner
- ESLint und Produktions-Build

Ergebnis:

```text
5 Fehler behoben
5 funktionale Punkte offen
ESLint erfolgreich
Produktions-Build erfolgreich
NPC-Bilder im Browser erfolgreich geladen
```

## Behobene Fehler

### BUG-001: NPC-Bilder wurden im Kontrollpanel nicht mehr angezeigt

**Priorität:** Hoch  
**Status:** Behoben

#### Verhalten

Das NPC-Profil enthielt weiterhin einen gültigen Bildnamen und die Dateien lagen unter:

```text
public/images/driver/
```

Trotzdem wurde im Fahrzeugpanel kein Fahrerbild mehr angezeigt.

#### Ursache

`VehicleOccupantsPanel` konnte das Fahrerbild darstellen, wurde aber von keiner aktiven Komponente mehr gerendert.

#### Lösung

- Fahreranzeige in `VehicleControlPanel` integriert
- echtes Fahrerbild wird nach dem Anhalten angezeigt
- vorher wird `driver-unknown.jpg` angezeigt
- `BaseImage` besitzt jetzt einen Fallback für fehlende oder ungültige Bildreferenzen
- Bilder besitzen beschreibende `alt`-Texte

#### Prüfung

Im Browsertest wurden das Bild im Fahrzeugpanel und das Bild auf dem Führerschein vollständig geladen:

```text
naturalWidth: 1024
naturalHeight: 1024
```

### BUG-002: Aktionen waren vor dem Anhalten verfügbar

**Priorität:** Hoch  
**Status:** Behoben

#### Verhalten

Bei einem noch fahrenden Fahrzeug konnten gleichzeitig folgende Aktionen erscheinen:

```text
Anhalten
Weiterfahren
Verhaften
```

#### Ursache

Die Sichtbarkeitsbedingung prüfte nur, ob irgendein Fahrzeug angehalten war. Sie prüfte nicht zuverlässig, ob das ausgewählte Fahrzeug selbst angehalten war.

#### Lösung

- `Weiterfahren` erscheint nur beim ausgewählten angehaltenen Fahrzeug
- `Verhaften` erscheint nur beim ausgewählten angehaltenen Fahrzeug
- `Anhalten` erscheint nur, wenn noch keine andere Kontrolle aktiv ist
- bei einer bereits laufenden anderen Kontrolle wird ein eindeutiger Hinweis angezeigt

### BUG-003: Ausgewähltes Fahrzeug blieb nach dem Despawn im UI

**Priorität:** Mittel
**Status:** Behoben

#### Verhalten

Wenn ein ausgewähltes Fahrzeug die Welt verließ, wurde es aus `trafficEntities` entfernt. `selectedTrafficEntity` konnte jedoch weiterhin auf das entfernte Fahrzeug zeigen.

#### Auswirkung

Das Fahrzeugpanel konnte mit veralteten Daten geöffnet bleiben.

#### Lösung

`removeTrafficEntity` entfernt jetzt auch die Auswahl, wenn genau diese TrafficEntity despawned.

Zusätzlich aktualisiert `setTrafficEntityPosition` jetzt auch die ausgewählte Referenz. Debugpanel und Weltzustand bleiben dadurch synchron.

### BUG-004: Fahrzeugbaujahr war nicht zufällig

**Priorität:** Mittel  
**Status:** Behoben

#### Verhalten

Der Fahrzeuggenerator verwendete:

```js
Math.floor(Math.random())
```

`Math.random()` liefert einen Wert kleiner als `1`. Das Ergebnis von `Math.floor(...)` war deshalb immer `0`.

#### Auswirkung

Es wurde immer der erste Eintrag aus `yearOfConstructionRange` verwendet.

#### Lösung

Der zufällige Wert wird jetzt mit der Länge des Arrays multipliziert. Dadurch können alle hinterlegten Baujahre ausgewählt werden.

### BUG-005: Projektweiter Lint-Lauf war nicht verwendbar

**Priorität:** Mittel  
**Status:** Behoben

#### Ursachen

- ein normaler Helper hieß `useClosePanel` und wurde deshalb fälschlich als React Hook behandelt
- verschachtelte `dist`-Verzeichnisse wurden nicht ignoriert
- mehrere Dateien enthielten ungenutzte Imports oder Werte
- einzelne `useCallback`- und `useEffect`-Abhängigkeiten fehlten

#### Lösung

- Helper zu `closePanel` umbenannt
- ESLint ignoriert jetzt alle `dist`-Verzeichnisse
- ungenutzte Werte entfernt
- Hook-Abhängigkeiten ergänzt

#### Prüfung

```text
npm run lint
-> erfolgreich
```

## Offene Fehler und funktionale Lücken

### BUG-006: Normaler Verkehrsspawner ist nicht eingebunden

**Priorität:** Hoch  
**Status:** Offen

`useTrafficEntitySpawner` ist implementiert und exportiert, wird aber von keiner aktiven Komponente aufgerufen.

Aktuell können TrafficEntities zuverlässig über das lil-gui-Devtool erzeugt werden. Ein automatischer normaler Straßenverkehr entsteht über diesen Hook jedoch nicht.

**Empfehlung:** Den Spawner kontrolliert im Welt- oder Straßensystem einbinden und dabei maximale Fahrzeuganzahl, Fahrspur und Spawnintervall festlegen.

### BUG-007: Aktion „Verhaften“ besitzt keine Spiellogik

**Priorität:** Hoch  
**Status:** Offen

Der Button wird angezeigt, besitzt aber keinen `onClick`-Handler.

Der Store enthält bereits `arrestedNpcs`, aber noch keine Aktion zum Verhaften, keine Prüfung des Fahndungsstatus und keine Auswertung einer richtigen oder falschen Entscheidung.

**Empfehlung:** Erst zusammen mit dem geplanten Entscheidungs- und Auswertungssystem implementieren.

### BUG-008: Police-Laptop-Datenbank verwendet ein veraltetes Datenmodell

**Priorität:** Hoch  
**Status:** Offen

Die Datenbankseite im Police-Laptop ist derzeit deaktiviert. Ihre alten Komponenten erwarten unter anderem:

```text
entityProfile.driverProfile.real
entityProfile.driverProfile.crimeData
```

Die aktuelle Criminal Database verwendet dagegen Tabellen wie:

```text
npcsById
crimeRecordsById
wantedRecordsById
```

Würde die alte Seite unverändert aktiviert, käme es zu ungültigen Zugriffen.

**Empfehlung:** Die Laptop-Datenbank neu auf der aktuellen tabellenartigen Criminal Database aufbauen. Das vorhandene Debugpanel kann als Referenz dienen.

### BUG-009: Geschlecht und Namenspool können widersprüchlich sein

**Priorität:** Mittel  
**Status:** Offen

`faker.person.sexType('male')` erzwingt nicht zuverlässig den Wert `male`. Gleichzeitig enthält der eigene `firstNames`-Pool aktuell ausschließlich männliche Vornamen.

Dadurch können Geschlecht, Name und Bildauswahl fachlich nicht zusammenpassen.

**Empfehlung:** Entweder vorläufig ausschließlich männliche Profile erzeugen oder getrennte Namens- und Bildpools für alle unterstützten Geschlechter einführen.

### BUG-010: Versicherungsdokument ist nur ein Platzhalter

**Priorität:** Niedrig  
**Status:** Offen

Der Versicherungsnachweis zeigt derzeit lediglich Vor- und Nachname des Fahrers. Fahrzeug-, Versicherungs-, Halter- und Gültigkeitsdaten fehlen.

**Empfehlung:** Das Dokument erst erweitern, wenn festgelegt ist, ob Versicherungsnehmer, Fahrer und Fahrzeughalter getrennte Rollen sein sollen.

## Weitere bekannte Hinweise

Der Produktions-Build ist erfolgreich, meldet aber:

- `three-stdlib/libs/lottie.js` verwendet `eval`
- das Hauptbundle überschreitet Vites Warnschwelle von 500 kB

Diese Hinweise blockieren das Spiel aktuell nicht. Vor einem produktiven Release sollten Debugtools aus dem Produktionsbundle ausgeschlossen und größere Bereiche per Code-Splitting geladen werden.

## Abschließende Validierung

Durchgeführt:

```text
npm run lint
npm run build
Browser-Test mit Dev-Spawn
Bildprüfung im Fahrzeugpanel
Bildprüfung auf dem Führerschein
Kontrolle der sichtbaren Fahrzeugaktionen
```

Bestätigt:

- NPC-Bilder werden wieder angezeigt
- fehlende Bilder besitzen einen sicheren Fallback
- reale Fahreridentität wird erst nach dem Anhalten eingeblendet
- ungültige Kontrollaktionen werden nicht mehr vorzeitig angeboten
- Lint und Build laufen erfolgreich durch

