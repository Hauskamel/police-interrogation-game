# Spielsystem: Herkunft und Aufenthaltsdokumente

Stand: 10.08.2026

## Ziel

Ausländische Fahrer sollen nicht nur eine andere Führerschein-Grafik besitzen. Ihre
Herkunft, der Grund der Einreise, die Aufenthaltsdauer, ihre Aussagen und die
mitgeführten Dokumente müssen fachlich zusammenpassen. Die erste Version erzeugt
deshalb ausschließlich wahrheitsgemäße Aussagen und korrekte Genehmigungen.
Fälschungen, fehlende Titel und Lügen werden später als eigene Kontrollfälle ergänzt.

## Herkunft und Aufenthalt

Westmark ist das Heimatland des aktuellen Spieltags. Jeder NPC besitzt ein
`countryOfOrigin`. Daraus wird ein `migrationProfile` abgeleitet:

```js
{
    status: "foreign_visitor",
    countryOfOrigin: "Auren",
    travelPurpose: "work",
    plannedStayDays: 365,
    arrivalDate: "2026-08-02",
    departureDate: "2027-08-02",
    requiresResidencePermit: true,
    requiresWorkPermit: true,
    localAddress: "Marktweg 8",
    employment: {
        occupation: "Monteur",
        employer: "Nordwerk Anlagenbau"
    }
}
```

Das Profil ist World Truth. Es wird nicht aus einem sichtbaren Dokument zurückgerechnet.
Die Dokumente und Antworten werden stattdessen aus dieser gemeinsamen Quelle erzeugt.

## Dokumentregeln

| Situation | Aufenthaltserlaubnis | Arbeitserlaubnis |
|---|---:|---:|
| NPC aus Westmark | nein | nein |
| kurze Durchreise | nein | nein |
| privater Besuch bis 90 Tage | nein | nein |
| privater Aufenthalt über 90 Tage | ja | nein |
| Erwerbstätigkeit in Westmark | ja | ja |

Eine Arbeitserlaubnis verweist über `residencePermitId` und
`residencePermitNumber` auf genau den Aufenthaltstitel desselben NPCs. Beide
Dokumente speichern außerdem `holderNpcId`. Dadurch lassen sich Inhaber,
Aufenthaltstitel und Arbeitserlaubnis relational auflösen, ohne Personendaten in
mehreren Records als Wahrheit zu duplizieren.

## Kontrollablauf

Ein ausländischer Führerschein verwendet `foreign-drivers-license.png`; das fehlende
regionale Wappen ist der visuelle Hinweis. Nach dem Öffnen wird folgende Frage
freigeschaltet:

> Ich sehe, Ihr Führerschein ist kein regionaler. Wo kommen Sie her und wie lange
> wird Ihr Aufenthalt dauern?

Der Fahrer antwortet entsprechend seinem echten Herkunftsland und Aufenthalt. Erst
danach erscheinen die tatsächlich mitgeführten Aufenthaltsdokumente als anforderbare
Optionen. So verrät die Bedienoberfläche nicht schon vor dem Gespräch, ob ein Titel
vorhanden sein müsste.

Bei einem langen Aufenthalt kann nach dem Aufenthaltsort gefragt werden. Bei einer
Erwerbstätigkeit kommt eine Frage nach Beruf und Arbeitgeber hinzu. Die Antworten
sind als vorbereitete `statementProfile.responses` gespeichert. Diese Schnittstelle
kann später regelbasierte Varianten oder einen KI-Dialog-Provider aufnehmen, ohne
die Kontrollsession neu zu modellieren.

## Behördenregister

Das amtliche Register verwaltet eigenständige Tabellen:

```text
peopleById
residencePermitsByNumber
workPermitsByNumber
```

Der Personenrecord speichert nur Referenznummern. Der Police Laptop löst die
Genehmigungen über `holderNpcId` auf und zeigt ihre Relation in der Personenakte.
Im Diskrepanzmodus können Herkunft und Aufenthaltstitel zwischen vorgelegtem Papier
und Register verglichen werden. `presented` oder andere World-Truth-Daten gelangen
nicht in den Laptop.

## Bewusst noch nicht enthalten

- gefälschte Aufenthalts- oder Arbeitserlaubnisse
- erfundene Herkunft, Aufenthaltsdauer oder Beschäftigung
- fehlende, vergessene oder verweigerte Migrationstitel als zufällige Szenarien
- Pass, Visum, Einreise- und Ausreisestempel
- unterschiedliche Regeln je Herkunftsland
