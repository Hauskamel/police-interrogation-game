# Dokumentanforderung im Fahrergespräch

Stand: 04.08.2026

## Ziel

Die Kontrollsession Phase 1 besitzt jetzt einen ersten direkten Gesprächsschritt.
Der Spieler öffnet Dokumente nicht mehr über globale Schnellbuttons, sondern fordert
sie beim kontrollierten Fahrer an.

Ein vollständiges Dialogsystem ist weiterhin nicht Bestandteil von Phase 1. Der NPC
führt alle drei Dokumente mit und zeigt sie ohne Verweigerung unmittelbar vor.

## Oberfläche

Während einer aktiven Kontrolle erscheint unten rechts eine breite Gesprächsbox. Die
erhöhte Gesprächsfläche bietet genug Platz für mehrere Aussagen und enthält:

- den bisherigen Gesprächsverlauf,
- Aussagen des Spielers,
- knappe Antworten des Fahrers,
- die drei verfügbaren Dokumentfragen.

Angefordert werden können:

- Führerschein,
- Fahrzeugpapiere,
- Versicherungsnachweis.

Ein sichtbares Dokument kennzeichnet die jeweilige Auswahl als geöffnet. Wird das
Dokument über seinen eigenen Schließen-Button geschlossen, bietet die Gesprächsbox
anschließend `erneut ansehen` an.

Die bisherige `DocumentBar` unten rechts wurde vollständig entfernt. Dadurch gibt es
nur noch einen fachlich eindeutigen Weg, Dokumente zu erhalten.

## Session-Modell

Die Kontrollsession enthält zusätzlich:

```js
requestedDocuments: []
```

Die Store-Aktion `requestDocument(documentType)` aktualisiert atomar:

```text
requestedDocuments
openedDocuments
visibleDocuments
```

Alle drei Listen enthalten einen Dokumenttyp höchstens einmal. Eine erneute Anfrage
öffnet ein geschlossenes Dokument wieder, ohne den Gesprächs- oder Prüfverlauf zu
duplizieren.

`closeDocument(documentType)` entfernt ausschließlich den sichtbaren Zustand. Die
Anfrage und die erfolgte Prüfung bleiben erhalten.

## Vorbereitung für Phase 2

Die Dokumentanforderung ist jetzt ein eigener fachlicher Spielerschritt. Phase 2 kann
darauf aufbauen und vor dem Öffnen des Dokuments beispielsweise entscheiden:

- Dokument wird vorgezeigt,
- Dokument wurde vergessen,
- NPC besitzt kein Dokument,
- NPC verweigert die Herausgabe.

Diese späteren Zustände erfordern keine erneute Umstellung der Benutzerführung oder
des grundlegenden Session-Ablaufs.

## Layout-Aktualisierung vom 10.08.2026

Die Gesprächsbox besitzt keine feste Gesamthöhe mehr. Der Gesprächsverlauf wächst
dynamisch von mindestens drei Textzeilen bis zu einer maximalen Boxhöhe von `50vh`
und scrollt danach intern. Neue Antworten werden automatisch sichtbar gehalten.

Reiter, Dokumentaktionen und Gesprächsoptionen liegen außerhalb des scrollenden
Textbereichs und behalten ihre Höhe. Dokumente werden als quadratische Icon-Buttons
mit Tooltip und zugänglichem Namen dargestellt. Die Dokument- und Fragenleisten
bleiben einzeilig und können bei geringerer Breite horizontal bedient werden.
