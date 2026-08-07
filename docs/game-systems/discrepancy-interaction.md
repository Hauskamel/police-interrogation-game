# Spielsystem: Diskrepanzen entdecken

Stand: 06.08.2026

## Ziel

Der Spieler soll eine erkannte Abweichung direkt an den geoeffneten Dokumenten
markieren. Eine lange Liste aller moeglichen Feststellungen wuerde die eigentliche
Denkarbeit durch Menuesuche ersetzen und bei wiederholten Kontrollen unnoetige
Klickarbeit verursachen.

Der Ablauf orientiert sich deshalb an einem visuellen Vergleich:

```text
Dokumente oeffnen
-> "Diskrepanz entdecken" aktivieren
-> relevantes Feld oder zwei Vergleichsfelder anklicken
-> System prueft genau diese Spieleraussage
-> Polizist spricht eine belegte Abweichung an
-> Fahrer antwortet im Gespraechsverlauf
```

## Fokusmodus

Der Button `Diskrepanz entdecken` ist erst aktiv, wenn mindestens ein Dokument
geoeffnet ist. Nach dem Aktivieren werden Welt und nicht relevante Panels abgedunkelt.
Nur folgende Elemente bleiben im Vordergrund:

- alle aktuell geoeffneten Dokumente
- die auswaehlbaren Dokumentfelder
- die auswaehlbaren Registerfelder im Police Laptop
- auswaehlbare Aussagen im Fahrergespräch
- die Gespraechsbox als sichtbare Belegflaeche
- Status und Abbruch des Diskrepanzmodus

Die Kontrollaktionen befinden sich in einer dauerhaft stabilen Iconleiste links
neben der Gespraechsbox. Sie enthaelt:

- aktuelle Kontrolldauer
- `Diskrepanz entdecken` beziehungsweise Abbruch der laufenden Auswahl
- `Kontrolle abschliessen`

Der aktive Diskrepanzbutton wird blau dargestellt. Ein Badge zeigt die Anzahl
bereits bestaetigter Findings. Tooltips und zugaengliche Beschriftungen erklaeren
die ansonsten rein visuellen Icons.

Der Modus zeigt keine versteckten Fehler an. Er hebt lediglich Felder hervor, die
fachlich geprueft werden koennen.

## Einzelfeldpruefung

Einige Angaben koennen ohne zweites sichtbares Dokumentfeld geprueft werden:

- Ablaufdatum eines Fuehrerscheins
- Ende des Versicherungsschutzes

Bei diesen Feldern beginnt die Auswertung direkt nach einem Klick. Ein gueltiges
Feld erzeugt kein Finding und der Fokusmodus bleibt fuer eine neue Auswahl offen.

Registerangaben werden nicht unsichtbar im Hintergrund verglichen. Identitaets-,
Fuehrerschein-, Fahrzeug- und Versicherungsdaten benoetigen die sichtbare Auswahl
des passenden Feldes im Police Laptop.

## Zweifeldvergleich

Angaben wie Name, Adresse oder Kennzeichen benoetigen einen sichtbaren Vergleich:

```text
Nachname auf dem Fuehrerschein
+ Halter-Nachname auf dem Fahrzeugschein
-> Werte vergleichen
```

Nach dem ersten Feld wartet das System auf ein Feld derselben Vergleichsgruppe auf
einem anderen Dokument oder im Police Laptop. Unpassende Felder wirken optisch
zurueckgenommen. Wird trotzdem ein inkompatibles Feld ausgewaehlt, beginnt damit
eine neue Auswahl.

```text
Ausstellungsdatum auf dem Fahrzeugschein
+ Ausstellungsdatum in der ueber das Kennzeichen gefundenen Fahrzeugakte
-> Werte und Record-Zuordnung pruefen
```

Der Laptopwert enthaelt intern die ID des geoeffneten Registerrecords. Eine fremde
Personen- oder Fahrzeugakte kann deshalb keine echte Dokumentfaelschung bestaetigen.

Zwei unterschiedliche Nachnamen sind nicht automatisch ein Verstoß. Fahrer und
eingetragener Halter duerfen verschiedene Personen sein. Der Resolver bestaetigt
das Finding nur, wenn die ausgewaehlte Abweichung gegen den amtlichen Record des
betroffenen Dokuments belegbar ist.

Bei gezielt erzeugten Identitaetsfaelschungen ist der Fahrer zugleich der echte
Fahrzeughalter. Dadurch existiert fuer Name und Adresse immer ein legitimes zweites
Dokumentfeld, ohne unterschiedliche Personen faelschlich gleichzusetzen.

## Zusammenspiel mit dem Police Laptop

Laptop, Dokumente und Kontrollaktionen bilden eine gemeinsame Arbeitsflaeche. Beim
Oeffnen des Laptops bleiben deshalb erhalten:

- alle geoeffneten Dokumente und ihre Positionen
- die Gespraechsbox mit Dokumentaktionen und Verlauf
- der Aktionsdock links neben der Gespraechsbox
- eine bereits begonnene Diskrepanz-Auswahl

Dokumente liegen ueber der Laptop-Anwendung und koennen weiterhin verschoben,
geschlossen und im Diskrepanzmodus ausgewaehlt werden. Der Laptop belegt die
darunterliegende Arbeitsflaeche und behaelt seine eigene Navigation sowie den zuletzt
geoeffneten Datenbankzustand.

Im aktiven Diskrepanzmodus bleiben Laptop und Gespraechsbox bedienbar. Aussagen wie
die genannte Anschrift können dadurch direkt mit Führerschein oder Personenregister
verglichen werden. Das bloße Stellen einer Frage erzeugt noch keine Feststellung.
Ein kleines Statusfeld am Aktionsdock zeigt `Feld auswaehlen`, bei Paarfeldern
`Vergleich 1/2` oder während einer Einzelfeldpruefung `Pruefung laeuft`.

## Feststellung und Gespraech

Ein bestaetigtes Finding wird genau einmal als strukturierter Eintrag in `findings`
aufgenommen. Der Eintrag enthält Finding-ID, Erkennungsweg, ausgewählte Belegfelder
und Spielzeitpunkt. Der
Fokusmodus schliesst sich anschliessend automatisch. Die Gespraechsbox zeigt dann:

1. die konkrete Ansprache des Polizisten,
2. eine kurze Antwort des Fahrers.

Die drei Dokumentaktionen befinden sich dauerhaft oberhalb des Gespraechsverlaufs.
So koennen Dokumente erneut angesehen werden, waehrend der untere und mittlere
Bereich spaeter fuer echte Gespraechsoptionen erweitert werden kann.

## Erweiterbare Fahrerantworten

Die UI erzeugt Fahrertexte nicht selbst. Sie ruft einen Dialog-Provider mit einem
strukturierten Kontext auf:

```js
{
    intent: "challenge_discrepancy",
    findingId: "driver_name_mismatch",
    findingLabel: "Name stimmt nicht ueberein",
    selectedFields: [/* sichtbare Spielerauswahl */]
}
```

Der aktuelle Provider liefert vorbereitete Texte. Seine Methode `respond(context)`
ist asynchron. Spaeter kann dieselbe Grenze verwendet werden fuer:

- mehrere regelbasierte Antwortvarianten
- Antworten nach Persoenlichkeit, Polizeistatus oder Beziehung
- mehrere auswaehlbare Fragen des Spielers
- Verweigerung, Nervositaet oder Folgefragen
- einen externen KI-Dialogdienst

Ein KI-Provider darf nur den freigegebenen Dialogkontext erhalten. Interne World
Truth, Loesungsdaten und nicht entdeckte Straftaten duerfen nicht ungefiltert in
einen externen Dienst gelangen.

## Aktuelle Grenze

Nur fachlich vergleichbare Registerwerte sind anklickbar. Polizeiliche Bewertungen,
Straftaten, Fahndungsprioritaeten und reine Statusanzeigen sind keine Dokumentfelder
und bleiben deshalb von der Diskrepanzmarkierung ausgeschlossen.
