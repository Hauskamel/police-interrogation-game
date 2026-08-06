# Spielsystem: Funkabfragen an die Zentrale

Stand: 06.08.2026

## Ziel

Der Funk ist eine gezielte zweite Recherchequelle neben dem Police Laptop. Der
Spieler muss keine Nummern abtippen und keine Dialogoption aus langen Listen suchen.
Er markiert stattdessen genau die sichtbare Dokumentangabe, die er pruefen lassen
moechte.

```text
Dokument oeffnen
-> Funkabfrage aktivieren
-> ein Dokumentfeld markieren
-> Polizist gibt Feldname und sichtbaren Wert durch
-> Zentrale antwortet aus freigegebenen Registern
```

## Abgrenzung zum Police Laptop

Der Laptop bleibt die selbst bediente Suchoberflaeche fuer Personen-, Fuehrerschein-,
Kennzeichen- und Versicherungsabfragen. Der Funk bildet dagegen eine konkrete
Rueckfrage zu einem bereits sichtbaren Wert ab.

Beide Wege verwenden dieselbe Informationsgrenze:

- amtliche Personenrecords
- amtliches Fuehrerscheinregister
- amtliches Fahrzeug- und Zulassungsregister
- amtliches Versicherungsregister
- Polizeibekanntheit aus dem Polizeibestand

`worldTruthDatabase`, interne Faelschungsmetadaten und unbekannte Straftaten sind
fuer die Zentrale nicht erreichbar.

## Antworten

Eindeutige Kennungen liefern einen konkreten Datensatz. Eine gueltige
Zulassungsnummer kann beispielsweise Fahrzeug, Kennzeichen und Halter ergeben.
Eine unbekannte Nummer liefert eine negative Registerauskunft.

Angaben wie Vorname, Baujahr oder Datum koennen mehrere Treffer besitzen. In diesem
Fall nennt die Zentrale nur die Trefferzahl und fordert eine weitere Kennung. Eine
mehrdeutige Auskunft erzeugt keine Feststellung und belastet keinen NPC.

## Feststellungen

Eine Funkantwort kann nur dann automatisch ein Finding bestaetigen, wenn die
Auskunft fuer sich allein beweiskraeftig ist:

- Fuehrerscheinnummer nicht registriert
- Zulassungsnummer nicht registriert
- Kennzeichen nicht registriert
- Policennummer nicht registriert
- versichertes Kennzeichen nicht im Versicherungsregister
- registriertes Dokument ist zum Kontrollbeginn abgelaufen

Ein nicht gefundener Name, Hersteller oder ein einzelnes Datum reicht nicht als
Beweis fuer eine Faelschung.

## Gespraechsreiter

Die Gespraechsbox besitzt getrennte Reiter:

- `Fahrer` enthaelt Dokumentanforderungen und das Fahrergespraech.
- `Zentrale` enthaelt Funksprueche und Registerantworten.

Der Zentralenreiter oeffnet sich beim Start einer Funkabfrage automatisch. Beide
Reiter koennen geschlossen und ueber die Tab-Leiste erneut geoeffnet werden. Der
jeweilige Verlauf bleibt fuer die gesamte Kontrollsession erhalten.

## Spaetere Erweiterungen

Die Zentrale kann spaeter um Wartezeiten, Funkstoerungen, Rueckfragen, Prioritaeten
oder mehrere Antwortschritte erweitert werden. Die aktuelle Aufloesung bleibt eine
reine fachliche Funktion und ist deshalb nicht an vorbereitete UI-Texte gebunden.
