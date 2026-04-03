# Shell (Analytics Routing & Layout) Slice

Das "Shell" Verzeichnis ist der Entry-Point des gesamten Analytics-Moduls. 
Hier definieren wir das Rahmen-Layout (Top-Tabs, Seitenleiste) und orchestrieren die Teilmodule (`traffic`, `performance`, `seo`).

## Zuständigkeiten
1. Navigation: Routen-Definition zwischen den KPI-Bereichen.
2. Globaler State: Hält z.B. das global ausgewählte Datum ("Letzte 30 Tage"), welches an die Teilmodule heruntergereicht wird.
