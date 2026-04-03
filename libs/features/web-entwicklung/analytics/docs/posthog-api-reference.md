# Vollständige PostHog API-Referenz (Free Tier Capabilities)

Dieses Dokument dient als neutrale Recherche-Grundlage. Es listet auf, was die PostHog REST-API im Free-Tier nativ fähig ist an Drittsysteme zu liefern. 

## 1. Auth & Allgemeine Limitierungen
- **Tier-Beschränkungen:** Die API hat im Free-Tier *exakt dieselben Funktionen* wie in den Bezahl-Modellen. Es gibt keine versteckten Endpunkte oder beschnittene Daten-APIs für kostenlose Accounts.
- **Rate-Limits:** 
  - Standard-Endpunkte (GET/POST/PATCH/DELETE): max. 240 Requests pro Minute.
  - Query-API (HogQL): max. 2.400 Requests pro Stunde.
- **Daten-Historie:** Die API liefert Events und User-Eigenschaften bis zu 1 Jahr rückwirkend aus. Session-Recordings sind nur 1 Monat abrufbar.
- **Zugriff:** Authentifizierung via *Personal API Key* (`Authorization: Bearer <Key>`).

---

## 2. Welche Daten kann die API liefern? (Die Endpunkte)

### A. Insights & Analytics (Aggregierte Daten)
Über den Endpunkt `/api/projects/:project_id/insights/` liefert PostHog fertig berechnete Datensätze für Dashboards:
- **Trends:** Zeitverläufe jeglicher Web-Events (z.B. "Wie viele Besucher aus Deutschland klickten Button X?"). Liefert Arrays von Tagen und den gezählten Werten.
- **Funnels (Trichter):** Analyse der Drop-off-Raten zwischen definierten Schritten (z.B. `Besuch Startseite` -> `Scrollt bis Pricing` -> `Klickt Kontakt`).
- **Paths (Pfade):** Welche genauen URL-Klick-Pfade Nutzer auf der Website durchlaufen haben (nützlich für "Sankey Flow" Diagramme).
- **Retention (Kundenbindung):** Welcher Prozentsatz der Nutzer kommt nach 1, 3, 7 Tagen auf die Website zurück.
- **Stickiness:** Wie intensiv die Website an aufeinanderfolgenden Tagen genutzt wird.

### B. Persons & Properties (Besucher-Daten)
Über den Endpunkt `/api/projects/:project_id/persons/` können einzelne Nutzerprofile ausgelesen werden:
- **Identifikation:** E-Mail-Adressen, Namen (falls über Formulare ans Tracking übergeben, z.B. nach einem Login/Lead-Formular).
- **Technik-Daten:** Genutzter Browser, Betriebssystem, Device-Kategorie (Mobile/Tablet/Desktop), Bildschirmauflösung.
- **Geolokation:** Herkunftsland und Stadt anhand der IP-Adresse.
- **Kohorten:** Rückgabe genau der Gruppe an Nutzern, die einem bestimmten Muster entsprechen (z.B. "Alle, die aus dem Google Ads Kanal kamen").

### C. Raw Events (Rohdaten des Traffics)
Über `/api/projects/:project_id/events/` gibt es ein tabellarisches, ungefiltertes Logfile:
- Jede URL, die aufgerufen wurde, sortiert nach Timestamp.
- Die genauen Referrer (z.B. "Google Suche", "LinkedIn", "Newsletter"), von denen der Nutzer auf die Seite kam.

### D. Session Recordings (Bildschirm-Aufnahmen)
Über `/api/projects/:project_id/session_recordings/` liefert die API Listen aller Verhaltensaufnahmen.
- Meta-Daten: Wie lang war die Sitzung? Gab es "Rage Clicks" (Frustriertes Klicken)? Gab es Javascript-Fehler auf der Seite?
- *Technischer Hinweis:* Die API streamt kein `.mp4` Video. Es werden "Snapshots" (DOM-Veränderungen im Browser als JSON) gesendet, die man in Frontend-Playern (z.B. via rrweb / nativem PostHog UI) als Video simulieren muss.

### E. Feature Flags & Experiments (A/B Testing)
Über `/api/projects/:project_id/feature_flags/`
- Die API kann genutzt werden, um per Skript zu prüfen oder steuern, ob z.B. das "Rote Banner" gerade 50% der Nutzer angezeigt wird oder nicht.

---

## 3. Architektur-Wege zum Auslesen (Wie greifen wir sie ab?)

Um diese Daten abzugreifen, bietet die PostHog Doku zwei Pfade:

1. **Die Endpoint-Architektur (Empfohlen für Dashboards):** 
Man "baut" das benötigte Chart einmal im PostHog UI zusammen (z.B. ein Tortendiagramm über die Browsernutzung). PostHog generiert dafür eine feste API-URL (`/api/environments/:environment_id/endpoints/`). Unser Code ruft stumpf diese URL ab und bekommt pfeilschnell das fertig gecachte JSON-Ergebnis für unser UI-Design.

2. **Die Query API (Die HogQL-Maschine):** 
Man schickt via POST einen direkten SQL-Befehl (z. B. `SELECT properties.$browser, count() FROM events WHERE event = '$pageview' GROUP BY properties.$browser`) an `/api/projects/:project_id/query/`. PostHog berechnet die Zahlen live und wirft das Ergebnis aus. Extrem flexibel, aber rate-limited.
