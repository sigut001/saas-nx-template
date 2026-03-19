# Neues Feature hinzufügen

Diese Anleitung beschreibt wie ein neues Feature korrekt implementiert und dokumentiert wird.

---

## Checkliste: Neues Feature

### 1. NX Library anlegen
```bash
npx nx generate @nx/angular:library [feature-name] --directory=libs/[feature-name]
```

### 2. Pflichtdateien erstellen

```
libs/[feature-name]/
├── src/
│   ├── index.ts                    ← Public API (was exportiert wird)
│   └── lib/
│       ├── [feature].config.ts     ← Config-Interface + InjectionToken
│       ├── [feature].providers.ts  ← provide[Feature]() Funktion
│       ├── [feature].service.ts    ← Kernlogik
│       └── components/             ← UI-Komponenten (falls vorhanden)
├── setup.js                        ← Automatisches Einbindungs-Script
├── README.md                       ← Verwendung + API-Dokumentation
└── INTEGRATION.md                  ← Touch Points + Abhängigkeiten
```

### 3. `INTEGRATION.md` schreiben (Pflicht)

Jedes Feature muss eine `INTEGRATION.md` haben die dokumentiert:

```markdown
# [Feature] – Integration Points

## Was dieses Feature bietet
- provide[Feature]() – Setup-Funktion
- [Feature]Service – Kernlogik
- ...

## Touch Points (was wird verändert)
- [ ] app.config.ts → provide[Feature]() hinzufügen
- [ ] app.routes.ts → Neue Routen
- [ ] functions/src/index.ts → Cloud Functions erweitern
- [ ] firestore.rules → Neue Collections absichern
- [ ] saas.config.ts → Feature-Flags hinzufügen

## Abhängigkeiten
- [x] firebase-auth (AuthStateService)
- [ ] billing (optional, für Plan-Gates)

## setup.js automatisiert
- [x] app.config.ts Eintrag
- [x] app.routes.ts Routen
- [ ] Cloud Functions (manuell)
- [ ] Firestore Rules (manuell)
```

### 4. `saas.config.ts` erweitern

Neue Feature-Flags zum `SaaSFeatures` Interface hinzufügen:

```typescript
// apps/web/src/app/saas.config.ts
features: {
  // ...bestehende Flags...

  // [Feature Name]
  [featureName]: false,     // Default: deaktiviert
}
```

### 5. `app.routes.ts` anpassen

Feature-gesteuerte Routen hinzufügen:

```typescript
...(f.[featureName] ? [{
  path: '[route]',
  canActivate: [authGuard],
  loadComponent: () => import('...').then(m => m.[Feature]Component),
}] as Routes : []),
```

### 6. Dokumentation aktualisieren

- [ ] `docs/features.md` → Neues Feature im Katalog eintragen
- [ ] `docs/architecture.md` → Interaktionsmatrix aktualisieren
- [ ] `docs/configuration.md` → Neue Feature-Flags dokumentieren

### 7. Tests schreiben

```
scripts/test-[feature].ts    ← Bidirektionaler Test-Script
```

Mindestanforderungen:
- Test: Feature deaktiviert → Route/Funktion nicht verfügbar
- Test: Feature aktiviert → Route/Funktion verfügbar
- Test: Abhängigkeit fehlt → sinnvoller Fehler

---

## Vorlage: `INTEGRATION.md`

```markdown
# [Feature] – Integration Points

## Bietet
- `provide[Feature]()` – Provider-Funktion für app.config.ts
- `[Feature]Service` – Injectable Service
- `[Feature]Component` – UI-Komponente (falls vorhanden)

## Touch Points

### Automatisch (via setup.js)
- app.config.ts
- app.routes.ts
- saas.config.ts (Feature-Flags)

### Manuell
- functions/src/index.ts (falls Cloud Functions nötig)
- firestore.rules (falls neue Collections)
- environment.ts (falls neue API-Keys)

## Abhängigkeiten
| Feature | Pflicht | Grund |
|---|---|---|
| firebase-auth | ✅ | AuthStateService für aktuellen User |
| billing | ❌ | Optional: Plan-basierte Gates |

## Feature-Flags
| Flag | Default | Effekt |
|---|---|---|
| `[featureName]` | `false` | Feature an/aus |
```

---

## Vorlage: `provide[Feature]()`

```typescript
// libs/[feature]/src/lib/[feature].providers.ts
export function provide[Feature](config: [Feature]Config): EnvironmentProviders {
  // Features mit Defaults zusammenführen
  const features = { ...DEFAULT_[FEATURE]_FEATURES, ...(config.features ?? {}) };

  return makeEnvironmentProviders([
    { provide: [FEATURE]_CONFIG, useValue: config },
    { provide: [FEATURE]_FEATURES, useValue: features },
    [Feature]Service,
  ]);
}
```
