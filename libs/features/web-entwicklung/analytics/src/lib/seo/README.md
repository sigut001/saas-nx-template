# SEO (Google Search Console) Slice

In diesem Verzeichnis liegt die gesamte gekapselte Logik für Suchmaschinendaten.

## Struktur
- `ui/`: Datentabellen für Keywords und Clicks / Impressions-Diagramme.
- `data-access/`: Angular Services, die über eine Cloud Function (mittels OAuth Service Account) sichere Daten von GSC ziehen.
