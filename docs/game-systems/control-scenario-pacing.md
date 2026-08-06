# Spielsystem: Kontrollfaelle und Pacing

Stand: 06.08.2026

## Ziel

Der Spieler soll bei einer Verkehrskontrolle nicht bereits aus der Haeufigkeit
vorhersehen koennen, dass fast immer ein unauffaelliger Zivilist erscheint. Gleichzeitig
darf auch nicht jede Kontrolle eine Faelschung enthalten, weil der Spieler sonst
automatisch bei jedem Dokument einen Fehler erwartet.

Der `ControlScenarioDirector` waehlt deshalb vor jedem zufaelligen Spawn zuerst eine
spielbare Kontrollaufgabe. Erst danach wird eine passende `TrafficEntity` erzeugt.

```text
Pacing-Verlauf
-> Kontrollfall auswaehlen
-> passenden NPC-Typ bestimmen
-> NPC, Fahrzeug und Dokumente erzeugen
-> erfolgreich spawnen
-> Kontrolle abschliessen
-> Ergebnis und Kontrollfall in den Verlauf aufnehmen
```

## Zwei getrennte Fragen

Das System trennt bewusst zwei Aspekte, die vorher ueber dieselbe Zufallsauswahl
gesteuert wurden:

1. **Wer ist der NPC in der Welt?**
   Zivilist, unbekannter Straftaeter, polizeibekannter Straftaeter oder aktiv gesuchte
   Person.
2. **Was ist die spielbare Aufgabe dieser Kontrolle?**
   Unauffaelliger Fall, abgelaufenes Dokument, konkrete Dokumentfaelschung oder
   Fahndungstreffer.

Ein unbekannter Straftaeter kann deshalb vollkommen glaubwuerdige Dokumente vorlegen.
Seine verborgenen Straftaten sind erst fuer spaetere Ermittlungsmechaniken relevant.
Umgekehrt kann ein nicht polizeibekannter Fahrer manipulierte Dokumente besitzen.
Eine Faelschung macht ihn nicht automatisch zu einem bereits bekannten Straftaeter.

## Kontrollfalltypen

| Kontrollfall | Kategorie | Standardgewicht | Erzeugte Auffaelligkeit |
|---|---:|---:|---|
| `clean` | unauffaellig | 25 | Keine Faelschung und kein abgelaufenes Dokument |
| `expired_license` | abgelaufen | 10 | Abgelaufener Fuehrerschein |
| `expired_insurance` | abgelaufen | 7 | Abgelaufener Versicherungsschutz |
| `forged_identity` | Faelschung | 14 | Manipulierter Fuehrerschein |
| `forged_vehicle` | Faelschung | 11 | Manipulierte Zulassungsdaten |
| `forged_insurance` | Faelschung | 10 | Manipulierter Versicherungsnachweis |
| `missing_license` | Dokumentvorlage | 7 | Fuehrerschein vergessen |
| `missing_insurance` | Dokumentvorlage | 6 | Versicherungsnachweis verloren |
| `initial_refusal` | Dokumentvorlage | 5 | Fahrzeugpapiere erst nach erneuter Aufforderung |
| `final_refusal` | Dokumentvorlage | 4 | Fahrzeugpapiere werden endgültig verweigert |
| `wrong_document` | Dokumentvorlage | 4 | Unpassender Versicherungsnachweis wird vorgelegt |
| `damaged_document` | Dokumentvorlage | 5 | Erheblich beschaedigte Fahrzeugpapiere |
| `contradictory_statement` | Befragung | 7 | Anschrift widerspricht der Identitaet |
| `hidden_offender` | verborgener Hintergrund | 5 | Unbekannter Straftaeter ohne erkennbare Auffaelligkeit |
| `multi_issue` | kombinierter Fall | 4 | Faelschung, Ablaufdatum und Aussage greifen ineinander |
| `wanted_person` | Fahndung | 10 | Fahrer besitzt eine passende aktive Fahndung |

Die Gewichte sind keine zugesicherten Prozentwerte fuer jede kleine Spielserie.
Die Pacing-Regeln veraendern die jeweilige Kandidatenmenge dynamisch. Langfristig
geben die Gewichte aber die gewuenschte Tendenz vor.

## Schutz vor langweiligen oder vorhersehbaren Serien

Der Director betrachtet nur abgeschlossene Zufallskontrollen und wendet folgende
Regeln an:

- hoechstens zwei unauffaellige Faelle direkt hintereinander
- hoechstens zweimal derselbe konkrete Kontrollfall hintereinander
- mindestens eine Dokumentfaelschung innerhalb von fuenf erfolgreichen Kontrollen
- nach einem Fahndungsfall mindestens drei andere Kontrollen
- kein Fahndungsfall, wenn aktuell kein geeigneter Datenbank-NPC verfuegbar ist

Ein Spawn oder eine nie abgeschlossene Kontrolle veraendert den Verlauf nicht. Dadurch
kann weder ein technisch nicht erzeugbarer noch ein lediglich vorbeifahrender Fall
das Pacing unbemerkt verschieben.

## Schwierigkeitsstufen

Die Zahl abgeschlossener Kontrollen schaltet Komplexitaet stufenweise frei:

- Faelle 1 bis 3: einzelne Auffaelligkeiten mit `complexityLevel: 1`
- ab Fall 4: Vergleiche, Befragungen und Fahndungen mit `complexityLevel: 2`
- ab Fall 11 und mindestens 60 Punkten im Durchschnitt der letzten fünf Kontrollen:
  kombinierte Faelle mit `complexityLevel: 3`

Der Verlauf speichert Falltyp, Kategorie, Ergebnis und Punktzahl. Die Stufe wird
daraus abgeleitet und nicht redundant in einem zweiten Fortschrittswert gespeichert.

## Zentrales Balancing

Szenariogewichte, Seriengrenzen, Freischaltschwellen und Punkteanteile liegen zentral
in `inspectionBalancing.js`. Auswahl und Evaluator lesen dieselbe Konfiguration.
Dadurch kann das Spielgefühl angepasst werden, ohne Fachlogik an mehreren Stellen zu
verändern.

## Zusammenspiel mit den Generatoren

Das Fallrezept wird in bestehende, konkrete Generatoroptionen uebersetzt:

```text
forged_identity
-> forcedHasForgery: true
-> forcedForgeryTarget: Fuehrerschein

expired_insurance
-> forcedHasForgery: false
-> forcedInsuranceExpired: true
```

Die Dokumentgeneratoren entscheiden weiterhin, wie die konkrete Abweichung aussieht.
Bei `forged_identity` kann beispielsweise Name, Adresse, Geburtsdatum oder
Fuehrerscheinnummer manipuliert werden. Der Director legt nur fest, welches Dokument
die spielrelevante Auffaelligkeit enthaelt.

Fuer einen abgelaufenen Fuehrerschein wird ein Fahrer erzeugt, der alt genug ist,
damit der Dokumentlebenslauf plausibel bleibt. Ein geplanter Fahndungsfall verwendet
immer eine passende aktive Fahndung aus der Polizei-Datenbank und wird nicht still
in einen anderen NPC-Typ umgewandelt.

## Bedeutung von `inspectionProfile`

Jeder Kontrollfall liefert weiterhin:

- `complexityLevel`: grobe Schwierigkeit der Kontrolle
- `deceptionRisk`: erwartetes Mass bewusster Taeuschung
- `focusAreas`: relevante Pruefbereiche fuer Debugging und spaetere Hilfesysteme

Diese Werte beschreiben nicht die Weltwahrheit des NPCs und werden dem Spieler nicht
als Loesung angezeigt. Der Kontrollfall ueberschreibt damit lediglich das generische
Pruefprofil der erzeugten TrafficEntity.

## Debugging

`Spawn Random NPC` in lil-gui verwendet den Director als Blindtest. lil-gui zeigt
vor dem Spawn weder NPC-Typ noch Auffaelligkeit. Nachtraeglich kann im Debug-Profil
unter `controlScenarioType` und `controlScenarioCategory` geprueft werden, ob der
erzeugte Fall zum Dokumentzustand passt.

Manuell konfigurierte Dev-Spawns bleiben davon unabhaengig. Sie dienen weiterhin
zum gezielten Testen einzelner Kombinationen und beeinflussen den zufaelligen
Pacing-Verlauf nicht.

## Phase-2-Erweiterung

Der Director erzeugt jetzt auch Dokumentverfuegbarkeit, vorbereitete Aussagen und
kombinierte Faelle. Diese Eigenschaften entstehen weiterhin aus einem bewussten
Fallrezept und nicht durch voneinander unabhaengige Zufallsentscheidungen in der UI.
Weitere Falltypen koennen deshalb ergaenzt werden, ohne NPC- und Fahrzeugprofile neu
zu strukturieren.
