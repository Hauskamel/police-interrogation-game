# Technische Aenderungen: Funkabfragen

Stand: 06.08.2026

Branch: `codex/control-session-phase-2`

## Ersetzt

Das alte, lokale Funkgeraet-Popup mit den statischen englischen Menuepunkten wurde
vollstaendig entfernt. Dazu gehoeren `PoliceRadio`, `Display`, `RadioOption` und
`policeRadioMenuContent`.

Im Panel `Dienstwerkzeuge` verbleiben Police Laptop und Handbuch. Die spielbare
Funkabfrage befindet sich als quadratischer Iconbutton im Kontrollaktionsdock.

## Sessionzustand

Die Kontrollsession enthaelt neu:

```js
{
    radioInquiryMode: {
        active,
        selectedField,
        feedback,
        isResolving
    },
    dispatchConversationEntries: []
}
```

Diskrepanz- und Funkmodus schliessen sich gegenseitig aus. Funksprueche werden
getrennt vom Fahrerdialog gespeichert. Ein optional belegtes Finding wird atomar
mit der Zentralenantwort in die Session geschrieben.

## Feldkonfiguration

`radioInquiryFieldDefinitions.js` legt fuer jedes abfragbare Dokumentfeld fest:

- sichtbares Funklabel
- freigegebener Registertyp
- Property-Pfad innerhalb des Registerrecords
- Datumsformatierung
- optionales Finding bei negativer oder abgelaufener Auskunft

Laptopfelder werden im Funkmodus nicht interaktiv. Der Spieler gibt immer eine
sichtbare Angabe des vorgelegten Dokuments durch.

## Resolver

`resolveRadioInquiry` erhaelt nur:

- markiertes Feld
- `officialRegistry`
- `criminalDatabase`
- Kontrollzeitpunkt

Die Funktion bekommt weder TrafficEntity noch World Truth. Dadurch kann eine
Zentralenantwort technisch keine verborgenen NPC- oder Faelschungsinformationen
verraten.

Positive eindeutige Treffer werden relational zu Person, Halter oder Fahrzeug
aufgeloest. Mehrere Treffer bleiben neutral. Nur eindeutig pruefbare negative
Kennungen und abgelaufene Datensaetze liefern ein Finding.

## Gespraechsoberflaeche

`DocumentConversation` verwaltet die Reiter `Fahrer` und `Zentrale`. Reiter koennen
geschlossen und wieder geoeffnet werden. Das Schliessen betrifft nur die sichtbare
UI; die Verlaeufe bleiben in der Kontrollsession bestehen.

Der Funkmodus oeffnet und aktiviert den Zentralenreiter. Nach der Feldauswahl wird
der Modus beendet, waehrend die Antwort sichtbar bleibt.

## Tests

Automatisch geprueft werden:

- positive Zulassungsnummer mit Fahrzeug und Halter
- unbekannte Zulassungsnummer mit Finding
- mehrdeutiger Personenname ohne Finding
- registrierter, aber abgelaufener Fuehrerschein
- getrennte Fahrer- und Zentralenverlaeufe
- gegenseitiger Ausschluss der beiden Feldmodi

Der Browsertest deckte ausserdem Dokumentanforderung, Funkstart, automatische
Tabauswahl, dynamischen Funkspruch, Registerantwort sowie Schliessen und erneutes
Oeffnen des Zentralenreiters ab.
