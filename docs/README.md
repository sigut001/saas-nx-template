# SaaS Base Template – Dokumentation

Willkommen in der technischen Dokumentation des SaaS Base Templates.
Dieses Template ist eine **konfigurierbare Anwendungsstruktur** ohne Business-Logik.
Neue Funktionalitäten werden als **Features** (Module) eingebunden.

---

## Inhalt

| Dokument | Beschreibung |
|---|---|
| [features.md](./features.md) | Feature-Katalog, Namenskonventionen, Abhängigkeiten |
| [configuration.md](./configuration.md) | Konfigurationssystem, `saas.config.ts`, Feature-Configs |
| [architecture.md](./architecture.md) | Systemarchitektur, Modul-Interaktionsmatrix |
| [contributing.md](./contributing.md) | Neues Feature hinzufügen – Schritt für Schritt |

---

## Kernprinzipien

1. **Shell-Prinzip** – Die Anwendung ist eine leere Hülle. Business-Logik kommt durch Features.
2. **Feature = Modul** – Jede optionale Funktionalität ist ein eigenständiges NX-Library-Modul.
3. **Eine Config-Datei** – `saas.config.ts` ist der einzige Ort der pro Projekt angepasst wird.
4. **Explizite Abhängigkeiten** – Jedes Feature dokumentiert seine Touch Points.
5. **Testbarkeit** – Jedes Feature ist unabhängig testbar.

---

## Schnellstart

```bash
# 1. Repository klonen
git clone https://github.com/sigut001/saas-nx-template

# 2. Dependencies installieren
npm install

# 3. Firebase Auth einbinden
node libs/firebase-auth/setup.js --project=web

# 4. Konfiguration anpassen
# → apps/web/src/app/saas.config.ts

# 5. Entwicklungsserver starten
npx nx serve web
```

---

## Dokumentations-Konventionen

- Jedes neue Feature bekommt einen eigenen Abschnitt in `features.md`
- Jedes Feature-Modul hat eine eigene `README.md` und `INTEGRATION.md` in `libs/[feature]/`
- Änderungen an der Architektur werden in `architecture.md` nachgeführt
- Neue Config-Optionen werden in `configuration.md` dokumentiert
