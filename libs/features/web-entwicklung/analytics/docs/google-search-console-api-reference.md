# Google Search Console API-Referenz (Analytics Modul)

Dieses Dokument dient als tiefgehende und neutrale Recherche-Grundlage für die Anbindung der Google Search Console (GSC) API. Es definiert, welche SEO-Daten Google uns auf programmatischem Weg für das Kunden-Dashboard zur Verfügung stellt.

## 1. Quellenangaben der Recherche
Die hier aufgeführten Funktionalitäten und Restriktionen stammen aus:
- **Offizielle Entwicklerdokumentation:** `developers.google.com/search/docs/essentials` und `developers.google.com/webmaster-tools/v1`
- **Branchen-Standards für API-Nutzung:** *Search Engine Journal* (API Guides) und Analyse von Drittanbieter-Tools (z.B. *RankStudio* / *Supermetrics*).

---

## 2. Authentifizierung & Base-URL
Im Gegensatz zu fast allen anderen Analyse-Tools reicht hier **kein** simpler "API Key". 
Google schützt Suchdaten extrem strikt. Die Authentifizierung erfordert zwingend **OAuth 2.0**.
- **Konsequenz für den Flow:** Entweder durchläuft der Kunde in unserem Dashboard einmalig einen "Sign in with Google"-Flow, um uns den OAuth-Token zu geben, ODER wir aggregieren zentral alle Websites unter einem Google Service Account, auf den wir vollen programmatischen Backend-Zugriff haben.
- **Base URL für alle Calls:** `https://www.googleapis.com/webmasters/v3/`

---

## 3. Die wichtigsten Endpunkte (Was können wir abfragen?)

Die API ist in vier Domänen aufgeteilt. Die wichtigste für Datendiagramme in Dashboards ist die `searchAnalytics.query`.

### A. Performance Daten (Search Analytics Query)
*Endpunkt:* `POST /sites/{siteUrl}/searchAnalytics/query`

Dies ist das absolute Herzstück der API. Es generiert den Traffic-Report, den man im GSC-Frontend sieht. Man schickt einen JSON-Body hin, in dem man exakt definiert, wie Google die Daten gruppieren (Dimension) und filtern soll.

**Google gibt exakt vier Messwerte (Metrics) zurück:**
1. **`clicks`**: Wie oft wurde auf einen bestimmten Link in der Suche geklickt?
2. **`impressions`**: Wie oft tauchte die Website überhaupt in Suchergebnissen auf (Sichtbarkeit)?
3. **`ctr` (Click-Through-Rate)**: Prozentsatz, wie viele Impressionen zu Klicks wurden.
4. **`position`**: Die durchschnittliche Ranking-Position (z.B. Platz 4.2).

**Gegen welche Gruppen (Dimensions) können wir diese vier Werte legen?**
- `date`: Zieht die Werte pro Tag (z.B. für eine Fieberkurve über 30 Tage).
- `query`: Das sind die **Suchbegriffe (Keywords)**. Wir können uns die Top 100 Suchbegriffe ziehen, über die Kunden die Seite gefunden haben.
- `page`: Wir können sehen, welche exakte Unterseite (z.B. `/kontakt` oder `/produkt-x`) am besten bei Google rankt.
- `country`: Ranking und Klickrate aufgeschlüsselt nach Ländern.
- `device`: Unterscheidung in `DESKTOP`, `MOBILE` oder `TABLET`.

*Beispiel:* Wir können anfragen: "Zeige mir alle Keywords (`query`), bei denen die Nutzer mit einem Handy (`device`) aus Deutschland (`country`) gesucht haben."

### B. URL-Indexierungs-Prüfung (URL Inspection Tool)
*Endpunkt:* `POST /sites/{siteUrl}/index/inspect`
Dieser Endpunkt erlaubt tiefere technische Einblicke in bestimmte Einzelseiten:
- Wir können eine URL hinschicken und Google antwortet, ob diese Seite überhaupt im Google-Index existiert oder durch Fehler (z.B. ein falscher Canonical-Tag) blockiert ist.
- Es gibt den "Mobile Usability" Status (Hat Google gewarnt, weil ein Button auf dem Smartphone zu klein ist?)

### C. Sitemaps Management
*Endpunkte:* `GET /sites/{siteUrl}/sitemaps` und `PUT /sites/{siteUrl}/sitemaps/{feedpath}`
Anstatt Sitemaps manuell hochzuladen, kann unser SaaS-System bei jeder neuen Veröffentlichung einer Seite vollautomatisch die aktuelle XML-Sitemap per API bei Google einreichen.

### D. Sites Management
*Endpunkt:* `GET /sites`
Gibt schlichtweg eine Liste aller Domains zurück, für die wir in unserem Google Account Analyse-Rechte besitzen.

---

## 4. Wichtige Architektur-Limits (Was die API NICHT kann)

Wenn wir ein Analytics-Modul um diese Endpunkte herumbauen, müssen wir folgende Hürden einplanen:

1. **Starke Zeitverzögerung (Latency):**
   - Google berechnet Suchdaten nicht live. Die API liefert ihre Ergebnisse in der Regel mit **2 bis 3 Tagen Verzögerung**. Ein Dropdown im Dashboard, das "Google Traffic von Gestern" zeigen soll, bleibt leer.
2. **Datenschutz (Not Provided):**
   - Wenn das Keyword extrem selten ist (z.B. der absolute Vor- und Nachname eines Kunden in Kombination mit dessen Wohnort), schützt Google die Anonymität und zensiert diesen Begriff aus der `query` Dimension. Die API-Zahlen für Klicks sind daher bei Keywords nie zu 100% kongruent mit den Gesamt Klicks.
3. **Paginierungs-Limits:**
   - Große Calls (z.B. "Zeige alle 15.000 Keywords der Firma") müssen in 1.000er Schritten (`startRow`) im Backend hintereinander gezogen werden, da Google pro Tag eine harte Hürde von 50.000 Zeilen bei der API abriegelt.
