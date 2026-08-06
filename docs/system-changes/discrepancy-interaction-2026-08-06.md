# Technische Aenderungen: Diskrepanzinteraktion

Stand: 06.08.2026

Branch: `codex/control-session-phase-2`

## Ersetzt

Der modale Katalog `Feststellungen markieren` und seine frei waehlbaren Checkboxen
wurden entfernt. Ebenso entfallen `PLAYER_SELECTABLE_FINDINGS` und die Store-Aktion
`toggleFinding`.

Findings entstehen nun ueber eine konkrete Feldauswahl oder, wie bisher bei einer
Fahndung, ueber die bewusste Abschlussentscheidung.

## Session-Erweiterung

`createInspectionSession` enthaelt neu:

```js
{
    discrepancyMode: {
        active,
        selectedFields,
        feedback,
        isResolving
    },
    conversationEntries: []
}
```

Der Store bietet getrennte Aktionen fuer Start, Abbruch, Zwischenauswahl und das
atomare Speichern einer bestaetigten Diskrepanz mit Dialogeintrag.

## Datengetriebene Felder

`discrepancyFieldDefinitions.js` beschreibt jedes interaktive Dokument- und
Registerfeld ueber:

- stabile `fieldId`
- Dokumenttyp und sichtbares Label
- Einzelfeld- oder Zweifeldmodus
- optionale Vergleichsgruppe
- bestehende Finding-ID
- Quelle des amtlichen Erwartungswerts
- Oberflaeche und bei Laptopfeldern die erwartete Record-Relation

Die Dokumentkomponenten enthalten dadurch keine Auswertungslogik. Sie weisen ihren
sichtbaren Werten nur eine `fieldId` und bei formatierten Daten einen unveraenderten
`selectionValue` zu.

## Gemeinsame Interaktionsgrenze

Der zuvor dokumentlokale Context wurde durch `InspectionFieldInteractionProvider`
ersetzt. Er umschliesst in `App` sowohl `DocumentManager` als auch `LaptopScreen`.
Auswahl, Resolveraufruf, Sessionfeedback und Dialogerzeugung existieren damit nur
noch einmal und sind nicht in die Police-Laptop-Komponenten kopiert.

`DataField` im Laptop nutzt denselben Feld-Hook wie `BaseHeadlineWithText` in den
Dokumenten. Im aktiven Modus werden konfigurierte Werte zu semantischen Buttons mit
Auswahl-, Kompatibilitaets- und Fokuszustand.

## Resolver

`resolveDiscrepancySelection` ist eine reine Funktion. Sie liefert einen von vier
Zustaenden:

- `waiting_for_second_field`
- `incompatible_fields`
- `no_discrepancy`
- `discrepancy_found`

Paarvergleiche pruefen zuerst die sichtbaren Werte und bestaetigen danach, welches
betroffene Dokument vom amtlichen Record abweicht. Dadurch wird ein legaler fremder
Fahrzeughalter nicht als Identitaetsfehler bewertet.

Laptopfelder uebergeben zusaetzlich ihre Record-ID. Der Resolver akzeptiert einen
Registervergleich nur, wenn diese ID zur kontrollierten Fahrer-, Fahrzeughalter-,
Fahrzeug- oder Versicherungsrelation passt. Blindes Oeffnen fremder Akten erzeugt
dadurch kein Finding.

## Dokument-UI

Ein React Context verbindet alle geoeffneten Dokumente mit dem Sessionzustand.
`BaseHeadlineWithText` rendert nur im aktiven Fokusmodus ein interaktives Feld.
Auswahl und Kompatibilitaet erhalten eigene visuelle Zustaende.

`BaseDocument` besitzt zusaetzlich:

- einen erhoehten Layer im Fokusmodus,
- `data-document-type` fuer eindeutige UI-Tests,
- weiterhin getrennte Drag- und Schliessen-Interaktionen.

Die Dokumentbuttons wurden in `DocumentConversation` oberhalb des Verlaufs
verschoben. Bestaetigte Diskrepanzen werden als strukturierte Gespraechseintraege
gerendert.

## Stabiler Aktionsdock

Die bisherige breite Kontrollleiste am oberen Bildschirmrand wurde entfernt.
`InspectionWorkspace` rendert stattdessen links neben der Gespraechsbox einen
kompakten Dock mit:

- Kontrolldauer und Uhr-Icon
- quadratischem Diskrepanzbutton mit Warnsymbol, aktivem Zustand und Finding-Badge
- quadratischem Abschlussbutton mit Clipboard-Icon

Auf kleineren Viewports wechselt der Dock automatisch in eine horizontale Position
oberhalb der Gespraechsbox. Entscheidungs- und Ergebnisdialoge besitzen eine eigene
hoehere Ebene und bleiben dadurch auch im Laptopmodus sichtbar.

## Laptop- und Layerstruktur

`InspectionWorkspace` wird nun unabhaengig vom groben `gameState` gerendert. Damit
bleiben Sessionaktionen beim Wechsel zwischen Spielwelt und Laptop erhalten.

Die Oberflaechen verwenden folgende fachliche Ebenen:

```text
Police Laptop              8000
Diskrepanz-Overlay         7900 im Laptop / 8500 in der Spielwelt
Geoeffnete Dokumente       9000
Gespraechsbox              9500
Kontrollaktionsdock        9700
Entscheidungsdialoge      13000
```

Der Laptop wurde dadurch von einem alles ueberdeckenden Modal zu einer
Arbeitsflaeche unterhalb der Dokumente. Die Dokumentkomponenten werden beim
Laptopwechsel nicht demontiert; Position und Auswahl bleiben stabil.

## Debug-Werkzeuge

Die Buttons fuer Fahrerprofil und Polizei-Datenbank-Debug wurden von der rechten
Fahrzeugseite in eine eigene graue Iconleiste direkt ueber `Dienstwerkzeuge`
verschoben. `FaBug` und `FaDatabase` ersetzen die Textbuttons. Blau kennzeichnet
nur das aktuell geoeffnete Debugfenster. Die Debugfenster oeffnen oberhalb der
Werkzeugpanels, aber bewusst unterhalb des spielbaren Police Laptops.

Der Laptopbutton in `Dienstwerkzeuge` verwendet nun ebenfalls ein eindeutiges
Laptop-Icon. Dadurch bleibt der spielbare Laptop klar vom Datenbank-Debug getrennt.

## Dialog-Provider

`createDiscrepancyDialogueTurn` baut einen fachlichen Dialogkontext und ruft einen
Provider ueber `await provider.respond(context)` auf. Der mitgelieferte
`scriptedNpcDialogueProvider` besitzt feste Antworten, ist aber kein Bestandteil
der UI. Ein spaeterer regelbasierter oder KI-gestuetzter Provider kann ihn ersetzen.

## Generator-Anpassung

Das Szenario `forged_identity` setzt nun `forcedDriverIsRegisteredOwner: true`.
Dies stellt fuer Namen und Adresse ein gueltiges zweites Dokumentfeld bereit. Die
allgemeine Fahrzeughalter-Generierung bleibt fuer alle anderen Szenarien unveraendert.

## Tests

Neu geprueft werden:

- Ablaufdatum als Einzelfeld
- Warten auf ein zweites kompatibles Feld
- inkompatible Feldkombinationen
- bestaetigte Namensabweichung
- legal abweichender Fahrzeughalter
- Registerabgleich eines Geburtsdatums
- Sessionzustand vor und nach einer bestaetigten Diskrepanz
- austauschbarer asynchroner Dialog-Provider

Der interaktive Browsertest deckte zusaetzlich Dokumentanforderung, Fokus-Overlay,
Einzelfeld-Finding, Dialogausgabe, einen gueltigen Zweifeldvergleich, die neue
Debugposition und die gemeinsame Laptop-/Dokument-Arbeitsflaeche ab.
Zusaetzlich wurden Kennzeichensuche, Fahrzeugakte sowie die Auswahl desselben
Ausstellungsdatums in Register und Fahrzeugschein ohne falsches Finding geprueft.
