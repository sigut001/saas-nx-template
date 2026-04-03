# Google PageSpeed Insights API-Referenz (Analytics Modul)

Dieses Dokument definiert, welche Performance-Daten wir über die Google PageSpeed Insights API für unser Analytics-Dashboard (Teilmodul: `performance`) abrufen können.

## 1. Allgemeines zur API
Die PageSpeed Insights API ist das mächtigste Tool, um die **Core Web Vitals** (Ein entscheidender Google SEO Ranking Faktor) auszulesen.
Das brillante an dieser API ist, dass sie zwei völlig verschiedene Datenquellen in einem einzigen API Call bündelt:
1. **Labordaten (Lighthouse):** Ein von Google live durchgeführter Leistungstest der angefragten URL in einer simulierten Umgebung.
2. **Felddaten (CrUX - Chrome User Experience Report):** Echte, aggregierte Performance-Daten von echten Nutzern (über den Chrome Browser), gesammelt über die letzten 28 Tage.

- **Base URL:** `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`
- **Authentifizierung:** Ein einfacher Google Cloud API Key (URL-Parameter `&key=YOUR_API_KEY`). Für Testzwecke funktioniert die API sogar ohne Key (mit strengen Rate-Limits pro IP).

## 2. Der API Call
*Endpunkt / Payload:* wir senden keine JSON-Payloads via POST. Alles geschieht per GET-Request mit URL-Parametern.
Beispiel: `GET /runPagespeed?url=https://www.kundenwebsite.de/&category=PERFORMANCE&strategy=mobile`

- `strategy`: `desktop` oder `mobile` (Mobile ist bei Google Standard-Metrik).
- `category`: Limitieren auf `PERFORMANCE` (es gibt auch `SEO` oder `ACCESSIBILITY`, aber für unsere Vitals brauchen wir Performance).

## 3. Der JSON Response (Was greifen wir ab?)

Die Response ist gigantisch (oft hunderte Zeilen). Für unser Dashboard picken wir uns exakt die Core Web Vitals heraus.

### A. Echt-Nutzer Daten (CrUX Field Data)
Liegt im JSON Node `loadingExperience`. Das ist unser "Heiliger Gral" für die Performance-Analyse, da Google Websites anhand *dieser* Werte abstraft oder belohnt.

```json
"loadingExperience": {
  "metrics": {
    "CUMULATIVE_LAYOUT_SHIFT_SCORE": {
      "percentile": 0.01,
      "category": "FAST"
    },
    "LARGEST_CONTENTFUL_PAINT_MS": {
      "percentile": 1100,
      "category": "FAST"
    },
    "INTERACTION_TO_NEXT_PAINT_MS": {
      "percentile": 85,
      "category": "FAST"
    }
  },
  "overall_category": "FAST"
}
```
**Dashboard Mapping:**
- `overall_category` ("FAST", "AVERAGE", "SLOW") -> Wird zur Farbe (Grün, Gelb, Rot) in unserem Dashboard Ampel-System.
- LCP / CLS / INP `percentile` -> Das sind die echten Millisekunden-Werte, die wir dem Nutzer als große Zahlen präsentieren.

### B. Labordaten (Lighthouse)
Liegt im Node `lighthouseResult`. Diese Zahlen fluktuieren und existieren auch, wenn eine Website noch gar keine echten User hat (z.b. während dem Website-Umbau).

```json
"lighthouseResult": {
  "categories": {
    "performance": {
      "score": 0.95
    }
  },
  "fetchTime": "2026-04-02T10:00:00Z"
}
```
**Dashboard Mapping:**
- `score` * 100 -> Das ist der berühmte "Google Performance Score" von 0 bis 100.
- Wir können diesen als kreisförmigen Balken (Gauge-Chart) prominent im UI anzeigen.

## 4. Architektur-Herausforderungen

1. **Massive Ladezeiten der API:** Ein Anruf an die PageSpeed API dauert zwischen **10 und 20 Sekunden**, weil Google im Hintergrund live einen Chrome-Browser hochfährt und die Seite testet.
2. **Konsequenz für das Analytics-Dashboard:** Das Angular-Frontend darf *nicht* blockieren. Wir müssen die Kachel "Performance Test starten" mit einem asynchronen Loading-Spinner ausstatten, oder wir triggern den Test per Firebase Cloud Function 1x nachts per CRON-Job und speichern das Ergebnis im Firestore. Wenn der Kunde morgens sein Dashboard öffnet, ist das Diagramm sofort da (mit dem Zeitstempel der letzten Nacht).
